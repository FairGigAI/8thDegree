from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.job import Job
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse
from app.core.logging import get_logger
from app.core.security import verify_job_owner
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)
logger = get_logger(__name__)

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_job(
    *,
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new job listing.
    Rate limit: 10 requests per minute per IP.
    """
    try:
        job = Job(
            **job_in.dict(),
            owner_id=current_user.id
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        logger.info("Job created successfully", job_id=job.id, user_id=current_user.id)
        return job
    except Exception as e:
        logger.error("Error creating job", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create job"
        )

@router.get("/", response_model=List[JobResponse])
@limiter.limit("60/minute")
async def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    location: Optional[str] = None,
    min_rate: Optional[float] = None,
    max_rate: Optional[float] = None,
    skills: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db)
):
    """
    List all jobs with optional filtering.
    Rate limit: 60 requests per minute per IP.
    """
    try:
        query = db.query(Job)
        
        if location:
            query = query.filter(Job.location == location)
        if min_rate is not None:
            query = query.filter(Job.hourly_rate >= min_rate)
        if max_rate is not None:
            query = query.filter(Job.hourly_rate <= max_rate)
        if skills:
            query = query.filter(Job.required_skills.overlap(skills))
            
        total = query.count()
        jobs = query.offset(skip).limit(limit).all()
        
        logger.info("Jobs retrieved successfully", count=len(jobs), total=total)
        return jobs
    except Exception as e:
        logger.error("Error retrieving jobs", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve jobs"
        )

@router.get("/{job_id}", response_model=JobResponse)
@limiter.limit("60/minute")
async def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific job by ID.
    Rate limit: 60 requests per minute per IP.
    """
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            logger.warning("Job not found", job_id=job_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        return job
    except Exception as e:
        logger.error("Error retrieving job", error=str(e), job_id=job_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve job"
        )

@router.put("/{job_id}", response_model=JobResponse)
@limiter.limit("10/minute")
async def update_job(
    job_id: int,
    job_in: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a job listing.
    Rate limit: 10 requests per minute per IP.
    """
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
            
        verify_job_owner(job, current_user)
        
        for field, value in job_in.dict(exclude_unset=True).items():
            setattr(job, field, value)
            
        db.commit()
        db.refresh(job)
        logger.info("Job updated successfully", job_id=job_id)
        return job
    except Exception as e:
        logger.error("Error updating job", error=str(e), job_id=job_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update job"
        )

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("10/minute")
async def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a job listing.
    Rate limit: 10 requests per minute per IP.
    """
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
            
        verify_job_owner(job, current_user)
        
        db.delete(job)
        db.commit()
        logger.info("Job deleted successfully", job_id=job_id)
    except Exception as e:
        logger.error("Error deleting job", error=str(e), job_id=job_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete job"
        )

@router.post("/{job_id}/apply", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def apply_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Apply for a job.
    Rate limit: 5 requests per minute per IP.
    """
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
            
        # Check if user has already applied
        if db.query(JobApplication).filter(
            JobApplication.job_id == job_id,
            JobApplication.freelancer_id == current_user.id
        ).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already applied for this job"
            )
            
        application = JobApplication(
            job_id=job_id,
            freelancer_id=current_user.id,
            status="pending"
        )
        db.add(application)
        db.commit()
        
        logger.info(
            "Job application submitted",
            job_id=job_id,
            user_id=current_user.id
        )
        return {"message": "Application submitted successfully"}
    except Exception as e:
        logger.error(
            "Error submitting job application",
            error=str(e),
            job_id=job_id,
            user_id=current_user.id
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not submit application"
        ) 