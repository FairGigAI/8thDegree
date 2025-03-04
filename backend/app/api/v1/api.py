from fastapi import APIRouter
from app.api.v1.endpoints import auth, jobs, users, public

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(public.router, prefix="/public", tags=["public"]) 