from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime

class Region(str, Enum):
    NA_EAST = "na-east"
    NA_WEST = "na-west"
    EU_WEST = "eu-west"
    EU_CENTRAL = "eu-central"
    ASIA_EAST = "asia-east"
    ASIA_SOUTH = "asia-south"
    OCEANIA = "oceania"

class ShardType(str, Enum):
    PRIMARY = "primary"
    REPLICA = "replica"
    ANALYTICS = "analytics"

class ShardStatus(str, Enum):
    ACTIVE = "active"
    SCALING = "scaling"
    MIGRATING = "migrating"
    MAINTENANCE = "maintenance"
    INACTIVE = "inactive"

class ShardInfo(BaseModel):
    """Information about a specific database shard"""
    shard_id: str
    region: Region
    shard_type: ShardType
    status: ShardStatus
    connection_string: str
    max_connections: int = 100
    current_connections: int = 0
    created_at: datetime
    last_health_check: Optional[datetime] = None
    metadata: Dict[str, str] = Field(default_factory=dict)

class ShardConfig(BaseModel):
    """Configuration for sharding strategy"""
    enabled: bool = True
    default_region: Region = Region.NA_EAST
    regions: List[Region]
    shards_per_region: int = 2
    min_shards: int = 2
    max_shards: int = 16
    shard_size_threshold_gb: int = 100
    replication_factor: int = 2
    auto_scaling: bool = True
    cross_region_queries: bool = True

class ShardingMetrics(BaseModel):
    """Metrics for shard monitoring"""
    total_shards: int
    active_shards: int
    total_connections: int
    data_size_gb: float
    queries_per_second: float
    cross_shard_queries_percent: float
    replication_lag_seconds: float

class ShardKey(BaseModel):
    """Shard key for routing database operations"""
    region: Region
    entity_type: str
    entity_id: str
    timestamp: Optional[datetime] = None
    tenant_id: Optional[str] = None

    def to_routing_key(self) -> str:
        """Convert shard key to routing string"""
        components = [
            self.region.value,
            self.entity_type,
            self.entity_id
        ]
        if self.tenant_id:
            components.append(self.tenant_id)
        return ":".join(components)

    @classmethod
    def from_routing_key(cls, routing_key: str) -> "ShardKey":
        """Create shard key from routing string"""
        parts = routing_key.split(":")
        return cls(
            region=Region(parts[0]),
            entity_type=parts[1],
            entity_id=parts[2],
            tenant_id=parts[3] if len(parts) > 3 else None
        )

class ShardOperation(BaseModel):
    """Database operation with sharding context"""
    shard_key: ShardKey
    operation_type: str
    query: str
    parameters: Dict[str, any]
    requires_transaction: bool = False
    cross_shard: bool = False
    timeout_seconds: int = 30 