# FILE: backend/app/api/v1/endpoints/skills.py
# PURPOSE: Endpoints for querying canonical industry skills and resolving colloquial aliases.
# PHASE: 1 | DEPENDS ON: schemas.py, dataset.py | LAST TOUCHED: Phase 1

from typing import Dict, List
from fastapi import APIRouter, Query
from app.core.dataset import get_canonical_skills, resolve_skill_alias
from app.models.schemas import SkillResponse

router = APIRouter()


# Retrieves the complete list of 50 canonical skills across all technical domains.
# Serves standard options for onboarding skill selection and proficiencies.
@router.get("/skills", response_model=List[SkillResponse])
def list_canonical_skills() -> List[SkillResponse]:
    return get_canonical_skills()


# Resolves a skill alias or colloquial term to its canonical display name.
# Example: ?query=k8s returns {"query": "k8s", "canonical_name": "Kubernetes"}.
@router.get("/skills/resolve", response_model=Dict[str, str])
def resolve_skill(query: str = Query(..., min_length=1, description="Skill query to resolve")) -> Dict[str, str]:
    canonical = resolve_skill_alias(query)
    return {
        "query": query,
        "canonical_name": canonical,
    }
