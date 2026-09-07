# FILE: backend/app/api/v1/router.py
# PURPOSE: Aggregates all Phase 1-5 API v1 endpoint routers into a unified APIRouter.
# PHASE: 5 | DEPENDS ON: endpoints (health, roles, skills, stakeholders, auth, student, matching) | LAST TOUCHED: Phase 5

from fastapi import APIRouter
from app.api.v1.endpoints import auth, health, institution, matching, roles, skills, stakeholders, student

api_router = APIRouter()

# Register sub-routers with logical tagging
api_router.include_router(health.router, tags=["Health & Diagnostics"])
api_router.include_router(auth.router, tags=["Authentication & Access Control"])
api_router.include_router(student.router, tags=["Student Profiles & Persistence"])
api_router.include_router(matching.router, tags=["Scoring & Diagnostics"])
api_router.include_router(institution.router, prefix="/institution", tags=["Academic Governance & College Portal"])
api_router.include_router(roles.router, tags=["Roles & Taxonomy"])
api_router.include_router(skills.router, tags=["Skills & Aliases"])
api_router.include_router(stakeholders.router, tags=["Stakeholders & Regional"])
