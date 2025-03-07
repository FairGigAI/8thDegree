from typing import Dict, List, Any, Optional
import httpx
from pydantic import BaseModel
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

class EmbeddingResponse(BaseModel):
    vector: List[float]
    model_version: str
    dimension: int
    metadata: Optional[Dict[str, Any]] = None

class BiasResponse(BaseModel):
    score: float
    confidence: float
    categories: List[str]
    findings: Dict[str, Any]
    recommendations: Optional[Dict[str, Any]] = None
    requires_review: bool

class MatchResponse(BaseModel):
    freelancer_id: str
    score: float
    confidence: float
    ranking: Optional[int] = None
    components: Dict[str, float]
    factors: Dict[str, Any]

class AIServiceClient:
    """Client for communicating with the AI service."""
    
    def __init__(self):
        self.base_url = settings.AI_SERVICE_URL
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=30.0,
            headers={"X-API-Key": settings.AI_SERVICE_API_KEY}
        )
        
    async def generate_embedding(
        self,
        text: str,
        entity_type: str,
        entity_id: str
    ) -> EmbeddingResponse:
        """Generate embeddings for text."""
        try:
            response = await self.client.post(
                "/embeddings",
                json={
                    "text": text,
                    "entity_type": entity_type,
                    "entity_id": entity_id
                }
            )
            response.raise_for_status()
            return EmbeddingResponse(**response.json())
        except Exception as e:
            logger.error("Error generating embedding", error=str(e))
            raise
            
    async def detect_bias(
        self,
        text: str,
        entity_type: str,
        entity_id: str
    ) -> BiasResponse:
        """Detect bias in text."""
        try:
            response = await self.client.post(
                "/bias/detect",
                json={
                    "text": text,
                    "entity_type": entity_type,
                    "entity_id": entity_id
                }
            )
            response.raise_for_status()
            return BiasResponse(**response.json())
        except Exception as e:
            logger.error("Error detecting bias", error=str(e))
            raise
            
    async def find_matches(
        self,
        job_id: str,
        limit: int = 10,
        min_score: float = 0.7
    ) -> List[MatchResponse]:
        """Find matching freelancers for a job."""
        try:
            response = await self.client.get(
                f"/matching/job/{job_id}",
                params={
                    "limit": limit,
                    "min_score": min_score
                }
            )
            response.raise_for_status()
            return [MatchResponse(**match) for match in response.json()]
        except Exception as e:
            logger.error("Error finding matches", error=str(e))
            raise
            
    async def find_matches_for_freelancer(
        self,
        freelancer_id: str,
        limit: int = 10,
        min_score: float = 0.7
    ) -> List[MatchResponse]:
        """Find matching jobs for a freelancer."""
        try:
            response = await self.client.get(
                f"/matching/freelancer/{freelancer_id}",
                params={
                    "limit": limit,
                    "min_score": min_score
                }
            )
            response.raise_for_status()
            return [MatchResponse(**match) for match in response.json()]
        except Exception as e:
            logger.error("Error finding matches for freelancer", error=str(e))
            raise
            
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

# Global instance
ai_service = AIServiceClient() 