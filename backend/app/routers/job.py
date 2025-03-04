from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from fairgig.database import get_db
from fairgig.models import Job, User
from fairgig.schemas.job import JobCreate, JobResponse, JobUpdate
from fairgig.routers.auth import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("/", response_model=JobResponse)
async def create_job(
    job: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_job = Job(
        **job.dict(),
        employer_id=current_user.id,
        created_at=datetime.utcnow()
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/", response_model=List[JobResponse])
async def list_jobs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    jobs = db.query(Job).offset(skip).limit(limit).all()
    return jobs

@router.post("/{job_id}/apply")
async def apply_to_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if user has already applied
    if job.applications.filter_by(freelancer_id=current_user.id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job"
        )
    
    # Create application
    application = JobApplication(
        job_id=job_id,
        freelancer_id=current_user.id,
        applied_at=datetime.utcnow()
    )
    db.add(application)
    db.commit()
    
    return {"message": "Successfully applied to job"}
