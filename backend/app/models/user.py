from uuid import UUID
from sqlalchemy import Column, String, Boolean, Enum as SQLEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
import enum
import sqlalchemy as sa

from app.models.base import Base
from app.models.mixins import ShardedModelMixin

class UserRole(str, enum.Enum):
    FREELANCER = "user_freelancer"
    CLIENT = "user_client"
    ADMIN = "admin"
    SUPERADMIN = "superadmin"

class OAuthProvider(str, enum.Enum):
    GOOGLE = "google"
    GITHUB = "github"
    EMAIL = "email"

class User(Base, ShardedModelMixin):
    """User model with role-based access control and sharding support."""
    __table_args__ = {'schema': 'auth'}
    
    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.CLIENT)
    is_active = Column(Boolean, nullable=False, default=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    
    # Profile fields
    bio = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    location = Column(String, nullable=True)
    timezone = Column(String, nullable=True)
    
    # OAuth fields
    oauth_provider = Column(SQLEnum(OAuthProvider), nullable=True)
    oauth_id = Column(String, nullable=True)
    
    # Relationships
    oauth_accounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    jobs_posted = relationship("Job", back_populates="client", foreign_keys="Job.client_id")
    jobs_applied = relationship("JobApplication", back_populates="freelancer")
    reviews_given = relationship("Review", back_populates="reviewer", foreign_keys="Review.reviewer_id")
    reviews_received = relationship("Review", back_populates="reviewee", foreign_keys="Review.reviewee_id")

    def __init__(self, **kwargs):
        region = kwargs.pop('region', None)
        super().__init__(**kwargs)
        if region:
            self.shard_region = region.value
            self.shard_key = self.create_shard_key(region, str(self.id))

class OAuthAccount(Base):
    """OAuth account information."""
    __table_args__ = {'schema': 'auth'}
    
    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    user_id = Column(PGUUID, ForeignKey('auth.user.id', ondelete='CASCADE'), nullable=False)
    oauth_provider = Column(String, nullable=False)
    oauth_id = Column(String, nullable=False)
    access_token = Column(String, nullable=True)
    refresh_token = Column(String, nullable=True)
    expires_at = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="oauth_accounts")
    
    __table_args__ = (
        # Ensure one account per provider per user
        sa.UniqueConstraint('user_id', 'oauth_provider', name='uq_oauth_account_user_provider'),
    )
