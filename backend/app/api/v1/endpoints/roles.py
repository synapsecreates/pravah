# FILE: backend/app/api/v1/endpoints/roles.py
# PURPOSE: Endpoints for browsing the 106-occupations taxonomy and 10 deep anchor roles.
# PHASE: 1 | DEPENDS ON: schemas.py, dataset.py | LAST TOUCHED: Phase 1

from typing import List
from fastapi import APIRouter, HTTPException, status
from app.core.dataset import get_all_roles, get_anchor_roles, get_role_by_id
from app.models.schemas import RoleResponse

router = APIRouter()


# Retrieves the complete directory catalog of all 106 occupational roles.
# Returns list of RoleResponse models containing full competency profiles.
@router.get("/roles", response_model=List[RoleResponse])
def list_all_roles() -> List[RoleResponse]:
    return get_all_roles()


# Retrieves specifically the 10 deep anchor job roles.
# These roles contain 4-tier requirement categorizations for deep student matching.
@router.get("/roles/anchor", response_model=List[RoleResponse])
def list_anchor_roles() -> List[RoleResponse]:
    return get_anchor_roles()


# Retrieves a specific occupational role by unique ID or URL slug.
# Returns clean 404 error if role does not exist, guaranteeing zero unhandled crashes.
@router.get("/roles/{role_id}", response_model=RoleResponse)
def get_role_details(role_id: str) -> RoleResponse:
    role = get_role_by_id(role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID or slug '{role_id}' was not found in the taxonomy directory.",
        )
    return role
