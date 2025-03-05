from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.freelancer import Freelancer
from app.models.user import User
from app.schemas.freelancer import FreelancerCreate, FreelancerUpdate, FreelancerResponse
from app.core.logging import get_logger
from app.core.security import verify_profile_owner
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)
logger = get_logger(__name__)

@router.post("/", response_model=FreelancerResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_freelancer_profile(
    *,
    profile_in: FreelancerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new freelancer profile.
    Rate limit: 10 requests per minute per IP.
    """
    try:
        # Check if user already has a profile
        existing_profile = db.query(Freelancer).filter(
            Freelancer.user_id == current_user.id
        ).first()
        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has a freelancer profile"
            )

        profile = Freelancer(
            **profile_in.dict(),
            user_id=current_user.id
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        logger.info("Freelancer profile created", user_id=current_user.id)
        return profile
    except Exception as e:
        logger.error("Error creating freelancer profile", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create freelancer profile"
        )

@router.get("/", response_model=List[FreelancerResponse])
@limiter.limit("60/minute")
async def list_freelancers(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    skills: Optional[List[str]] = Query(None),
    min_rate: Optional[float] = None,
    max_rate: Optional[float] = None,
    availability: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    List all freelancers with optional filtering.
    Rate limit: 60 requests per minute per IP.
    """
    try:
        query = db.query(Freelancer)
        
        if skills:
            query = query.filter(Freelancer.skills.overlap(skills))
        if min_rate is not None:
            query = query.filter(Freelancer.hourly_rate >= min_rate)
        if max_rate is not None:
            query = query.filter(Freelancer.hourly_rate <= max_rate)
        if availability:
            query = query.filter(Freelancer.availability == availability)
            
        total = query.count()
        freelancers = query.offset(skip).limit(limit).all()
        
        logger.info("Freelancers retrieved", count=len(freelancers), total=total)
        return freelancers
    except Exception as e:
        logger.error("Error retrieving freelancers", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve freelancers"
        )

@router.get("/{freelancer_id}", response_model=FreelancerResponse)
@limiter.limit("60/minute")
async def get_freelancer(
    freelancer_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific freelancer profile by ID.
    Rate limit: 60 requests per minute per IP.
    """
    try:
        freelancer = db.query(Freelancer).filter(Freelancer.id == freelancer_id).first()
        if not freelancer:
            logger.warning("Freelancer not found", freelancer_id=freelancer_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Freelancer not found"
            )
        return freelancer
    except Exception as e:
        logger.error("Error retrieving freelancer", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve freelancer profile"
        )

@router.put("/{freelancer_id}", response_model=FreelancerResponse)
@limiter.limit("10/minute")
async def update_freelancer(
    freelancer_id: int,
    profile_in: FreelancerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a freelancer profile.
    Rate limit: 10 requests per minute per IP.
    """
    try:
        freelancer = db.query(Freelancer).filter(Freelancer.id == freelancer_id).first()
        if not freelancer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Freelancer not found"
            )
            
        verify_profile_owner(freelancer, current_user)
        
        for field, value in profile_in.dict(exclude_unset=True).items():
            setattr(freelancer, field, value)
            
        db.commit()
        db.refresh(freelancer)
        logger.info("Freelancer profile updated", freelancer_id=freelancer_id)
        return freelancer
    except Exception as e:
        logger.error("Error updating freelancer profile", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update freelancer profile"
        )

@router.delete("/{freelancer_id}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("10/minute")
async def delete_freelancer(
    freelancer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a freelancer profile.
    Rate limit: 10 requests per minute per IP.
    """
    try:
        freelancer = db.query(Freelancer).filter(Freelancer.id == freelancer_id).first()
        if not freelancer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Freelancer not found"
            )
            
        verify_profile_owner(freelancer, current_user)
        
        db.delete(freelancer)
        db.commit()
        logger.info("Freelancer profile deleted", freelancer_id=freelancer_id)
    except Exception as e:
        logger.error("Error deleting freelancer profile", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete freelancer profile"
        ) 