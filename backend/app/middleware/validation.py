from fastapi import Request, Response
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from app.core.logging import get_logger

logger = get_logger(__name__)

async def validation_middleware(request: Request, call_next):
    """Middleware for request validation and error handling."""
    try:
        response = await call_next(request)
        return response
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        return JSONResponse(
            status_code=422,
            content={
                "detail": "Validation error",
                "errors": e.errors()
            }
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Internal server error",
                "message": str(e)
            }
        ) 