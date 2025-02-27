from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text  # Import text() for raw SQL
from fairgig.database import get_db

app = FastAPI()

@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))  # Use text() for raw SQL
        return {"message": "Database connection successful!"}
    except Exception as e:
        return {"error": str(e)}
