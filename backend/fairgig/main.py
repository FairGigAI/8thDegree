from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.utils import get_openapi
import os
from fairgig.routers import user, job

app = FastAPI(
    title="FairGigAI - The Fair Freelance Marketplace",
    description="An open-source freelance marketplace connecting freelancers and clients fairly and transparently.",
    version="0.1.0",
    contact={
        "name": "FairGigAI Support",
        "email": "support@fairgig.ai",
        "url": "https://fairgig.ai",
    },
    license_info={
        "name": "GPL-3.0 License",
        "url": "https://opensource.org/licenses/GPL-3.0",
    },
)

# Ensure the static directory is correctly set relative to the script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "../static")

# Check if the directory exists
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# Custom OpenAPI Schema (Adds Branding)
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="FairGigAI - The Fair Freelance Marketplace",
        version="0.1.0",
        description="An open-source freelance marketplace connecting freelancers and clients.",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "/static/logo.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

# Include API routes
app.include_router(user.router)
app.include_router(job.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to FairGigAI"}
