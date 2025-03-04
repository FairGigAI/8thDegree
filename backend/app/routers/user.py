from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from fairgig.database import get_db
from fairgig.models import User
from fairgig.schemas.user import UserResponse, UserUpdate
from fairgig.routers.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def get_users():
    return [{"id": 1, "name": "John Doe"}]

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user
