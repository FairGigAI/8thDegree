from fastapi import APIRouter, HTTPException, status
from typing import List
from app.core.rate_limit import rate_limit
from app.schemas.job import Job
from app.schemas.freelancer import Freelancer
from app.models.job import Job as JobModel
from app.models.freelancer import Freelancer as FreelancerModel
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()

@router.get("/jobs", response_model=List[Job])
@rate_limit(limit=100, period=60)  # 100 requests per minute
async def get_public_jobs():
    """Get a list of public job listings with limited information."""
    try:
        jobs = await JobModel.get_public_listings()
        return jobs
    except Exception as e:
        logger.error(f"Error fetching public jobs: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching public jobs"
        )

@router.get("/freelancers", response_model=List[Freelancer])
@rate_limit(limit=100, period=60)  # 100 requests per minute
async def get_public_freelancers():
    """Get a list of public freelancer profiles with limited information."""
    try:
        freelancers = await FreelancerModel.get_public_profiles()
        return freelancers
    except Exception as e:
        logger.error(f"Error fetching public freelancers: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching public freelancers"
        ) 