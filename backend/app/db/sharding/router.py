from typing import Any, Dict, List, Optional, Union
from sqlalchemy.orm import Session
import logging
from datetime import datetime

from .manager import ShardManager
from .types import ShardKey, ShardOperation, Region

logger = logging.getLogger(__name__)

class ShardRouter:
    """Routes database operations to appropriate shards"""
    
    def __init__(self, shard_manager: ShardManager):
        self.shard_manager = shard_manager
    
    def get_session(self, key: ShardKey) -> Session:
        """Get database session for a shard key"""
        shard = self.shard_manager.get_shard(key)
        session_factory = self.shard_manager.get_session_factory(shard)
        return session_factory()
    
    async def execute(
        self,
        operation_type: str,
        query: str,
        parameters: Dict[str, Any],
        shard_key: ShardKey,
        *,
        requires_transaction: bool = False,
        cross_shard: bool = False,
        timeout_seconds: int = 30
    ):
        """Execute a database operation"""
        operation = ShardOperation(
            shard_key=shard_key,
            operation_type=operation_type,
            query=query,
            parameters=parameters,
            requires_transaction=requires_transaction,
            cross_shard=cross_shard,
            timeout_seconds=timeout_seconds
        )
        
        try:
            return await self.shard_manager.execute_operation(operation)
        except Exception as e:
            logger.error(f"Operation failed: {e}")
            raise
    
    async def bulk_execute(
        self,
        operations: List[ShardOperation]
    ) -> List[Any]:
        """Execute multiple operations, potentially across different shards"""
        results = []
        operations_by_shard: Dict[str, List[ShardOperation]] = {}
        
        # Group operations by shard
        for operation in operations:
            shard = self.shard_manager.get_shard(operation.shard_key)
            if shard.shard_id not in operations_by_shard:
                operations_by_shard[shard.shard_id] = []
            operations_by_shard[shard.shard_id].append(operation)
        
        # Execute operations for each shard
        for shard_id, shard_operations in operations_by_shard.items():
            shard = self.shard_manager.shards[shard_id]
            session_factory = self.shard_manager.get_session_factory(shard)
            
            with session_factory() as session:
                try:
                    with session.begin():
                        for operation in shard_operations:
                            result = session.execute(
                                operation.query,
                                operation.parameters
                            )
                            results.append(result)
                except Exception as e:
                    logger.error(f"Bulk operation failed on shard {shard_id}: {e}")
                    raise
        
        return results
    
    async def execute_cross_region(
        self,
        operation: ShardOperation,
        regions: Optional[List[Region]] = None
    ) -> Dict[Region, Any]:
        """Execute operation across multiple regions"""
        if regions is None:
            regions = [shard.region for shard in self.shard_manager.shards.values()]
        
        results = {}
        for region in regions:
            # Create region-specific shard key
            region_key = ShardKey(
                region=region,
                entity_type=operation.shard_key.entity_type,
                entity_id=operation.shard_key.entity_id
            )
            
            # Create region-specific operation
            region_op = ShardOperation(
                shard_key=region_key,
                operation_type=operation.operation_type,
                query=operation.query,
                parameters=operation.parameters,
                requires_transaction=operation.requires_transaction,
                cross_shard=False,  # Execute within region only
                timeout_seconds=operation.timeout_seconds
            )
            
            try:
                result = await self.shard_manager.execute_operation(region_op)
                results[region] = result
            except Exception as e:
                logger.error(f"Cross-region operation failed for {region}: {e}")
                results[region] = None
        
        return results
    
    def get_optimal_session(
        self,
        key: ShardKey,
        client_region: Region
    ) -> Session:
        """Get session for optimal shard based on client location"""
        strategy = self.shard_manager.strategy
        if hasattr(strategy, 'get_optimal_shard'):
            shard = strategy.get_optimal_shard(key, client_region)
        else:
            shard = strategy.get_shard(key)
        
        session_factory = self.shard_manager.get_session_factory(shard)
        return session_factory() 