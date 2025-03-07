from typing import List, Optional, Type, TypeVar, Generic
from sqlalchemy.orm import Session, RelationshipProperty
from sqlalchemy.ext.declarative import DeclarativeMeta

from .types import ShardKey, Region
from .manager import ShardManager

T = TypeVar('T', bound=DeclarativeMeta)

class CrossShardRelationship(Generic[T]):
    """Manages relationships across different shards."""
    
    def __init__(
        self,
        shard_manager: ShardManager,
        source_model: Type[T],
        target_model: Type[T],
        relationship_name: str
    ):
        self.shard_manager = shard_manager
        self.source_model = source_model
        self.target_model = target_model
        self.relationship_name = relationship_name
    
    async def get_related_objects(
        self,
        source_id: str,
        source_region: Region,
        target_regions: Optional[List[Region]] = None
    ) -> List[T]:
        """Get related objects across shards."""
        results = []
        regions_to_query = target_regions or self.shard_manager.get_active_regions()
        
        for region in regions_to_query:
            shard = self.shard_manager.get_shard_for_region(region)
            session = self.shard_manager.get_session(shard)
            
            try:
                # Query the relationship mapping table
                mappings = await self._get_relationship_mappings(
                    session,
                    source_id,
                    source_region,
                    region
                )
                
                if mappings:
                    # Get the actual objects
                    target_ids = [m.target_id for m in mappings]
                    objects = await self._get_objects_by_ids(session, target_ids)
                    results.extend(objects)
            
            finally:
                session.close()
        
        return results
    
    async def create_relationship(
        self,
        source_id: str,
        source_region: Region,
        target_id: str,
        target_region: Region,
        metadata: Optional[dict] = None
    ) -> bool:
        """Create a cross-shard relationship."""
        source_shard = self.shard_manager.get_shard_for_region(source_region)
        target_shard = self.shard_manager.get_shard_for_region(target_region)
        
        # Create relationship mapping in both shards for redundancy
        success_source = await self._create_mapping(source_shard, source_id, target_id, metadata)
        success_target = await self._create_mapping(target_shard, source_id, target_id, metadata)
        
        return success_source and success_target
    
    async def delete_relationship(
        self,
        source_id: str,
        source_region: Region,
        target_id: str,
        target_region: Region
    ) -> bool:
        """Delete a cross-shard relationship."""
        source_shard = self.shard_manager.get_shard_for_region(source_region)
        target_shard = self.shard_manager.get_shard_for_region(target_region)
        
        # Delete relationship mapping from both shards
        success_source = await self._delete_mapping(source_shard, source_id, target_id)
        success_target = await self._delete_mapping(target_shard, source_id, target_id)
        
        return success_source and success_target
    
    async def _get_relationship_mappings(
        self,
        session: Session,
        source_id: str,
        source_region: Region,
        target_region: Region
    ) -> List[Any]:
        """Get relationship mappings from the mapping table."""
        return session.query(CrossShardMapping).filter(
            CrossShardMapping.source_id == source_id,
            CrossShardMapping.source_region == source_region.value,
            CrossShardMapping.target_region == target_region.value
        ).all()
    
    async def _get_objects_by_ids(
        self,
        session: Session,
        ids: List[str]
    ) -> List[T]:
        """Get objects by their IDs."""
        return session.query(self.target_model).filter(
            self.target_model.id.in_(ids)
        ).all()
    
    async def _create_mapping(
        self,
        shard: ShardInfo,
        source_id: str,
        target_id: str,
        metadata: Optional[dict] = None
    ) -> bool:
        """Create a relationship mapping in a shard."""
        session = self.shard_manager.get_session(shard)
        try:
            mapping = CrossShardMapping(
                source_id=source_id,
                target_id=target_id,
                metadata=metadata
            )
            session.add(mapping)
            session.commit()
            return True
        except Exception as e:
            session.rollback()
            return False
        finally:
            session.close()
    
    async def _delete_mapping(
        self,
        shard: ShardInfo,
        source_id: str,
        target_id: str
    ) -> bool:
        """Delete a relationship mapping from a shard."""
        session = self.shard_manager.get_session(shard)
        try:
            session.query(CrossShardMapping).filter(
                CrossShardMapping.source_id == source_id,
                CrossShardMapping.target_id == target_id
            ).delete()
            session.commit()
            return True
        except Exception as e:
            session.rollback()
            return False
        finally:
            session.close()

class CrossShardMapping(Base):
    """Table for storing cross-shard relationship mappings."""
    __tablename__ = 'cross_shard_mappings'
    __table_args__ = {'schema': 'core'}
    
    id = Column(PGUUID, primary_key=True, server_default='gen_random_uuid()')
    source_id = Column(String, nullable=False)
    source_region = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    target_region = Column(String, nullable=False)
    relationship_type = Column(String, nullable=False)
    metadata = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    __table_args__ = (
        Index('idx_cross_shard_source', source_id, source_region),
        Index('idx_cross_shard_target', target_id, target_region),
        {'schema': 'core'}
    ) 