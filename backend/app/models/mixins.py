from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declared_attr
from app.db.sharding.types import Region

class ShardedModelMixin:
    """Mixin for sharded models providing shard key fields."""
    
    @declared_attr
    def shard_region(cls):
        return Column(String, nullable=False, index=True)
    
    @declared_attr
    def shard_key(cls):
        return Column(String, nullable=False, index=True)
    
    def get_shard_info(self) -> dict:
        """Get sharding information for the model."""
        return {
            "region": self.shard_region,
            "entity_type": self.__class__.__name__.lower(),
            "entity_id": str(self.id),
            "shard_key": self.shard_key
        }
    
    @classmethod
    def create_shard_key(cls, region: Region, entity_id: str) -> str:
        """Create a shard key for the model."""
        return f"{region.value}:{cls.__name__.lower()}:{entity_id}" 