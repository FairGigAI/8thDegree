from uuid import UUID
from sqlalchemy import Column, String, Numeric, ForeignKey, Enum as SQLEnum, ARRAY
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSONB
from sqlalchemy.orm import relationship
import enum

from app.models.base import Base

class JobStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTE = "dispute"

class JobVisibility(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    INVITED = "invited"

class Job(Base):
    """Job posting model with detailed requirements and matching data."""
    __table_args__ = {'schema': 'core'}
    
    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=False)
    short_description = Column(String, nullable=True)
    
    # Financial details
    budget_min = Column(Numeric(10, 2), nullable=False)
    budget_max = Column(Numeric(10, 2), nullable=False)
    hourly_rate_min = Column(Numeric(10, 2), nullable=True)
    hourly_rate_max = Column(Numeric(10, 2), nullable=True)
    
    # Job details
    category = Column(String, nullable=False, index=True)
    subcategory = Column(String, nullable=True)
    required_skills = Column(ARRAY(String), nullable=False)
    preferred_skills = Column(ARRAY(String), nullable=True)
    required_languages = Column(ARRAY(String), nullable=True)
    experience_level = Column(String, nullable=True)
    
    # Location and time
    location_type = Column(String, nullable=False, default="remote")
    locations = Column(ARRAY(String), nullable=True)
    timezone_requirements = Column(JSONB, nullable=True)
    estimated_duration = Column(String, nullable=True)
    weekly_hours = Column(Numeric(4, 1), nullable=True)
    
    # Status and visibility
    status = Column(SQLEnum(JobStatus), nullable=False, default=JobStatus.DRAFT)
    visibility = Column(SQLEnum(JobVisibility), nullable=False, default=JobVisibility.PUBLIC)
    
    # Relations
    client_id = Column(PGUUID, ForeignKey('auth.user.id', ondelete='CASCADE'), nullable=False)
    client = relationship("User", back_populates="jobs_posted", foreign_keys=[client_id])
    
    # Matching and applications
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="job", cascade="all, delete-orphan")
    
    # Metadata for matching
    matching_score = Column(Numeric(3, 2), nullable=True)
    matching_data = Column(JSONB, nullable=True)
    engagement_score = Column(Numeric(3, 2), nullable=True)
    
    # Analytics and tracking
    view_count = Column(Integer, nullable=False, default=0)
    application_count = Column(Integer, nullable=False, default=0)
    save_count = Column(Integer, nullable=False, default=0)

class JobApplication(Base):
    """Application for a job posting with proposal details."""
    __table_args__ = {'schema': 'core'}
    
    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    job_id = Column(PGUUID, ForeignKey('core.job.id', ondelete='CASCADE'), nullable=False)
    freelancer_id = Column(PGUUID, ForeignKey('auth.user.id', ondelete='CASCADE'), nullable=False)
    
    # Proposal details
    cover_letter = Column(String, nullable=False)
    proposed_rate = Column(Numeric(10, 2), nullable=False)
    estimated_hours = Column(Numeric(5, 1), nullable=True)
    availability_start = Column(DateTime(timezone=True), nullable=True)
    
    # Additional information
    relevant_experience = Column(String, nullable=True)
    portfolio_links = Column(ARRAY(String), nullable=True)
    questions_answers = Column(JSONB, nullable=True)
    
    # Status tracking
    status = Column(String, nullable=False, default="pending")
    client_viewed = Column(Boolean, nullable=False, default=False)
    viewed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relations
    job = relationship("Job", back_populates="applications")
    freelancer = relationship("User", back_populates="jobs_applied")
    
    # Matching data
    matching_score = Column(Numeric(3, 2), nullable=True)
    matching_factors = Column(JSONB, nullable=True)
