from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, JSON, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.dialects.postgresql import UUID as PGUUID, ARRAY
from sqlalchemy.orm import relationship
import enum

from app.models.base import Base
from app.models.mixins import ShardedModelMixin

class ModelType(str, enum.Enum):
    EMBEDDING = "embedding"
    MATCHING = "matching"
    BIAS = "bias"
    LEARNING = "learning"

class EntityType(str, enum.Enum):
    JOB = "job"
    USER = "user"
    REVIEW = "review"
    SKILL = "skill"

class Embedding(Base, ShardedModelMixin):
    """Stores entity embeddings for matching and analysis."""
    __tablename__ = 'embeddings'
    __table_args__ = {'schema': 'ai'}

    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    entity_type = Column(SQLEnum(EntityType), nullable=False)
    entity_id = Column(PGUUID, nullable=False)
    vector = Column(ARRAY(Float), nullable=False)
    model_version = Column(String, nullable=False)
    model_type = Column(SQLEnum(ModelType), nullable=False, default=ModelType.EMBEDDING)
    
    # Metadata
    dimension = Column(Integer, nullable=False)
    metadata = Column(JSON, nullable=True)
    quality_score = Column(Float, nullable=True)
    last_updated = Column(DateTime(timezone=True), nullable=False)

class MatchResult(Base, ShardedModelMixin):
    """Records matching results for analysis and learning."""
    __tablename__ = 'match_results'
    __table_args__ = {'schema': 'ai'}

    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    job_id = Column(PGUUID, ForeignKey('core.jobs.id'), nullable=False)
    freelancer_id = Column(PGUUID, ForeignKey('auth.users.id'), nullable=False)
    
    # Match details
    score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    ranking = Column(Integer, nullable=True)
    
    # Component scores
    skill_match = Column(Float, nullable=True)
    experience_match = Column(Float, nullable=True)
    success_rate_match = Column(Float, nullable=True)
    region_match = Column(Float, nullable=True)
    
    # Outcome tracking
    was_viewed = Column(Boolean, nullable=False, default=False)
    was_applied = Column(Boolean, nullable=False, default=False)
    was_hired = Column(Boolean, nullable=False, default=False)
    was_successful = Column(Boolean, nullable=False, default=False)
    
    # Analysis data
    match_factors = Column(JSON, nullable=True)
    feedback = Column(JSON, nullable=True)

class BiasReport(Base):
    """Stores bias detection results."""
    __tablename__ = 'bias_reports'
    __table_args__ = {'schema': 'ai'}

    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    entity_type = Column(SQLEnum(EntityType), nullable=False)
    entity_id = Column(PGUUID, nullable=False)
    
    # Analysis results
    bias_score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    categories = Column(ARRAY(String), nullable=False)
    
    # Details
    findings = Column(JSON, nullable=False)
    recommendations = Column(JSON, nullable=True)
    
    # Review status
    requires_review = Column(Boolean, nullable=False, default=False)
    reviewed_by = Column(PGUUID, ForeignKey('auth.users.id'), nullable=True)
    review_notes = Column(String, nullable=True)

class LearningMetric(Base):
    """Tracks metrics for the learning system."""
    __tablename__ = 'learning_metrics'
    __table_args__ = {'schema': 'ai'}

    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    metric_type = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    
    # Context
    entity_type = Column(SQLEnum(EntityType), nullable=False)
    entity_id = Column(PGUUID, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    
    # Additional data
    context = Column(JSON, nullable=True)
    metadata = Column(JSON, nullable=True)

class ModelVersion(Base):
    """Tracks AI model versions and performance."""
    __tablename__ = 'model_versions'
    __table_args__ = {'schema': 'ai'}

    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    model_type = Column(SQLEnum(ModelType), nullable=False)
    version = Column(String, nullable=False)
    
    # Performance metrics
    accuracy = Column(Float, nullable=True)
    latency = Column(Float, nullable=True)
    throughput = Column(Float, nullable=True)
    
    # Deployment info
    is_active = Column(Boolean, nullable=False, default=False)
    deployed_at = Column(DateTime(timezone=True), nullable=True)
    retired_at = Column(DateTime(timezone=True), nullable=True)
    
    # Training data
    training_metrics = Column(JSON, nullable=True)
    validation_metrics = Column(JSON, nullable=True) 