import structlog
import logging
from app.core.config import settings

def get_logger(name: str) -> structlog.BoundLogger:
    """Get a configured structlog logger instance."""
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
        logger_factory=structlog.PrintLoggerFactory(),
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        cache_logger_on_first_use=True,
    )
    
    return structlog.get_logger(name) 