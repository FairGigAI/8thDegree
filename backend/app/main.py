from fastapi import FastAPI, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from datetime import datetime, timedelta
from typing import Dict, List
import time
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

# Import database connection dependency
from fairgig.database import get_db

# Import API Routers
from fairgig.routers.auth import router as auth_router
from fairgig.routers.user import router as user_router
from fairgig.routers.job import router as job_router
from fairgig.routers import auth, oauth
from fairgig.core.config import settings

app = FastAPI(
    title="8thDegree API",
    description="API for the 8thDegree freelance marketplace platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
class RateLimiter:
    def __init__(self):
        self.requests: Dict[str, List[float]] = {}
        self.ip_limit = 100  # requests per minute
        self.user_limit = 1000  # requests per hour

    async def check_rate_limit(self, request: Request):
        client_ip = request.client.host
        current_time = time.time()

        # Clean old requests
        if client_ip in self.requests:
            self.requests[client_ip] = [
                req_time for req_time in self.requests[client_ip]
                if current_time - req_time < 3600  # Keep last hour
            ]

        # Initialize or get request list
        if client_ip not in self.requests:
            self.requests[client_ip] = []

        # Check limits
        minute_ago = current_time - 60
        hour_ago = current_time - 3600

        minute_requests = len([t for t in self.requests[client_ip] if t > minute_ago])
        hour_requests = len([t for t in self.requests[client_ip] if t > hour_ago])

        if minute_requests >= self.ip_limit:
            raise HTTPException(
                status_code=429,
                detail="Too many requests per minute"
            )

        if hour_requests >= self.user_limit:
            raise HTTPException(
                status_code=429,
                detail="Too many requests per hour"
            )

        # Add current request
        self.requests[client_ip].append(current_time)

rate_limiter = RateLimiter()

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    await rate_limiter.check_rate_limit(request)
    response = await call_next(request)
    return response

@app.get("/")
async def root():
    return {
        "message": "Welcome to the 8thDegree API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Database error occurred"}
    )

# Database Connection Test
@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"message": "Database connection successful!"}
    except Exception as e:
        return {"error": str(e)}

# Include API Routers
app.include_router(auth.router)
app.include_router(oauth.router)
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(job_router, prefix="/jobs", tags=["Jobs"])

# Serve Static Files (Logo, Images, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")
