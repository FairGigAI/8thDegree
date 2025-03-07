import asyncio
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.db.sharding.types import Region, ShardType, ShardStatus, ShardInfo

logger = logging.getLogger(__name__)

async def init_shard_database(shard: ShardInfo) -> bool:
    """Initialize a new shard database."""
    try:
        # Create database engine for the new shard
        engine = create_engine(
            shard.connection_string,
            isolation_level='AUTOCOMMIT'
        )
        
        # Create schemas
        with engine.connect() as conn:
            conn.execute(text('CREATE SCHEMA IF NOT EXISTS auth'))
            conn.execute(text('CREATE SCHEMA IF NOT EXISTS core'))
            conn.execute(text('CREATE SCHEMA IF NOT EXISTS ai'))
            
            # Create extensions
            conn.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'))
            conn.execute(text('CREATE EXTENSION IF NOT EXISTS "pg_trgm"'))
            conn.execute(text('CREATE EXTENSION IF NOT EXISTS "btree_gin"'))
            
        logger.info(f"Successfully initialized shard database: {shard.shard_id}")
        return True
        
    except SQLAlchemyError as e:
        logger.error(f"Failed to initialize shard database {shard.shard_id}: {str(e)}")
        return False

async def setup_sharding():
    """Set up initial sharding configuration."""
    shard_config = settings.get_shard_config()
    success_count = 0
    
    for region in shard_config.REGIONS:
        for i in range(shard_config.SHARDS_PER_REGION):
            shard_id = f"{region.value}-{i}"
            connection_string = settings.get_db_url(region, i)
            
            shard = ShardInfo(
                shard_id=shard_id,
                region=region,
                shard_type=ShardType.PRIMARY,
                status=ShardStatus.ACTIVE,
                connection_string=connection_string,
                max_connections=settings.DB.POOL_SIZE,
                current_connections=0
            )
            
            if await init_shard_database(shard):
                success_count += 1
    
    return success_count

async def verify_sharding():
    """Verify that all shards are properly configured."""
    shard_config = settings.get_shard_config()
    results = []
    
    for region in shard_config.REGIONS:
        for i in range(shard_config.SHARDS_PER_REGION):
            connection_string = settings.get_db_url(region, i)
            engine = create_engine(connection_string)
            
            try:
                with engine.connect() as conn:
                    # Check if required schemas exist
                    schemas = conn.execute(text("""
                        SELECT schema_name 
                        FROM information_schema.schemata 
                        WHERE schema_name IN ('auth', 'core', 'ai')
                    """)).fetchall()
                    
                    # Check if required extensions exist
                    extensions = conn.execute(text("""
                        SELECT extname 
                        FROM pg_extension
                        WHERE extname IN ('uuid-ossp', 'pg_trgm', 'btree_gin')
                    """)).fetchall()
                    
                    results.append({
                        'shard': f"{region.value}-{i}",
                        'status': 'healthy',
                        'schemas': len(schemas),
                        'extensions': len(extensions)
                    })
                    
            except SQLAlchemyError as e:
                results.append({
                    'shard': f"{region.value}-{i}",
                    'status': 'error',
                    'error': str(e)
                })
    
    return results

async def create_shard_metadata_tables():
    """Create metadata tables for shard management."""
    connection_string = settings.get_db_url()
    engine = create_engine(connection_string)
    
    try:
        with engine.connect() as conn:
            # Create shard metadata table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS ai.shard_metadata (
                    id VARCHAR PRIMARY KEY,
                    region VARCHAR NOT NULL,
                    shard_type VARCHAR NOT NULL,
                    status VARCHAR NOT NULL,
                    connection_string VARCHAR NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    last_health_check TIMESTAMP WITH TIME ZONE,
                    metadata JSONB
                )
            """))
            
            # Create shard metrics table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS ai.shard_metrics (
                    shard_id VARCHAR REFERENCES ai.shard_metadata(id) ON DELETE CASCADE,
                    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
                    data_size_gb FLOAT NOT NULL,
                    queries_per_second FLOAT NOT NULL,
                    connections INTEGER NOT NULL,
                    replication_lag FLOAT,
                    metrics JSONB,
                    PRIMARY KEY (shard_id, timestamp)
                )
            """))
            
            logger.info("Successfully created shard metadata tables")
            return True
            
    except SQLAlchemyError as e:
        logger.error(f"Failed to create shard metadata tables: {str(e)}")
        return False

async def init_sharding():
    """Initialize complete sharding setup."""
    logger.info("Starting sharding initialization...")
    
    # Create metadata tables
    if not await create_shard_metadata_tables():
        logger.error("Failed to create metadata tables")
        return False
    
    # Set up initial shards
    shard_count = await setup_sharding()
    logger.info(f"Initialized {shard_count} shards")
    
    # Verify setup
    verification = await verify_sharding()
    healthy_shards = sum(1 for r in verification if r['status'] == 'healthy')
    logger.info(f"Verified {healthy_shards} healthy shards")
    
    return healthy_shards > 0 