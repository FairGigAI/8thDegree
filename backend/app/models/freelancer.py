from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

# Association table for freelancer skills
freelancer_skills = Table(
    'freelancer_skills',
    Base.metadata,
    Column('freelancer_id', Integer, ForeignKey('freelancers.id')),
    Column('skill_id', Integer, ForeignKey('skills.id'))
)

class Freelancer(Base):
    __tablename__ = "freelancers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    hourly_rate = Column(Integer, nullable=False)
    experience_years = Column(Integer, default=0)
    portfolio_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_jobs = Column(Integer, default=0)
    rating = Column(Float, default=0.0)

    # Relationships
    skills = relationship("Skill", secondary=freelancer_skills, back_populates="freelancers")
    applications = relationship("JobApplication", back_populates="freelancer")
    reviews = relationship("Review", back_populates="freelancer")

    @classmethod
    async def get_public_profiles(cls, db, skip: int = 0, limit: int = 10):
        """Get public freelancer profiles with limited information."""
        query = (
            db.query(cls)
            .filter(cls.is_active == True)
            .order_by(cls.rating.desc(), cls.completed_jobs.desc())
            .offset(skip)
            .limit(limit)
        )
        return await query.all()

    @classmethod
    async def get_by_email(cls, db, email: str):
        """Get a freelancer by email."""
        return await db.query(cls).filter(cls.email == email).first()

    @classmethod
    async def create(cls, db, **kwargs):
        """Create a new freelancer."""
        db_freelancer = cls(**kwargs)
        db.add(db_freelancer)
        await db.commit()
        await db.refresh(db_freelancer)
        return db_freelancer

    @classmethod
    async def update(cls, db, freelancer_id: int, **kwargs):
        """Update a freelancer's information."""
        query = db.query(cls).filter(cls.id == freelancer_id)
        await query.update(kwargs)
        await db.commit()
        return await query.first()

    @classmethod
    async def delete(cls, db, freelancer_id: int):
        """Delete a freelancer."""
        query = db.query(cls).filter(cls.id == freelancer_id)
        await query.delete()
        await db.commit() 