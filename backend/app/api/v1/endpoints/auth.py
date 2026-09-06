# FILE: backend/app/api/v1/endpoints/auth.py
# PURPOSE: Multi-persona authentication, token issuance, session refresh, and 1-click judge sandbox login.
# PHASE: 3 | DEPENDS ON: security.py, session.py, models.py, schemas.py | LAST TOUCHED: Phase 3

from datetime import timedelta
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.database.models import User
from app.database.session import get_db
from app.models.schemas import LoginRequest, TokenResponse

router = APIRouter()

# Default demo users dictionary for instant judge evaluation
DEMO_PERSONAS = {
    "student": {
        "id": "demo-student-001",
        "email": "demo.student@pravah.internal",
        "role": "student",
        "org_id": "ggv-bilaspur",
        "district_id": "bilaspur",
    },
    "institution": {
        "id": "demo-dean-ggv",
        "email": "dean.engg@ggu.ac.in",
        "role": "institution",
        "org_id": "ggv-bilaspur",
        "district_id": "bilaspur",
    },
    "government": {
        "id": "demo-dsdo-bilaspur",
        "email": "dsdo.bilaspur@cg.gov.in",
        "role": "government",
        "org_id": "dsdo-cg-01",
        "district_id": "bilaspur",
    },
    "employer": {
        "id": "demo-recruiter-tech",
        "email": "talent@enterprise-corp.com",
        "role": "employer",
        "org_id": "corp-recruiter-99",
        "district_id": "bangalore",
    },
}


# Authenticates user credentials across student, institution, government, and employer personas.
# Supports 1-click 'demo' credential bypass for evaluation judges.
@router.post("/auth/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    persona = request.persona.strip().lower()
    identifier = request.identifier.strip().lower()
    credential = request.credential.strip()

    if persona not in DEMO_PERSONAS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid persona '{persona}'. Supported personas: student, institution, government, employer.",
        )

    # 1. Check for Demo Mode bypass (for judges)
    if credential == "demo" or identifier in ["demo", "demo_student", "demo_dean", "demo_dsdo", "demo_employer"]:
        demo_info = DEMO_PERSONAS[persona]
        # Ensure demo user exists in database
        user = db.query(User).filter(User.id == demo_info["id"]).first()
        if not user:
            user = User(
                id=demo_info["id"],
                email=demo_info["email"],
                hashed_password=hash_password("demo-secret-password"),
                role=demo_info["role"],
                org_id=demo_info["org_id"],
                district_id=demo_info["district_id"],
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        token = create_access_token(
            user_id=user.id,
            role=user.role,
            email=user.email,
            org_id=user.org_id,
            district_id=user.district_id,
        )
        return TokenResponse(
            access_token=token,
            role=user.role,
            user_id=user.id,
            email=user.email,
            permissions=create_access_token.__globals__["ROLE_PERMISSIONS"].get(user.role, []),
        )

    # 2. Standard credential authentication
    user = db.query(User).filter(User.email == identifier).first()
    if not user:
        # Auto-register new account for demonstration flexibility
        user = User(
            id=str(uuid.uuid4())[:8],
            email=identifier,
            hashed_password=hash_password(credential),
            role=persona,
            org_id=f"org-{persona}",
            district_id="bilaspur",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Validate password against stored hash
        if not verify_password(credential, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password credentials. Authentication rejected.",
                headers={"WWW-Authenticate": "Bearer"},
            )

    token = create_access_token(
        user_id=user.id,
        role=user.role,
        email=user.email,
        org_id=user.org_id,
        district_id=user.district_id,
    )

    from app.core.security import ROLE_PERMISSIONS

    return TokenResponse(
        access_token=token,
        role=user.role,
        user_id=user.id,
        email=user.email,
        permissions=ROLE_PERMISSIONS.get(user.role, []),
    )


# Validates current bearer token and returns authenticated user context and scopes.
# Protected endpoint requiring valid Authorization header.
@router.get("/auth/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)) -> dict:
    return current_user


# Refreshes an active session token, extending the expiration window by 24 hours.
# Guarantees seamless session continuity without requiring credential re-entry.
@router.post("/auth/refresh", response_model=TokenResponse)
def refresh_token(current_user: dict = Depends(get_current_user)) -> TokenResponse:
    from app.core.security import ROLE_PERMISSIONS

    new_token = create_access_token(
        user_id=current_user["sub"],
        role=current_user["role"],
        email=current_user.get("email"),
        org_id=current_user.get("org_id"),
        district_id=current_user.get("district_id"),
        expires_delta=timedelta(days=1),
    )

    return TokenResponse(
        access_token=new_token,
        role=current_user["role"],
        user_id=current_user["sub"],
        email=current_user.get("email", ""),
        permissions=ROLE_PERMISSIONS.get(current_user["role"], []),
    )


# One-click demo login endpoint specifically for hackathon evaluation judges.
# Allows judges to instantaneously assume any of the 4 persona roles without forms.
@router.get("/auth/demo-token/{persona}", response_model=TokenResponse)
def get_demo_token(persona: str, db: Session = Depends(get_db)) -> TokenResponse:
    key = persona.strip().lower()
    if key not in DEMO_PERSONAS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Persona '{persona}' not found. Supported: student, institution, government, employer.",
        )

    demo_info = DEMO_PERSONAS[key]
    user = db.query(User).filter(User.id == demo_info["id"]).first()
    if not user:
        user = User(
            id=demo_info["id"],
            email=demo_info["email"],
            hashed_password=hash_password("demo-secret-password"),
            role=demo_info["role"],
            org_id=demo_info["org_id"],
            district_id=demo_info["district_id"],
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    from app.core.security import ROLE_PERMISSIONS

    token = create_access_token(
        user_id=user.id,
        role=user.role,
        email=user.email,
        org_id=user.org_id,
        district_id=user.district_id,
    )

    return TokenResponse(
        access_token=token,
        role=user.role,
        user_id=user.id,
        email=user.email,
        permissions=ROLE_PERMISSIONS.get(user.role, []),
    )
