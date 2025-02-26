from fastapi import APIRouter

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("/")
def get_jobs():
    return [{"id": 1, "title": "Software Developer", "company": "FairGigAI"}]
