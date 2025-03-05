from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from fairgig.models import UserType, OAuthProvider

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    user_type: UserType = UserType.CLIENT
    bio: Optional[str] = None
    skills: Optional[str] = None
    hourly_rate: Optional[int] = None
    company_name: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: Optional[str] = None
    oauth_provider: Optional[OAuthProvider] = None
    oauth_id: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    hourly_rate: Optional[int] = None
    company_name: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    oauth_provider: Optional[OAuthProvider] = None

    class Config:
        from_attributes = True
