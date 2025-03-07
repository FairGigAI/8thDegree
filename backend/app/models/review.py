from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Enum as SQLEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSONB
from sqlalchemy.orm import relationship
import enum

from app.models.base import Base

class ReviewType(str, enum.Enum):
    CLIENT_TO_FREELANCER = "client_to_freelancer"
    FREELANCER_TO_CLIENT = "freelancer_to_client"

class Review(Base):
    """Review model for job completion feedback."""
    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
        {'schema': 'core'}
    )
    
    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    job_id = Column(PGUUID, ForeignKey('core.job.id', ondelete='CASCADE'), nullable=False)
    reviewer_id = Column(PGUUID, ForeignKey('auth.user.id', ondelete='CASCADE'), nullable=False)
    reviewee_id = Column(PGUUID, ForeignKey('auth.user.id', ondelete='CASCADE'), nullable=False)
    
    # Review details
    review_type = Column(SQLEnum(ReviewType), nullable=False)
    rating = Column(Integer, nullable=False)
    title = Column(String, nullable=True)
    content = Column(String, nullable=False)
    
    # Specific ratings
    communication_rating = Column(Integer, nullable=True)
    quality_rating = Column(Integer, nullable=True)
    expertise_rating = Column(Integer, nullable=True)
    professionalism_rating = Column(Integer, nullable=True)
    hire_again = Column(Boolean, nullable=True)
    
    # Review metadata
    is_verified = Column(Boolean, nullable=False, default=False)
    is_featured = Column(Boolean, nullable=False, default=False)
    is_hidden = Column(Boolean, nullable=False, default=False)
    
    # AI analysis
    sentiment_score = Column(JSONB, nullable=True)
    bias_detection = Column(JSONB, nullable=True)
    keywords = Column(JSONB, nullable=True)
    
    # Relations
    job = relationship("Job", back_populates="reviews")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")
    reviewee = relationship("User", foreign_keys=[reviewee_id], back_populates="reviews_received")
    responses = relationship("ReviewResponse", back_populates="review", cascade="all, delete-orphan")
    
    # Helpfulness tracking
    helpful_count = Column(Integer, nullable=False, default=0)
    not_helpful_count = Column(Integer, nullable=False, default=0)
    report_count = Column(Integer, nullable=False, default=0)

class ReviewResponse(Base):
    """Response to a review from the reviewed party."""
    __table_args__ = {'schema': 'core'}
    
    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    review_id = Column(PGUUID, ForeignKey('core.review.id', ondelete='CASCADE'), nullable=False)
    responder_id = Column(PGUUID, ForeignKey('auth.user.id', ondelete='CASCADE'), nullable=False)
    
    # Response content
    content = Column(String, nullable=False)
    is_hidden = Column(Boolean, nullable=False, default=False)
    
    # Relations
    review = relationship("Review", back_populates="responses")
    responder = relationship("User")
    
    # AI analysis
    sentiment_score = Column(JSONB, nullable=True)
    professionalism_score = Column(JSONB, nullable=True) 