# FILE: backend/app/models/schemas.py
# PURPOSE: Pydantic v2 data models for API request and response boundaries in Phase 1.
# PHASE: 1 | DEPENDS ON: pydantic | LAST TOUCHED: Phase 1

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


# Represents standard service health response.
# Simple dictionary containing service state and semantic version.
class HealthResponse(BaseModel):
    status: str = Field(default="OK", description="Service health state")
    version: str = Field(default="1.0.0", description="Semantic platform version")


# Summary metrics confirming raw dataset counts match specification.
# Used by verification tests to assert complete raw data availability.
class DatasetStatsResponse(BaseModel):
    skills_count: int = Field(..., description="Count of canonical skills (exactly 50)")
    anchor_roles_count: int = Field(..., description="Count of deep anchor roles (exactly 10)")
    total_roles_count: int = Field(..., description="Count of all directory roles (exactly 106)")
    districts_count: int = Field(..., description="Count of demo districts (exactly 5)")
    institutions_count: int = Field(..., description="Count of demo institutions (exactly 5)")


# Schema for a single canonical skill and its recognized aliases.
# Provides baseline categorization and industry demand index.
class SkillResponse(BaseModel):
    id: str = Field(..., description="Canonical unique identifier (e.g. 'kubernetes')")
    name: str = Field(..., description="Display title (e.g. 'Kubernetes')")
    category: str = Field(..., description="Domain category (e.g. 'DevOps')")
    aliases: List[str] = Field(default_factory=list, description="Common abbreviations (e.g. ['k8s'])")
    default_importance: float = Field(default=8.0, ge=1.0, le=10.0, description="Relative importance")
    industry_demand: float = Field(default=8.5, ge=1.0, le=10.0, description="Market demand score")


# Schema for an individual skill within an occupational benchmark.
# Specifies 4-tier requirement category and continuous benchmark level (0-100).
class RoleSkillSchema(BaseModel):
    skill_id: str = Field(..., description="Normalized skill identifier")
    name: str = Field(..., description="Skill display name")
    category: str = Field(default="General", description="Category grouping")
    requirement_category: str = Field(
        default="core",
        description="Requirement tier: 'critical', 'core', 'supporting', or 'complementary'",
    )
    required_level: int = Field(..., ge=0, le=100, description="Required benchmark level (0-100)")
    weight: float = Field(default=7.0, ge=1.0, le=10.0, description="Relative weight (1-10)")
    role_importance: float = Field(default=7.0, ge=1.0, le=10.0, description="Role importance (1-10)")
    mapping_weight: float = Field(default=0.85, ge=0.0, le=1.0, description="Mapping calibration factor")


# Complete occupational role schema for directory and anchor roles.
# Encapsulates education multipliers and required competency profiles.
class RoleResponse(BaseModel):
    id: str = Field(..., description="Unique role identifier (e.g. 'frontend-dev')")
    slug: str = Field(..., description="URL-friendly slug (e.g. 'frontend-developer')")
    title: str = Field(..., description="Official job title")
    domain: str = Field(default="Software Development", description="Industry domain")
    description: str = Field(default="", description="Role description summary")
    primary_focus: str = Field(default="", description="Core occupational focus")
    industry_demand: float = Field(default=8.0, ge=1.0, le=10.0, description="Industry demand score")
    is_anchor_role: bool = Field(default=False, description="True if one of the 10 deep anchor roles")
    education_factors: Dict[str, float] = Field(default_factory=dict, description="Discipline multipliers")
    skills: List[RoleSkillSchema] = Field(default_factory=list, description="Required competency list")


# Schema for regional administrative district.
# Used for geographical mapping and labor market deficit calculations.
class DistrictResponse(BaseModel):
    id: str = Field(..., description="District identifier (e.g. 'bilaspur')")
    name: str = Field(..., description="District display name (e.g. 'Bilaspur')")
    state: str = Field(..., description="Indian State (e.g. 'Chhattisgarh')")
    tier: int = Field(default=2, ge=1, le=3, description="City/district economic tier (1, 2, or 3)")
    economic_focus: str = Field(default="", description="Primary industrial cluster")


# Schema for higher education college / university institution.
# Connects students and curricula to geographic districts.
class InstitutionResponse(BaseModel):
    id: str = Field(..., description="Institution identifier (e.g. 'ggv-bilaspur')")
    name: str = Field(..., description="Full university/college name")
    district_id: str = Field(..., description="Associated district identifier")
    state: str = Field(..., description="State location")
    type: str = Field(default="University", description="Institution type")
