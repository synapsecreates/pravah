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


# Schema for multi-persona login requests.
# Supports student, institution, government, and employer credentials or demo bypass.
class LoginRequest(BaseModel):
    persona: str = Field(..., description="User role: 'student', 'institution', 'government', or 'employer'")
    identifier: str = Field(..., description="Email, Roll number, AISHE code, or DSDO officer code")
    credential: str = Field(..., description="Password, OTP, or 'demo' for instant sandbox access")


# Authenticated session token response.
# Delivers JWT access token, assigned role, and scoped permission list.
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    email: str
    permissions: List[str]


# Payload for creating or updating a student profile.
# Encapsulates academic foundations, region, and continuous skill proficiencies.
class StudentProfileCreate(BaseModel):
    full_name: str = Field(..., min_length=2, description="Student full name")
    email: Optional[str] = Field(default=None, description="Optional contact email")
    institution_name: str = Field(..., description="College or university name")
    region: str = Field(..., description="Region of India (e.g. 'Central India')")
    department: str = Field(..., description="Academic department (e.g. 'Computer Science & Engineering')")
    degree_field: str = Field(..., description="Degree field (e.g. 'Computer Science')")
    current_year_of_study: int = Field(default=3, ge=1, le=5, description="Year of study (1-5)")
    graduation_year: int = Field(default=2026, ge=2024, le=2030, description="Expected graduation year")
    career_intent: str = Field(default="Campus Placement", description="Career intent")
    target_work_mobility: str = Field(default="Pan-India", description="Work location preference")
    target_role_slug: str = Field(default="fullstack-developer", description="Target occupational role slug")
    skills: Dict[str, int] = Field(default_factory=dict, description="Skill proficiency dictionary (0-100)")
    is_demo_account: bool = Field(default=False, description="True if demo student profile")


# Comprehensive student profile response returned by persistence layer.
# Includes database timestamps and unique candidate identifier.
class StudentProfileResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    full_name: str
    email: Optional[str] = None
    institution_name: str
    region: str
    department: str
    degree_field: str
    current_year_of_study: int
    graduation_year: int
    career_intent: str
    target_work_mobility: str
    target_role_slug: str
    skills: Dict[str, int]
    is_demo_account: bool
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# Sanitized candidate record for employer and institution cohort views.
# Enforces DPDP Act compliance: student name is masked unless an invitation is accepted.
class CohortStudentSummary(BaseModel):
    id: str
    display_name: str = Field(..., description="Masked candidate pseudonym or real name if invited")
    department: str
    degree_field: str
    graduation_year: int
    institution_name: str
    top_skills: List[str]
    is_invited: bool = False

