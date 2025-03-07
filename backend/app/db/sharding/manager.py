from typing import Dict, List, Optional, Set
from datetime import datetime
import asyncio
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool

from .types import (
    ShardInfo, ShardConfig, ShardKey, ShardOperation,
    Region, ShardType, ShardStatus, ShardingMetrics
)
from .strategy import ShardStrategy, RegionBasedStrategy
from app.core.config import settings

logger = logging.getLogger(__name__)

class ShardManager:
    """Manages database shards and their operations"""
    
    def __init__(
        self,
        config: ShardConfig,
        strategy_class: type[ShardStrategy] = RegionBasedStrategy
    ):
        self.config = config
        self.shards: Dict[str, ShardInfo] = {}
        self.session_factories: Dict[str, sessionmaker] = {}
        self.strategy: Optional[ShardStrategy] = None
        self.strategy_class = strategy_class
        self._initialize()
    
    def _initialize(self):
        """Initialize shard manager"""
        self._setup_shards()
        self._setup_strategy()
        self._setup_health_check()
    
    def _setup_shards(self):
        """Set up initial shards based on configuration"""
        for region in self.config.regions:
            for i in range(self.config.shards_per_region):
                shard_id = f"{region.value}-{i}"
                connection_string = self._get_connection_string(region, i)
                
                shard = ShardInfo(
                    shard_id=shard_id,
                    region=region,
                    shard_type=ShardType.PRIMARY,
                    status=ShardStatus.ACTIVE,
                    connection_string=connection_string,
                    created_at=datetime.utcnow()
                )
                
                self.shards[shard_id] = shard
                self._setup_session_factory(shard)
    
    def _setup_session_factory(self, shard: ShardInfo):
        """Create session factory for a shard"""
        engine = create_engine(
            shard.connection_string,
            poolclass=QueuePool,
            pool_size=settings.DB_POOL_SIZE,
            max_overflow=settings.DB_MAX_OVERFLOW,
            pool_timeout=30,
            pool_pre_ping=True
        )
        self.session_factories[shard.shard_id] = sessionmaker(
            bind=engine,
            autocommit=False,
            autoflush=False
        )
    
    def _setup_strategy(self):
        """Initialize sharding strategy"""
        self.strategy = self.strategy_class(list(self.shards.values()))
    
    def _setup_health_check(self):
        """Set up periodic health checks"""
        asyncio.create_task(self._health_check_loop())
    
    async def _health_check_loop(self):
        """Periodic health check for all shards"""
        while True:
            try:
                await self._check_all_shards()
                await asyncio.sleep(60)  # Check every minute
            except Exception as e:
                logger.error(f"Health check error: {e}")
    
    async def _check_all_shards(self):
        """Check health of all shards"""
        for shard_id, shard in self.shards.items():
            try:
                session_factory = self.session_factories[shard_id]
                with session_factory() as session:
                    session.execute("SELECT 1")
                shard.last_health_check = datetime.utcnow()
            except Exception as e:
                logger.error(f"Shard {shard_id} health check failed: {e}")
                await self._handle_shard_failure(shard)
    
    async def _handle_shard_failure(self, shard: ShardInfo):
        """Handle shard failure"""
        shard.status = ShardStatus.MAINTENANCE
        # Implement failover logic here
        pass
    
    def _get_connection_string(self, region: Region, shard_num: int) -> str:
        """Generate connection string for a shard"""
        return f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{region.value}-{shard_num}.{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
    
    def get_shard(self, key: ShardKey) -> ShardInfo:
        """Get appropriate shard for a key"""
        return self.strategy.get_shard(key)
    
    def get_session_factory(self, shard: ShardInfo) -> sessionmaker:
        """Get session factory for a shard"""
        return self.session_factories[shard.shard_id]
    
    async def execute_operation(self, operation: ShardOperation):
        """Execute operation on appropriate shards"""
        shards = self.strategy.get_shards_for_operation(operation)
        results = []
        
        for shard in shards:
            session_factory = self.get_session_factory(shard)
            with session_factory() as session:
                try:
                    if operation.requires_transaction:
                        with session.begin():
                            result = session.execute(
                                operation.query,
                                operation.parameters
                            )
                    else:
                        result = session.execute(
                            operation.query,
                            operation.parameters
                        )
                    results.append(result)
                except Exception as e:
                    logger.error(f"Operation failed on shard {shard.shard_id}: {e}")
                    raise
        
        return results
    
    async def get_metrics(self) -> ShardingMetrics:
        """Get current sharding metrics"""
        total_connections = sum(shard.current_connections for shard in self.shards.values())
        active_shards = sum(1 for shard in self.shards.values() if shard.status == ShardStatus.ACTIVE)
        
        return ShardingMetrics(
            total_shards=len(self.shards),
            active_shards=active_shards,
            total_connections=total_connections,
            data_size_gb=0.0,  # Implement actual size calculation
            queries_per_second=0.0,  # Implement actual QPS calculation
            cross_shard_queries_percent=0.0,  # Implement actual calculation
            replication_lag_seconds=0.0  # Implement actual lag calculation
        )
    
    async def add_shard(self, region: Region) -> ShardInfo:
        """Add a new shard to the cluster"""
        shard_num = len([s for s in self.shards.values() if s.region == region])
        shard_id = f"{region.value}-{shard_num}"
        
        shard = ShardInfo(
            shard_id=shard_id,
            region=region,
            shard_type=ShardType.PRIMARY,
            status=ShardStatus.SCALING,
            connection_string=self._get_connection_string(region, shard_num),
            created_at=datetime.utcnow()
        )
        
        self.shards[shard_id] = shard
        self._setup_session_factory(shard)
        self._setup_strategy()  # Rebuild strategy with new shard
        
        return shard
    
    async def remove_shard(self, shard_id: str):
        """Remove a shard from the cluster"""
        if shard_id not in self.shards:
            raise ValueError(f"Shard {shard_id} not found")
        
        shard = self.shards[shard_id]
        shard.status = ShardStatus.MAINTENANCE
        
        # Implement data migration before removal
        # This is a placeholder for the actual implementation
        await self._migrate_shard_data(shard)
        
        del self.shards[shard_id]
        del self.session_factories[shard_id]
        self._setup_strategy()  # Rebuild strategy without removed shard
    
    async def _migrate_shard_data(self, shard: ShardInfo):
        """Migrate data from a shard before removal"""
        # Implement actual data migration logic
        pass 