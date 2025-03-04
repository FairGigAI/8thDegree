from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, func, Enum
from sqlalchemy.orm import relationship
from fairgig.database import Base
import enum

class UserType(str, enum.Enum):
    CLIENT = "client"
    FREELANCER = "freelancer"
    ADMIN = "admin"

class OAuthProvider(str, enum.Enum):
    GOOGLE = "google"
    GITHUB = "github"
    EMAIL = "email"

# User Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    user_type = Column(Enum(UserType), nullable=False, default=UserType.CLIENT)
    oauth_provider = Column(Enum(OAuthProvider), nullable=True)
    oauth_id = Column(String, nullable=True)  # OAuth provider's user ID
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Profile fields
    bio = Column(String, nullable=True)
    skills = Column(String, nullable=True)  # JSON string of skills
    hourly_rate = Column(Integer, nullable=True)  # For freelancers
    company_name = Column(String, nullable=True)  # For clients
    website = Column(String, nullable=True)
    location = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)

    # Relationships
    jobs_posted = relationship("Job", back_populates="client", foreign_keys="Job.client_id")
    job_applications = relationship("JobApplication", back_populates="freelancer")

# Job Model
class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    budget = Column(Integer, nullable=False)
    client_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="open")  # open, in_progress, completed, cancelled
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    client = relationship("User", back_populates="jobs_posted")
    applications = relationship("JobApplication", back_populates="job")

# Job Application Model
class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    freelancer_id = Column(Integer, ForeignKey("users.id"))
    cover_letter = Column(String, nullable=True)
    proposed_rate = Column(Integer, nullable=True)
    status = Column(String, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    job = relationship("Job", back_populates="applications")
    freelancer = relationship("User", back_populates="job_applications")

# Votes (Upvotes/Downvotes)
class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    vote_type = Column(String, nullable=False)  # "up" or "down"
    created_at = Column(DateTime, default=func.now())

# Teams
class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())

    owner = relationship("User")
