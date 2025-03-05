from typing import List, Dict, Any
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import text
import openai
from app.core.config import settings
from app.models.job_match import JobEmbedding, FreelancerEmbedding, MatchHistory
from app.models.job import Job
from app.models.freelancer import Freelancer
from app.core.logging import get_logger

logger = get_logger(__name__)

class MatchingService:
    def __init__(self, db: Session):
        self.db = db
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        self.embedding_model = "text-embedding-3-small"

    async def get_embedding(self, text: str) -> List[float]:
        """Get embedding vector for text using OpenAI's API."""
        try:
            response = await self.client.embeddings.create(
                model=self.embedding_model,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error("Error getting embedding", error=str(e))
            raise

    async def create_job_embedding(self, job: Job) -> JobEmbedding:
        """Create embedding for a job posting."""
        # Combine relevant job fields into a single text
        job_text = f"{job.title} {job.description} {job.required_skills} {job.preferred_qualifications}"
        
        embedding = await self.get_embedding(job_text)
        
        job_embedding = JobEmbedding(
            job_id=job.id,
            embedding=embedding,
            embedding_model=self.embedding_model
        )
        self.db.add(job_embedding)
        self.db.commit()
        return job_embedding

    async def create_freelancer_embedding(self, freelancer: Freelancer) -> FreelancerEmbedding:
        """Create embedding for a freelancer profile."""
        # Combine relevant freelancer fields
        freelancer_text = f"{freelancer.title} {freelancer.description} {' '.join(freelancer.skills)}"
        
        embedding = await self.get_embedding(freelancer_text)
        
        freelancer_embedding = FreelancerEmbedding(
            freelancer_id=freelancer.id,
            embedding=embedding,
            embedding_model=self.embedding_model
        )
        self.db.add(freelancer_embedding)
        self.db.commit()
        return freelancer_embedding

    def calculate_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))

    async def find_matching_jobs(
        self,
        freelancer_id: int,
        limit: int = 10,
        min_similarity: float = 0.7,
        filters: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """Find matching jobs for a freelancer."""
        try:
            # Get freelancer embedding
            freelancer = self.db.query(Freelancer).filter(Freelancer.id == freelancer_id).first()
            if not freelancer:
                raise ValueError(f"Freelancer {freelancer_id} not found")

            freelancer_embedding = self.db.query(FreelancerEmbedding).filter(
                FreelancerEmbedding.freelancer_id == freelancer_id
            ).first()

            if not freelancer_embedding:
                freelancer_embedding = await self.create_freelancer_embedding(freelancer)

            # Build the base query with filters
            query = self.db.query(Job, JobEmbedding).join(JobEmbedding)

            if filters:
                if filters.get("location"):
                    query = query.filter(Job.location == filters["location"])
                if filters.get("min_rate"):
                    query = query.filter(Job.hourly_rate >= filters["min_rate"])
                if filters.get("max_rate"):
                    query = query.filter(Job.hourly_rate <= filters["max_rate"])
                if filters.get("languages"):
                    query = query.filter(Job.required_languages.contains(filters["languages"]))

            # Get all potential matches
            potential_matches = query.all()

            # Calculate similarities and sort
            matches = []
            for job, job_embedding in potential_matches:
                similarity = self.calculate_similarity(
                    freelancer_embedding.embedding,
                    job_embedding.embedding
                )

                if similarity >= min_similarity:
                    matches.append({
                        "job": job,
                        "similarity_score": similarity
                    })

                    # Store match history
                    match_history = MatchHistory(
                        freelancer_id=freelancer_id,
                        job_id=job.id,
                        similarity_score=similarity,
                        match_metadata={
                            "embedding_model": self.embedding_model,
                            "filters_applied": filters
                        }
                    )
                    self.db.add(match_history)

            # Sort by similarity score
            matches.sort(key=lambda x: x["similarity_score"], reverse=True)
            
            # Commit match history
            self.db.commit()

            return matches[:limit]

        except Exception as e:
            self.db.rollback()
            logger.error("Error finding matching jobs", error=str(e), freelancer_id=freelancer_id)
            raise

    async def update_embeddings(self, job_id: int = None, freelancer_id: int = None):
        """Update embeddings for a job or freelancer when their data changes."""
        try:
            if job_id:
                job = self.db.query(Job).filter(Job.id == job_id).first()
                if job:
                    # Delete existing embedding
                    self.db.query(JobEmbedding).filter(JobEmbedding.job_id == job_id).delete()
                    # Create new embedding
                    await self.create_job_embedding(job)

            if freelancer_id:
                freelancer = self.db.query(Freelancer).filter(Freelancer.id == freelancer_id).first()
                if freelancer:
                    # Delete existing embedding
                    self.db.query(FreelancerEmbedding).filter(
                        FreelancerEmbedding.freelancer_id == freelancer_id
                    ).delete()
                    # Create new embedding
                    await self.create_freelancer_embedding(freelancer)

            self.db.commit()

        except Exception as e:
            self.db.rollback()
            logger.error("Error updating embeddings", error=str(e))
            raise 