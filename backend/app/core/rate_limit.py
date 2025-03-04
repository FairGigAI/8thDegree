from functools import wraps
from fastapi import Request, HTTPException
from app.core.logging import get_logger
from app.core.config import settings
import redis
import json

logger = get_logger(__name__)
redis_client = redis.from_url(settings.REDIS_URL)

def rate_limit(limit: int, period: int):
    """Rate limiting decorator for FastAPI endpoints."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request = next((arg for arg in args if isinstance(arg, Request)), None)
            if not request:
                return await func(*args, **kwargs)

            # Get client IP
            client_ip = request.client.host
            key = f"rate_limit:{client_ip}:{func.__name__}"

            # Get current count
            current = redis_client.get(key)
            if current is None:
                # First request, set initial count
                redis_client.setex(key, period, 1)
                return await func(*args, **kwargs)

            count = int(current)
            if count >= limit:
                logger.warning(f"Rate limit exceeded for {client_ip} on {func.__name__}")
                raise HTTPException(
                    status_code=429,
                    detail=f"Too many requests. Please try again in {period} seconds."
                )

            # Increment count
            redis_client.incr(key)
            return await func(*args, **kwargs)
        return wrapper
    return decorator 