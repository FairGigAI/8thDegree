import pytest
import asyncio
from typing import Generator, Dict
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.db.sharding.types import Region, ShardType, ShardStatus, ShardInfo
from app.models.base import Base
from app.db.init_sharding import init_shard_database

def get_test_db_url(region: str = None, shard_num: int = None) -> str:
    """Get test database URL with optional sharding parameters."""
    base_url = "postgresql://test_user:test_pass@localhost:5432/test_db"
    if region:
        return f"postgresql://test_user:test_pass@{region}-{shard_num}.localhost:5432/test_db"
    return base_url

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
def test_shard_config():
    """Test sharding configuration."""
    return {
        "regions": [Region.NA_EAST, Region.EU_WEST],
        "shards_per_region": 2,
        "test_shards": [
            ShardInfo(
                shard_id=f"{region.value}-{i}",
                region=region,
                shard_type=ShardType.PRIMARY,
                status=ShardStatus.ACTIVE,
                connection_string=get_test_db_url(region.value, i),
                max_connections=5,
                current_connections=0
            )
            for region in [Region.NA_EAST, Region.EU_WEST]
            for i in range(2)
        ]
    }

@pytest.fixture(scope="session")
def test_db_engines(test_shard_config) -> Dict[str, Generator]:
    """Create test database engines for each shard."""
    engines = {}
    
    # Create main test database engine
    main_engine = create_engine(
        get_test_db_url(),
        poolclass=StaticPool,
        isolation_level='AUTOCOMMIT'
    )
    engines['main'] = main_engine
    
    # Create shard engines
    for shard in test_shard_config['test_shards']:
        engine = create_engine(
            shard.connection_string,
            poolclass=StaticPool,
            isolation_level='AUTOCOMMIT'
        )
        engines[shard.shard_id] = engine
    
    # Create all tables
    Base.metadata.create_all(bind=main_engine)
    for engine in engines.values():
        Base.metadata.create_all(bind=engine)
    
    yield engines
    
    # Cleanup
    for engine in engines.values():
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(test_db_engines):
    """Create a new database session for a test."""
    connection = test_db_engines['main'].connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def shard_sessions(test_db_engines, test_shard_config):
    """Create database sessions for each shard."""
    connections = {}
    transactions = {}
    sessions = {}
    
    for shard in test_shard_config['test_shards']:
        engine = test_db_engines[shard.shard_id]
        connections[shard.shard_id] = engine.connect()
        transactions[shard.shard_id] = connections[shard.shard_id].begin()
        sessions[shard.shard_id] = sessionmaker(bind=connections[shard.shard_id])()
    
    yield sessions
    
    for shard_id in sessions:
        sessions[shard_id].close()
        transactions[shard_id].rollback()
        connections[shard_id].close()

@pytest.fixture(scope="function")
async def initialized_shards(test_shard_config):
    """Initialize test shards."""
    for shard in test_shard_config['test_shards']:
        await init_shard_database(shard)
    return test_shard_config['test_shards'] 