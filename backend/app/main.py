# FILE: backend/app/main.py
# PURPOSE: Root FastAPI application initialization and entrypoint for Pravah.
# PHASE: 1 | DEPENDS ON: fastapi, config.py, router.py | LAST TOUCHED: Phase 1

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings

# Initialize FastAPI application instance with OpenAPI metadata
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Configure Cross-Origin Resource Sharing (CORS) for frontend client
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 endpoint collection
app.include_router(api_router, prefix=settings.API_V1_STR)


# Root endpoint providing immediate service identification and docs link.
# Useful for human sanity checks when opening the root server URL.
@app.get("/", tags=["Root"])
def root_endpoint() -> dict:
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs",
        "health": f"{settings.API_V1_STR}/health",
        "stats": f"{settings.API_V1_STR}/health/stats",
    }
