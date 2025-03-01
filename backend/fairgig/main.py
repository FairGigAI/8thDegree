from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy.sql import text  # Import text() for raw SQL

# Import database connection dependency
from fairgig.database import get_db

# Import API Routers
from fairgig.routers.user import router as user_router
from fairgig.routers.job import router as job_router

app = FastAPI(
    title="FairGigAI",
    description="An open-source, fair freelance marketplace",
    version="0.1.0",
)

# Root Endpoint (Health Check)
@app.get("/")
def read_root():
    return {"message": "FairGigAI API is running!"}

# Database Connection Test
@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))  # Use text() for raw SQL
        return {"message": "Database connection successful!"}
    except Exception as e:
        return {"error": str(e)}

# Include API Routers
app.include_router(user_router, prefix="/user", tags=["Users"])
app.include_router(job_router, prefix="/job", tags=["Jobs"])

# Serve Static Files (Logo, Images, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")
