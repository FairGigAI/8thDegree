from fastapi import FastAPI
from fairgig.routers import user, job

app = FastAPI()

# Include API routes
app.include_router(user.router)
app.include_router(job.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FairGigAI"}
