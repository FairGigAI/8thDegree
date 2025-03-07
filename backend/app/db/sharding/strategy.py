from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from datetime import datetime
import hashlib

from .types import ShardKey, ShardInfo, Region, ShardOperation

class ShardStrategy(ABC):
    """Abstract base class for shard routing strategies"""
    
    @abstractmethod
    def get_shard(self, key: ShardKey) -> ShardInfo:
        """Get the appropriate shard for a given key"""
        pass
    
    @abstractmethod
    def get_shards_for_operation(self, operation: ShardOperation) -> List[ShardInfo]:
        """Get all shards needed for an operation"""
        pass
    
    @abstractmethod
    def should_reshard(self, metrics: dict) -> bool:
        """Determine if resharding is needed based on metrics"""
        pass

class RegionBasedStrategy(ShardStrategy):
    """Region-based sharding strategy with consistent hashing"""
    
    def __init__(self, shards: List[ShardInfo], ring_size: int = 1024):
        self.shards = {shard.shard_id: shard for shard in shards}
        self.ring_size = ring_size
        self.ring = self._build_hash_ring()
    
    def _build_hash_ring(self) -> List[Tuple[int, str]]:
        """Build consistent hash ring"""
        ring = []
        for shard_id in self.shards:
            for i in range(self.ring_size):
                key = f"{shard_id}:{i}"
                hash_val = self._get_hash(key)
                ring.append((hash_val, shard_id))
        return sorted(ring)
    
    def _get_hash(self, key: str) -> int:
        """Generate consistent hash for a key"""
        return int(hashlib.sha256(key.encode()).hexdigest(), 16)
    
    def _get_shard_for_hash(self, hash_value: int) -> ShardInfo:
        """Find the appropriate shard for a hash value"""
        for point, shard_id in self.ring:
            if hash_value <= point:
                return self.shards[shard_id]
        return self.shards[self.ring[0][1]]  # Wrap around
    
    def get_shard(self, key: ShardKey) -> ShardInfo:
        """Get shard for a specific key"""
        hash_value = self._get_hash(key.to_routing_key())
        return self._get_shard_for_hash(hash_value)
    
    def get_shards_for_operation(self, operation: ShardOperation) -> List[ShardInfo]:
        """Get all shards needed for an operation"""
        if not operation.cross_shard:
            return [self.get_shard(operation.shard_key)]
        
        # For cross-shard operations, get all shards in the region
        region_shards = [
            shard for shard in self.shards.values()
            if shard.region == operation.shard_key.region
        ]
        return region_shards
    
    def should_reshard(self, metrics: dict) -> bool:
        """Determine if resharding is needed"""
        # Check shard size
        if metrics.get('data_size_gb', 0) > metrics.get('shard_size_threshold_gb', 100):
            return True
        
        # Check query load
        if metrics.get('queries_per_second', 0) > metrics.get('max_qps', 1000):
            return True
        
        # Check connection utilization
        if metrics.get('connection_utilization', 0) > 0.8:  # 80% threshold
            return True
        
        return False

class GeographicStrategy(RegionBasedStrategy):
    """Geographic sharding strategy with latency optimization"""
    
    def __init__(self, shards: List[ShardInfo], ring_size: int = 1024):
        super().__init__(shards, ring_size)
        self.region_latencies = self._init_region_latencies()
    
    def _init_region_latencies(self) -> dict:
        """Initialize region-to-region latency map"""
        # This would typically be populated with real latency data
        return {
            (Region.NA_EAST, Region.NA_WEST): 50,  # ms
            (Region.NA_EAST, Region.EU_WEST): 100,
            # Add more region pairs and their latencies
        }
    
    def get_optimal_shard(self, key: ShardKey, client_region: Region) -> ShardInfo:
        """Get optimal shard considering geographic location"""
        primary_shard = self.get_shard(key)
        
        # If client is in same region, use primary shard
        if primary_shard.region == client_region:
            return primary_shard
        
        # Find closest shard by latency
        min_latency = float('inf')
        optimal_shard = primary_shard
        
        for shard in self.shards.values():
            latency = self._get_region_latency(client_region, shard.region)
            if latency < min_latency:
                min_latency = latency
                optimal_shard = shard
        
        return optimal_shard
    
    def _get_region_latency(self, region1: Region, region2: Region) -> float:
        """Get latency between two regions"""
        key = (region1, region2)
        reverse_key = (region2, region1)
        return self.region_latencies.get(key) or self.region_latencies.get(reverse_key) or float('inf') 