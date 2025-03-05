from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.deps import get_db, get_current_user
from app.services.matching_service import MatchingService
from app.schemas.job import JobResponse
from app.models.freelancer import Freelancer

router = APIRouter()

class MatchFilters(BaseModel):
    location: Optional[str] = None
    min_rate: Optional[float] = None
    max_rate: Optional[float] = None
    languages: Optional[List[str]] = None

class JobMatch(BaseModel):
    job: JobResponse
    similarity_score: float

@router.get("/match-jobs/", response_model=List[JobMatch])
async def get_matching_jobs(
    limit: int = Query(10, gt=0, le=50),
    min_similarity: float = Query(0.7, gt=0, le=1.0),
    filters: Optional[MatchFilters] = None,
    db: Session = Depends(get_db),
    current_user: Freelancer = Depends(get_current_user)
):
    """
    Get matching jobs for the current freelancer.
    
    Parameters:
    - limit: Maximum number of matches to return (default: 10, max: 50)
    - min_similarity: Minimum similarity score for matches (default: 0.7)
    - filters: Optional filters for location, rate range, and languages
    """
    try:
        matching_service = MatchingService(db)
        matches = await matching_service.find_matching_jobs(
            freelancer_id=current_user.id,
            limit=limit,
            min_similarity=min_similarity,
            filters=filters.dict() if filters else None
        )
        
        return [
            JobMatch(
                job=JobResponse.from_orm(match["job"]),
                similarity_score=match["similarity_score"]
            )
            for match in matches
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error finding matching jobs: {str(e)}"
        ) 