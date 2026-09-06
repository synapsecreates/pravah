# FILE: backend/app/api/v1/endpoints/student.py
# PURPOSE: Endpoints for saving, loading, and querying student profiles with strict DPDP privacy gating.
# PHASE: 3 | DEPENDS ON: database/models.py, session.py, security.py, schemas.py | LAST TOUCHED: Phase 3

import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.security import get_current_user, require_roles
from app.database.models import Invitation, StudentProfile
from app.database.session import get_db
from app.models.schemas import CohortStudentSummary, StudentProfileCreate, StudentProfileResponse

router = APIRouter()


# Serializes an ORM StudentProfile instance into a Pydantic StudentProfileResponse.
# Safely parses the JSON skills string back into a continuous proficiency dictionary.
def serialize_student_profile(profile: StudentProfile) -> StudentProfileResponse:
    try:
        skills = json.loads(profile.skills_json)
    except Exception:
        skills = {}

    return StudentProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        email=profile.email,
        institution_name=profile.institution_name,
        region=profile.region,
        department=profile.department,
        degree_field=profile.degree_field,
        current_year_of_study=profile.current_year_of_study,
        graduation_year=profile.graduation_year,
        career_intent=profile.career_intent,
        target_work_mobility=profile.target_work_mobility,
        target_role_slug=profile.target_role_slug,
        skills=skills,
        is_demo_account=profile.is_demo_account,
        created_at=profile.created_at.isoformat() if profile.created_at else None,
        updated_at=profile.updated_at.isoformat() if profile.updated_at else None,
    )


# Creates or updates a student candidate profile in the persistent database.
# Links profile to authenticated student user ID and stores proficiencies as serialized JSON.
@router.post("/student/profile", response_model=StudentProfileResponse)
def save_student_profile(
    payload: StudentProfileCreate,
    db: Session = Depends(get_db),
    current_user: Optional[dict] = Depends(get_current_user),
) -> StudentProfileResponse:
    user_id = current_user["sub"] if current_user else None

    # Check if profile already exists for this user
    profile = None
    if user_id:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()

    if not profile:
        profile = StudentProfile(
            id=str(uuid.uuid4())[:8],
            user_id=user_id,
            full_name=payload.full_name,
            email=payload.email,
            institution_name=payload.institution_name,
            region=payload.region,
            department=payload.department,
            degree_field=payload.degree_field,
            current_year_of_study=payload.current_year_of_study,
            graduation_year=payload.graduation_year,
            career_intent=payload.career_intent,
            target_work_mobility=payload.target_work_mobility,
            target_role_slug=payload.target_role_slug,
            skills_json=json.dumps(payload.skills),
            is_demo_account=payload.is_demo_account,
        )
        db.add(profile)
    else:
        profile.full_name = payload.full_name
        profile.email = payload.email
        profile.institution_name = payload.institution_name
        profile.region = payload.region
        profile.department = payload.department
        profile.degree_field = payload.degree_field
        profile.current_year_of_study = payload.current_year_of_study
        profile.graduation_year = payload.graduation_year
        profile.career_intent = payload.career_intent
        profile.target_work_mobility = payload.target_work_mobility
        profile.target_role_slug = payload.target_role_slug
        profile.skills_json = json.dumps(payload.skills)
        profile.is_demo_account = payload.is_demo_account

    db.commit()
    db.refresh(profile)
    return serialize_student_profile(profile)


# Loads a single student profile by its unique ID.
# Enforces strict DPDP Act privacy rules: colleges cannot view individual private records.
@router.get("/student/profile/{student_id}", response_model=StudentProfileResponse)
def get_student_profile(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> StudentProfileResponse:
    user_role = current_user.get("role", "").lower()

    # Rule (§2): A college/institution account cannot open any student's private details
    if user_role == "institution":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Colleges are restricted to aggregate cohort benchmarks. Individual student records are private under DPDP compliance.",
        )

    profile = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student profile '{student_id}' was not found.",
        )

    # If student is viewing, they can only view their own profile
    if user_role == "student" and profile.user_id != current_user.get("sub") and not profile.is_demo_account:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Students are only permitted to view their own profile.",
        )

    resp = serialize_student_profile(profile)

    # Rule (§2): An employer cannot see student names before an invitation is accepted (Blind Sourcing)
    if user_role == "employer":
        accepted_invitation = (
            db.query(Invitation)
            .filter(
                Invitation.employer_id == current_user.get("sub"),
                Invitation.student_id == student_id,
                Invitation.status == "accepted",
            )
            .first()
        )
        if not accepted_invitation:
            resp.full_name = f"Candidate #{student_id}"
            resp.email = None

    return resp


# Retrieves candidate cohort list with privacy protections.
# Enforces blind sourcing for employers and statistical aggregation for colleges.
@router.get("/student/cohort", response_model=List[CohortStudentSummary])
def list_student_cohort(
    department: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> List[CohortStudentSummary]:
    user_role = current_user.get("role", "").lower()
    query = db.query(StudentProfile)

    if department:
        query = query.filter(StudentProfile.department == department)

    profiles = query.all()
    results: List[CohortStudentSummary] = []

    for p in profiles:
        try:
            skills_dict = json.loads(p.skills_json)
            top_skills = sorted(skills_dict.keys(), key=lambda k: skills_dict[k], reverse=True)[:5]
        except Exception:
            top_skills = []

        is_invited = False
        display_name = p.full_name

        # Employer blind sourcing check
        if user_role == "employer":
            invitation = (
                db.query(Invitation)
                .filter(
                    Invitation.employer_id == current_user.get("sub"),
                    Invitation.student_id == p.id,
                    Invitation.status == "accepted",
                )
                .first()
            )
            if not invitation:
                display_name = f"Candidate #{p.id}"
            else:
                is_invited = True

        results.append(
            CohortStudentSummary(
                id=p.id,
                display_name=display_name,
                department=p.department,
                degree_field=p.degree_field,
                graduation_year=p.graduation_year,
                institution_name=p.institution_name,
                top_skills=top_skills,
                is_invited=is_invited,
            )
        )

    return results
