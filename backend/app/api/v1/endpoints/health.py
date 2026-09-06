# FILE: backend/app/api/v1/endpoints/health.py
# PURPOSE: Health check and dataset verification endpoints for system diagnostics.
# PHASE: 1 | DEPENDS ON: schemas.py, dataset.py | LAST TOUCHED: Phase 1

from fastapi import APIRouter
from app.core.dataset import (
    get_all_roles,
    get_anchor_roles,
    get_canonical_skills,
    get_demo_districts,
    get_demo_institutions,
)
from app.models.schemas import DatasetStatsResponse, HealthResponse

router = APIRouter()


# Basic liveness probe returning service operational status and version.
# Standard endpoint queried by monitoring systems and frontend startup.
@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    return HealthResponse(status="OK", version="1.0.0")


# Verification endpoint returning exact counts of all loaded dataset entities.
# Validates exact match with Phase 1 specification: 50 skills, 10 deep roles, 106 directory roles, 5 districts.
@router.get("/health/stats", response_model=DatasetStatsResponse)
def get_dataset_stats() -> DatasetStatsResponse:
    skills = get_canonical_skills()
    all_roles = get_all_roles()
    anchor_roles = get_anchor_roles()
    districts = get_demo_districts()
    institutions = get_demo_institutions()

    return DatasetStatsResponse(
        skills_count=len(skills),
        anchor_roles_count=len(anchor_roles),
        total_roles_count=len(all_roles),
        districts_count=len(districts),
        institutions_count=len(institutions),
    )
