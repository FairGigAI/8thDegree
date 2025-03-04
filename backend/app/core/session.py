from fastapi import Request
from starlette.middleware.sessions import SessionMiddleware
from app.core.config import settings

def setup_session_middleware(app):
    """Configure session middleware with secure settings."""
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.JWT_SECRET_KEY,
        session_cookie="session",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert minutes to seconds
        same_site=settings.SESSION_COOKIE_SAMESITE,
        https_only=settings.SESSION_COOKIE_SECURE,
        http_only=settings.SESSION_COOKIE_HTTPONLY,
    )

def get_session(request: Request):
    """Get the current session."""
    return request.session 