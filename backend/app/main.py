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
from slowapi import Limiter
from slowapi.util import get_remote_address

# Import database connection dependency
from app.db.session import get_db

# Import API Routers
from app.api.endpoints import (
    auth,
    jobs,
    freelancers,
    matching
)
from app.core.config import settings

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

# Set up rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    await limiter.check_rate_limit(request)
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
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(freelancers.router, prefix="/api/freelancers", tags=["Freelancers"])
app.include_router(matching.router, prefix="/api/matching", tags=["Matching"])

# Serve Static Files (Logo, Images, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")
