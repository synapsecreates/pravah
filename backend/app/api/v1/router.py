# FILE: backend/app/api/v1/router.py
# PURPOSE: Aggregates all Phase 1 API v1 endpoint routers into a unified APIRouter.
# PHASE: 1 | DEPENDS ON: endpoints (health, roles, skills, stakeholders) | LAST TOUCHED: Phase 1

from fastapi import APIRouter
from app.api.v1.endpoints import health, roles, skills, stakeholders

api_router = APIRouter()

# Register sub-routers with logical tagging
api_router.include_router(health.router, tags=["Health & Diagnostics"])
api_router.include_router(roles.router, tags=["Roles & Taxonomy"])
api_router.include_router(skills.router, tags=["Skills & Aliases"])
api_router.include_router(stakeholders.router, tags=["Stakeholders & Regional"])
