from typing import List, Optional
from pydantic_settings import BaseSettings
from functools import lru_cache

from app.db.sharding.types import Region

class DatabaseConfig(BaseSettings):
    USER: str
    PASSWORD: str
    HOST: str
    PORT: int = 5432
    NAME: str
    POOL_SIZE: int = 5
    MAX_OVERFLOW: int = 10
    ECHO: bool = False

class ShardingConfig(BaseSettings):
    ENABLED: bool = True
    DEFAULT_REGION: Region = Region.NA_EAST
    REGIONS: List[Region] = [Region.NA_EAST]
    SHARDS_PER_REGION: int = 2
    MIN_SHARDS: int = 2
    MAX_SHARDS: int = 16
    SHARD_SIZE_THRESHOLD_GB: int = 100
    REPLICATION_FACTOR: int = 2
    AUTO_SCALING: bool = True
    CROSS_REGION_QUERIES: bool = True

class AIServiceConfig(BaseSettings):
    URL: str = "http://localhost:8001"  # Default to local development
    API_KEY: str
    TIMEOUT: int = 30
    MAX_RETRIES: int = 3
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    BIAS_THRESHOLD: float = 0.7
    MATCH_THRESHOLD: float = 0.7
    CACHE_TTL: int = 3600  # 1 hour

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "8thDegree"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # Database
    DB: DatabaseConfig = DatabaseConfig()
    SHARDING: ShardingConfig = ShardingConfig()
    
    # Security
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI Service
    AI_SERVICE: AIServiceConfig = AIServiceConfig()
    
    # AWS
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: Optional[str] = None
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    ENABLE_METRICS: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def get_shard_config(self) -> ShardingConfig:
        """Get sharding configuration"""
        return self.SHARDING

    def get_db_url(self, region: Optional[Region] = None, shard_num: Optional[int] = None) -> str:
        """Generate database URL with optional sharding parameters"""
        if not region:
            # Main connection string without sharding
            return f"postgresql://{self.DB.USER}:{self.DB.PASSWORD}@{self.DB.HOST}:{self.DB.PORT}/{self.DB.NAME}"
        
        # Sharded connection string
        host = f"{region.value}-{shard_num}.{self.DB.HOST}" if shard_num is not None else f"{region.value}.{self.DB.HOST}"
        return f"postgresql://{self.DB.USER}:{self.DB.PASSWORD}@{host}:{self.DB.PORT}/{self.DB.NAME}"

    @property
    def AI_SERVICE_URL(self) -> str:
        return self.AI_SERVICE.URL
        
    @property
    def AI_SERVICE_API_KEY(self) -> str:
        return self.AI_SERVICE.API_KEY

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings() 