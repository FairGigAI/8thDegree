from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.base_class import Base

class JobEmbedding(Base):
    __tablename__ = "job_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    embedding = Column(ARRAY(Float), nullable=False)  # Store embedding vector
    embedding_model = Column(String, nullable=False)  # e.g., "openai-text-embedding-3-small"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    job = relationship("Job", back_populates="embedding")

    # Index for faster similarity search
    __table_args__ = (
        Index('idx_job_embedding_vector', 'embedding', postgresql_using='ivfflat'),
    )

class FreelancerEmbedding(Base):
    __tablename__ = "freelancer_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    freelancer_id = Column(Integer, ForeignKey("freelancers.id", ondelete="CASCADE"), nullable=False)
    embedding = Column(ARRAY(Float), nullable=False)
    embedding_model = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    freelancer = relationship("Freelancer", back_populates="embedding")

    __table_args__ = (
        Index('idx_freelancer_embedding_vector', 'embedding', postgresql_using='ivfflat'),
    )

class MatchHistory(Base):
    __tablename__ = "match_history"

    id = Column(Integer, primary_key=True, index=True)
    freelancer_id = Column(Integer, ForeignKey("freelancers.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    match_metadata = Column(JSON, nullable=True)  # Store additional match data
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    freelancer = relationship("Freelancer", back_populates="match_history")
    job = relationship("Job", back_populates="match_history")

    class Config:
        orm_mode = True 