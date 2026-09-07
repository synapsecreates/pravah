# FILE: backend/tests/test_phase1_baseline.py
# PURPOSE: Phase 1 verification tests: health probe, dataset counts, and 404 error handling.
# PHASE: 1 | DEPENDS ON: fastapi, httpx, pytest, app.main | LAST TOUCHED: Phase 1

from fastapi.testclient import TestClient
from app.main import app

# TestClient instance for synchronous HTTP request testing
client = TestClient(app)


# Verifies that the health endpoint returns status OK and version 1.0.0.
# Basic baseline assertion for server readiness.
def test_health_check_ok() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OK"
    assert data["version"] == "1.0.0"


# Verifies that the lightweight ping endpoint responds with pong.
def test_health_ping_ok() -> None:
    response = client.get("/api/v1/health/ping")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "pong"


# Asserts that all dataset entities load with exact counts specified in Phase 1:
# exactly 50 canonical skills, 10 deep anchor roles, 106 directory roles, and 5 demo districts.
def test_dataset_exact_counts() -> None:
    response = client.get("/api/v1/health/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["skills_count"] == 50, f"Expected 50 canonical skills, got {data['skills_count']}"
    assert data["anchor_roles_count"] == 10, f"Expected 10 anchor roles, got {data['anchor_roles_count']}"
    assert data["total_roles_count"] == 106, f"Expected 106 directory roles, got {data['total_roles_count']}"
    assert data["districts_count"] == 5, f"Expected 5 demo districts, got {data['districts_count']}"
    assert data["institutions_count"] == 5, f"Expected 5 demo institutions, got {data['institutions_count']}"


# Asserts that querying an anchor role returns valid competency data and 4-tier categories.
# Checks that the frontend developer role contains skills with requirement categories.
def test_anchor_role_structure() -> None:
    response = client.get("/api/v1/roles/frontend-dev")
    assert response.status_code == 200
    role = response.json()
    assert role["id"] == "frontend-dev"
    assert role["is_anchor_role"] is True
    assert len(role["skills"]) > 0
    # Confirm 4-tier requirement category is present on skills
    categories = {s["requirement_category"] for s in role["skills"]}
    assert len(categories.intersection({"critical", "core", "supporting", "complementary"})) > 0


# Asserts that requesting a non-existent role ID returns a clean 404 error response.
# Verifies zero unhandled exceptions or crashes when an invalid ID is requested.
def test_fake_role_returns_clean_404() -> None:
    response = client.get("/api/v1/roles/completely-fake-role-id-999")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "not found" in data["detail"].lower()


# Asserts that the skill alias resolution endpoint successfully translates common abbreviations.
# Example: resolves colloquial 'k8s' -> canonical 'Kubernetes'.
def test_skill_alias_resolution() -> None:
    response = client.get("/api/v1/skills/resolve?query=k8s")
    assert response.status_code == 200
    data = response.json()
    assert data["canonical_name"] == "Kubernetes"
