# FILE: backend/tests/test_phase3_auth_persistence.py
# PURPOSE: Phase 3 verification tests: multi-persona auth, password validation, token refresh, DPDP privacy, and persistence.
# PHASE: 3 | DEPENDS ON: auth.py, student.py, security.py, database/models.py | LAST TOUCHED: Phase 3

from fastapi.testclient import TestClient
from app.database.models import Invitation, StudentProfile, User
from app.database.session import SessionLocal, init_db
from app.main import app

# Initialize database tables and test client
init_db()
client = TestClient(app)


# Asserts that supplying an incorrect password rejects authentication with HTTP 401 Unauthorized.
def test_login_wrong_password_rejected() -> None:
    # 1. Register a test user
    client.post(
        "/api/v1/auth/login",
        json={"persona": "student", "identifier": "alice@pravah.test", "credential": "correct-password-123"},
    )

    # 2. Attempt login with wrong password
    response = client.post(
        "/api/v1/auth/login",
        json={"persona": "student", "identifier": "alice@pravah.test", "credential": "wrong-password-999"},
    )
    assert response.status_code == 401
    assert "rejected" in response.json()["detail"].lower() or "invalid" in response.json()["detail"].lower()


# Asserts that 1-click demo login succeeds for all 4 personas: student, institution, government, employer.
def test_demo_login_all_four_personas() -> None:
    personas = ["student", "institution", "government", "employer"]
    for persona in personas:
        response = client.get(f"/api/v1/auth/demo-token/{persona}")
        assert response.status_code == 200
        data = response.json()
        assert data["role"] == persona
        assert "access_token" in data
        assert len(data["permissions"]) > 0


# Asserts that an authenticated session token can be refreshed successfully.
def test_token_refresh() -> None:
    # Login as student
    login_resp = client.get("/api/v1/auth/demo-token/student")
    token = login_resp.json()["access_token"]

    # Refresh token
    refresh_resp = client.post(
        "/api/v1/auth/refresh",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert refresh_resp.status_code == 200
    new_token = refresh_resp.json()["access_token"]
    assert new_token is not None
    assert refresh_resp.json()["role"] == "student"


# Asserts that student profiles persist to the database and reload with identical skill proficiencies.
def test_student_profile_save_and_load_persistence() -> None:
    login_resp = client.get("/api/v1/auth/demo-token/student")
    token = login_resp.json()["access_token"]

    profile_payload = {
        "full_name": "Demo Student",
        "email": "demo.student@ggv.ac.in",
        "institution_name": "Guru Ghasidas Vishwavidyalaya",
        "region": "Central India",
        "department": "Computer Science & Engineering",
        "degree_field": "Computer Science",
        "current_year_of_study": 3,
        "graduation_year": 2026,
        "career_intent": "Campus Placement",
        "target_work_mobility": "Pan-India",
        "target_role_slug": "ai-ml-engineer",
        "skills": {"Python": 85, "SQL": 75, "Machine Learning": 70, "Docker": 60},
        "is_demo_account": True,
    }

    # Save profile
    save_resp = client.post(
        "/api/v1/student/profile",
        json=profile_payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert save_resp.status_code == 200
    saved_profile = save_resp.json()
    student_id = saved_profile["id"]
    assert saved_profile["full_name"] == "Demo Student"
    assert saved_profile["skills"]["Python"] == 85

    # Load profile back
    load_resp = client.get(
        f"/api/v1/student/profile/{student_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert load_resp.status_code == 200
    loaded = load_resp.json()
    assert loaded["id"] == student_id
    assert loaded["target_role_slug"] == "ai-ml-engineer"
    assert loaded["skills"]["Machine Learning"] == 70


# Rule (§2): Asserts that a college account cannot open any student's private details (DPDP Act).
def test_institution_forbidden_from_viewing_private_student_details() -> None:
    # 1. Create a student profile
    student_login = client.get("/api/v1/auth/demo-token/student")
    student_token = student_login.json()["access_token"]

    save_resp = client.post(
        "/api/v1/student/profile",
        json={
            "full_name": "Private Student",
            "email": "private.std@ggv.ac.in",
            "institution_name": "Guru Ghasidas Vishwavidyalaya",
            "region": "Central India",
            "department": "Computer Science & Engineering",
            "degree_field": "Computer Science",
            "skills": {"Python": 80},
            "is_demo_account": False,
        },
        headers={"Authorization": f"Bearer {student_token}"},
    )
    student_id = save_resp.json()["id"]

    # 2. Login as college dean
    dean_login = client.get("/api/v1/auth/demo-token/institution")
    dean_token = dean_login.json()["access_token"]

    # 3. Attempt to view private student record
    view_resp = client.get(
        f"/api/v1/student/profile/{student_id}",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert view_resp.status_code == 403
    assert "private" in view_resp.json()["detail"].lower() or "dpdp" in view_resp.json()["detail"].lower()


# Rule (§2): Asserts that an employer cannot see student names before an invitation is accepted (Blind Sourcing).
def test_employer_blind_sourcing_masks_student_name() -> None:
    import uuid

    unique_email = f"candidate_{uuid.uuid4().hex[:8]}@nitrr.test"

    # 1. Create a fresh unique student account
    student_reg = client.post(
        "/api/v1/auth/login",
        json={"persona": "student", "identifier": unique_email, "credential": "secret-password"},
    )
    assert student_reg.status_code == 200
    student_token = student_reg.json()["access_token"]

    save_resp = client.post(
        "/api/v1/student/profile",
        json={
            "full_name": "Secret Candidate",
            "email": unique_email,
            "institution_name": "NIT Raipur",
            "region": "Central India",
            "department": "Information Technology",
            "degree_field": "Information Technology",
            "skills": {"Java": 80},
            "is_demo_account": False,
        },
        headers={"Authorization": f"Bearer {student_token}"},
    )
    student_id = save_resp.json()["id"]

    # 2. Login as employer
    employer_login = client.get("/api/v1/auth/demo-token/employer")
    employer_token = employer_login.json()["access_token"]
    employer_id = employer_login.json()["user_id"]

    # 3. View profile as employer before invitation (must be masked)
    view_resp = client.get(
        f"/api/v1/student/profile/{student_id}",
        headers={"Authorization": f"Bearer {employer_token}"},
    )
    assert view_resp.status_code == 200
    candidate_view = view_resp.json()
    assert candidate_view["full_name"] == f"Candidate #{student_id}"
    assert candidate_view["email"] is None

    # 4. Accept invitation
    db = SessionLocal()
    invitation = Invitation(
        id=f"inv-{uuid.uuid4().hex[:8]}",
        employer_id=employer_id,
        student_id=student_id,
        role_title="Backend Developer",
        status="accepted",
    )
    db.add(invitation)
    db.commit()
    db.close()

    # 5. View profile as employer after invitation accepted (must reveal real name)
    view_accepted = client.get(
        f"/api/v1/student/profile/{student_id}",
        headers={"Authorization": f"Bearer {employer_token}"},
    )
    assert view_accepted.status_code == 200
    revealed_view = view_accepted.json()
    assert revealed_view["full_name"] == "Secret Candidate"
    assert revealed_view["email"] == unique_email

