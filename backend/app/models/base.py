from datetime import datetime
from sqlalchemy import Column, DateTime, event
from sqlalchemy.ext.declarative import declared_attr, DeclarativeBase
from sqlalchemy.orm import Session
from typing import Optional

from app.db.sharding.types import Region, ShardKey

class Base(DeclarativeBase):
    """Base class for all models with sharding support"""
    
    @declared_attr
    def __tablename__(cls) -> str:
        """Generate __tablename__ automatically from class name."""
        return cls.__name__.lower()
    
    # Common columns for all models
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def dict(self) -> dict:
        """Convert model instance to dictionary."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    def update(self, **kwargs):
        """Update model instance with given kwargs."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    @classmethod
    def get_shard_key(cls, session: Session, **kwargs) -> Optional[ShardKey]:
        """Get shard key for model instance."""
        if hasattr(cls, 'create_shard_key'):
            region = kwargs.get('region', Region.NA_EAST)
            entity_id = kwargs.get('id')
            if entity_id:
                return ShardKey(
                    region=region,
                    entity_type=cls.__name__.lower(),
                    entity_id=str(entity_id)
                )
        return None

@event.listens_for(Base, 'before_insert', propagate=True)
def before_insert(mapper, connection, target):
    """Set shard information before insert if model supports sharding."""
    if hasattr(target, 'shard_region') and hasattr(target, 'shard_key'):
        if not getattr(target, 'shard_region', None):
            target.shard_region = Region.NA_EAST.value
        if not getattr(target, 'shard_key', None):
            target.shard_key = f"{target.shard_region}:{mapper.class_.__name__.lower()}:{target.id}" 