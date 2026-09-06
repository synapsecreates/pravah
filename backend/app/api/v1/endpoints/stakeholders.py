# FILE: backend/app/api/v1/endpoints/stakeholders.py
# PURPOSE: Endpoints for querying demo administrative districts and educational institutions.
# PHASE: 1 | DEPENDS ON: schemas.py, dataset.py | LAST TOUCHED: Phase 1

from typing import List
from fastapi import APIRouter
from app.core.dataset import get_demo_districts, get_demo_institutions
from app.models.schemas import DistrictResponse, InstitutionResponse

router = APIRouter()


# Retrieves the list of demo administrative districts (5 districts).
# Used for regional planning and geographic breakdown in multi-stakeholder views.
@router.get("/districts", response_model=List[DistrictResponse])
def list_districts() -> List[DistrictResponse]:
    return get_demo_districts()


# Retrieves the list of demo higher education institutions (5 colleges).
# Provides demo college profiles and district associations for academic audits.
@router.get("/institutions", response_model=List[InstitutionResponse])
def list_institutions() -> List[InstitutionResponse]:
    return get_demo_institutions()
