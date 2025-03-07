from typing import List, Optional, Type, TypeVar, Any, Dict, Union
from sqlalchemy.orm import Query, Session
from sqlalchemy.sql import Select
from concurrent.futures import ThreadPoolExecutor
import asyncio

from .types import ShardKey, Region, ShardInfo
from .manager import ShardManager

T = TypeVar('T')

class QueryOptimizer:
    """Optimizes queries across shards."""
    
    def __init__(self, shard_manager: ShardManager):
        self.shard_manager = shard_manager
        self.executor = ThreadPoolExecutor(max_workers=10)
    
    async def execute_query(
        self,
        query: Union[Query, Select],
        regions: Optional[List[Region]] = None,
        parallel: bool = True,
        **kwargs
    ) -> List[Any]:
        """Execute a query across multiple shards."""
        regions_to_query = regions or self.shard_manager.get_active_regions()
        
        if parallel:
            # Execute queries in parallel
            tasks = [
                self._execute_shard_query(region, query, **kwargs)
                for region in regions_to_query
            ]
            results = await asyncio.gather(*tasks)
            return [item for sublist in results for item in sublist]
        else:
            # Execute queries sequentially
            results = []
            for region in regions_to_query:
                shard_results = await self._execute_shard_query(region, query, **kwargs)
                results.extend(shard_results)
            return results
    
    async def _execute_shard_query(
        self,
        region: Region,
        query: Union[Query, Select],
        **kwargs
    ) -> List[Any]:
        """Execute a query on a specific shard."""
        shard = self.shard_manager.get_shard_for_region(region)
        session = self.shard_manager.get_session(shard)
        
        try:
            # Clone query to avoid modification of original
            shard_query = query.params(
                shard_region=region.value,
                **kwargs
            )
            
            # Execute in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor,
                lambda: session.execute(shard_query).fetchall()
            )
            return list(result)
            
        finally:
            session.close()

class QueryPlanner:
    """Plans and optimizes query execution across shards."""
    
    def __init__(self, optimizer: QueryOptimizer):
        self.optimizer = optimizer
    
    async def execute_optimized(
        self,
        query: Union[Query, Select],
        shard_key: Optional[ShardKey] = None,
        regions: Optional[List[Region]] = None,
        **kwargs
    ) -> List[Any]:
        """Execute a query with optimizations."""
        if shard_key:
            # Single-shard query
            return await self._execute_single_shard(query, shard_key, **kwargs)
        else:
            # Multi-shard query
            return await self._execute_multi_shard(query, regions, **kwargs)
    
    async def _execute_single_shard(
        self,
        query: Union[Query, Select],
        shard_key: ShardKey,
        **kwargs
    ) -> List[Any]:
        """Execute a query on a single shard."""
        return await self.optimizer.execute_query(
            query,
            regions=[shard_key.region],
            parallel=False,
            **kwargs
        )
    
    async def _execute_multi_shard(
        self,
        query: Union[Query, Select],
        regions: Optional[List[Region]] = None,
        **kwargs
    ) -> List[Any]:
        """Execute a query across multiple shards."""
        return await self.optimizer.execute_query(
            query,
            regions=regions,
            parallel=True,
            **kwargs
        )

class QueryCache:
    """Caches query results for cross-shard operations."""
    
    def __init__(self, redis_client):
        self.redis = redis_client
        self.default_ttl = 300  # 5 minutes
    
    async def get_cached_result(
        self,
        query_hash: str,
        shard_key: Optional[ShardKey] = None
    ) -> Optional[List[Any]]:
        """Get cached query result."""
        cache_key = self._get_cache_key(query_hash, shard_key)
        result = await self.redis.get(cache_key)
        return result if result else None
    
    async def set_cached_result(
        self,
        query_hash: str,
        result: List[Any],
        shard_key: Optional[ShardKey] = None,
        ttl: Optional[int] = None
    ):
        """Cache query result."""
        cache_key = self._get_cache_key(query_hash, shard_key)
        await self.redis.set(
            cache_key,
            result,
            ex=ttl or self.default_ttl
        )
    
    def _get_cache_key(
        self,
        query_hash: str,
        shard_key: Optional[ShardKey] = None
    ) -> str:
        """Generate cache key for query."""
        if shard_key:
            return f"query:{query_hash}:shard:{shard_key.region}:{shard_key.entity_type}"
        return f"query:{query_hash}:global" 