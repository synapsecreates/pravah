# FILE: backend/app/core/dataset.py
# PURPOSE: Pure data access and loading layer for canonical skills, roles, and stakeholders.
# PHASE: 1 | DEPENDS ON: json, os, schemas.py | LAST TOUCHED: Phase 1

import json
import os
from typing import Dict, List, Optional
from app.core.config import settings
from app.models.schemas import (
    DistrictResponse,
    InstitutionResponse,
    RoleResponse,
    RoleSkillSchema,
    SkillResponse,
)

# File paths to raw data JSON stores
SKILLS_FILE = os.path.join(settings.DATA_DIR, "canonical_skills.json")
ROLES_FILE = os.path.join(settings.DATA_DIR, "seed_roles.json")
STAKEHOLDERS_FILE = os.path.join(settings.DATA_DIR, "seed_stakeholders.json")


# Loads raw canonical skills JSON file from disk.
# Returns list of skill dictionaries with alias mappings.
def load_raw_skills() -> List[dict]:
    with open(SKILLS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# Loads raw occupations JSON file from disk.
# Returns dict containing roles list and dataset metadata.
def load_raw_roles() -> dict:
    with open(ROLES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# Loads raw stakeholders JSON file from disk.
# Returns dict with districts, institutions, courses, and district demand.
def load_raw_stakeholders() -> dict:
    with open(STAKEHOLDERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# Retrieves all canonical skills as strongly-typed Pydantic models.
# Provides standardized names, categories, and alias lookup arrays.
def get_canonical_skills() -> List[SkillResponse]:
    raw = load_raw_skills()
    return [SkillResponse(**s) for s in raw]


# Resolves a colloquial skill term or alias into its canonical display name.
# Example: converts 'k8s' -> 'Kubernetes', 'py' -> 'Python'.
def resolve_skill_alias(query: str) -> str:
    cleaned = query.strip().lower()
    skills = get_canonical_skills()
    for s in skills:
        if s.id.lower() == cleaned or s.name.lower() == cleaned:
            return s.name
        for alias in s.aliases:
            if alias.lower() == cleaned:
                return s.name
    return query.strip()


# Retrieves complete catalog of all 106 occupational directory roles.
# Each role contains full metadata, education factors, and skill profiles.
def get_all_roles() -> List[RoleResponse]:
    data = load_raw_roles()
    roles: List[RoleResponse] = []
    for r in data.get("roles", []):
        skills = [RoleSkillSchema(**s) for s in r.get("skills", [])]
        roles.append(
            RoleResponse(
                id=r["id"],
                slug=r["slug"],
                title=r["title"],
                domain=r.get("domain", "Software Development"),
                description=r.get("description", ""),
                primary_focus=r.get("primary_focus", ""),
                industry_demand=r.get("industry_demand", 8.0),
                is_anchor_role=r.get("is_anchor_role", False),
                education_factors=r.get("education_factors", {}),
                skills=skills,
            )
        )
    return roles


# Filters directory to retrieve exactly the 10 deep anchor roles.
# Anchor roles have full 4-tier requirement categories for deep student matching.
def get_anchor_roles() -> List[RoleResponse]:
    all_roles = get_all_roles()
    return [r for r in all_roles if r.is_anchor_role]


# Retrieves single role by its unique ID or URL slug.
# Returns None if no matching role exists, enabling clean 404 handling.
def get_role_by_id(role_id_or_slug: str) -> Optional[RoleResponse]:
    key = role_id_or_slug.strip().lower()
    for r in get_all_roles():
        if r.id.lower() == key or r.slug.lower() == key:
            return r
    return None


# Retrieves list of all demo administrative districts.
# Used for geographical mapping and labor market deficit telemetry.
def get_demo_districts() -> List[DistrictResponse]:
    data = load_raw_stakeholders()
    return [DistrictResponse(**d) for d in data.get("districts", [])]


# Retrieves list of all demo higher education institutions.
# Maps colleges to administrative districts and departments.
def get_demo_institutions() -> List[InstitutionResponse]:
    data = load_raw_stakeholders()
    return [InstitutionResponse(**i) for i in data.get("institutions", [])]
