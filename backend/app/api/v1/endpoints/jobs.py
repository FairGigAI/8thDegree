from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from app.core.rate_limit import rate_limit
from app.schemas.job import (
    Job, JobCreate, JobUpdate, JobApplication,
    JobApplicationResponse, JobStatus
)
from app.models.job import Job as JobModel
from app.models.job_application import JobApplication as JobApplicationModel
from app.core.deps import get_current_user
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()

@router.post("/", response_model=Job)
@rate_limit(limit=10, period=60)  # 10 requests per minute
async def create_job(
    job: JobCreate,
    current_user = Depends(get_current_user)
):
    """Create a new job posting."""
    try:
        db_job = await JobModel.create(
            **job.dict(),
            client_id=current_user.id
        )
        return db_job
    except Exception as e:
        logger.error(f"Error creating job: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating job"
        )

@router.get("/", response_model=List[Job])
@rate_limit(limit=100, period=60)  # 100 requests per minute
async def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: JobStatus = None,
    current_user = Depends(get_current_user)
):
    """List all jobs with optional filtering."""
    try:
        jobs = await JobModel.get_all(
            skip=skip,
            limit=limit,
            status=status
        )
        return jobs
    except Exception as e:
        logger.error(f"Error listing jobs: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error listing jobs"
        )

@router.get("/{job_id}", response_model=Job)
@rate_limit(limit=100, period=60)  # 100 requests per minute
async def get_job(
    job_id: int,
    current_user = Depends(get_current_user)
):
    """Get a specific job by ID."""
    try:
        job = await JobModel.get(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        return job
    except Exception as e:
        logger.error(f"Error getting job: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting job"
        )

@router.post("/{job_id}/apply", response_model=JobApplicationResponse)
@rate_limit(limit=5, period=60)  # 5 requests per minute
async def apply_for_job(
    job_id: int,
    application: JobApplication,
    current_user = Depends(get_current_user)
):
    """Apply for a job."""
    try:
        # Check if job exists and is open
        job = await JobModel.get(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        if job.status != JobStatus.OPEN:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job is not open for applications"
            )

        # Create application
        db_application = await JobApplicationModel.create(
            **application.dict(),
            job_id=job_id,
            freelancer_id=current_user.id
        )
        return db_application
    except Exception as e:
        logger.error(f"Error applying for job: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error applying for job"
        ) 