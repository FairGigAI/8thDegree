from pydantic import BaseModel, constr, conint, EmailStr
from typing import List, Optional
from datetime import datetime

class FreelancerBase(BaseModel):
    name: constr(min_length=2, max_length=100)
    title: constr(min_length=5, max_length=200)
    description: constr(min_length=50)
    skills: List[str]
    hourly_rate: conint(gt=0)
    experience_years: conint(ge=0)
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class FreelancerCreate(FreelancerBase):
    email: EmailStr
    password: constr(min_length=8)

class FreelancerUpdate(BaseModel):
    name: Optional[constr(min_length=2, max_length=100)] = None
    title: Optional[constr(min_length=5, max_length=200)] = None
    description: Optional[constr(min_length=50)] = None
    skills: Optional[List[str]] = None
    hourly_rate: Optional[conint(gt=0)] = None
    experience_years: Optional[conint(ge=0)] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class FreelancerInDB(FreelancerBase):
    id: int
    email: EmailStr
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    completed_jobs: int = 0
    rating: float = 0.0
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

class Freelancer(FreelancerBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    completed_jobs: int = 0
    rating: float = 0.0
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True 