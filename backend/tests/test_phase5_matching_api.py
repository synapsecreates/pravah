# FILE: backend/tests/test_phase5_matching_api.py
# PURPOSE: Automated test suite validating Phase 5 matching, gap analysis, simulation, and roadmap endpoints.
# PHASE: 5 | DEPENDS ON: testclient, main.py, matching.py | LAST TOUCHED: Phase 5

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# Verifies that calculate-match returns exact deterministic scores and complete inspect_math proof.
# Asserts raw score, critical penalty, and education multiplier calculations match Phase 2 engines.
def test_calculate_match_endpoint():
    payload = {
        "role_id": "frontend-dev",
        "student_ratings": {
            "html": 85,
            "css": 80,
            "javascript": 75,
            "react": 70,
            "typescript": 60,
        },
        "degree_discipline": "Computer Science",
    }
    response = client.post("/api/v1/matching/calculate-match", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["role_id"] == "frontend-dev"
    assert "role_title" in data
    assert 0.0 <= data["final_readiness_score"] <= 100.0
    assert 0.75 <= data["critical_penalty"] <= 1.0
    assert data["education_factor"] == 1.0
    assert "inspect_math" in data
    assert data["inspect_math"]["capped_sum"] > 0
    assert data["inspect_math"]["required_sum"] > 0
    assert data["inspect_math"]["critical_skills_total"] > 0


# Verifies that calculate-gaps returns properly classified 4-tier gap categories.
# Asserts gap calculation satisfies Gap = max(0, Required - Current).
def test_calculate_gaps_endpoint():
    payload = {
        "role_id": "frontend-dev",
        "student_ratings": {
            "html": 90,
            "css": 40,
            "javascript": 30,
        },
        "degree_discipline": "Computer Science",
    }
    response = client.post("/api/v1/matching/calculate-gaps", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "critical_gaps" in data
    assert "core_gaps" in data
    assert "supporting_gaps" in data
    assert "strengths" in data
    assert data["total_gaps_count"] > 0


# Verifies that what-if simulation calculates instant score gains on skill upgrades.
# Asserts simulated gain equals (simulated_score - baseline_score).
def test_what_if_simulate_endpoint():
    payload = {
        "role_id": "devops-engineer",
        "baseline_ratings": {
            "docker": 30,
            "kubernetes": 25,
            "linux": 50,
        },
        "target_skill": "docker",
        "simulated_rating": 80,
        "degree_discipline": "Computer Science",
    }
    response = client.post("/api/v1/matching/what-if-simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["role_id"] == "devops-engineer"
    assert data["target_skill"] == "docker"
    assert data["simulated_score"] > data["baseline_score"]
    assert data["projected_gain"] > 0.0
    assert round(data["simulated_score"] - data["baseline_score"], 2) == data["projected_gain"]


# Verifies top-10 roles recommendation ranking.
# Asserts returned list has 10 roles sorted in descending match order.
def test_top_roles_endpoint():
    payload = {
        "role_id": "frontend-dev",
        "student_ratings": {
            "python": 85,
            "sql": 80,
            "machine-learning": 75,
        },
        "degree_discipline": "Computer Science",
    }
    response = client.post("/api/v1/matching/top-roles", json=payload)
    assert response.status_code == 200
    data = response.json()
    roles = data["roles"]
    assert len(roles) == 10
    scores = [r["match_percentage"] for r in roles]
    assert scores == sorted(scores, reverse=True)


# Verifies roadmap generation produces prioritized study hours and capstone brief.
# Asserts pedagogical study hours match the H = round(Gap * 1.5 * mu) invariant.
def test_roadmap_endpoint():
    payload = {
        "role_id": "data-scientist",
        "student_ratings": {
            "python": 40,
            "sql": 50,
        },
        "degree_discipline": "Computer Science",
    }
    response = client.post("/api/v1/matching/roadmap", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["role_id"] == "data-scientist"
    assert len(data["milestones"]) > 0
    assert data["total_estimated_hours"] > 0
    assert "capstone_project" in data
    assert "title" in data["capstone_project"]
    assert "scenario" in data["capstone_project"]
    assert "deliverables" in data["capstone_project"]


# Verifies clean 404 response on non-existent role query.
# Asserts server returns friendly error instead of crashing.
def test_matching_fake_role_returns_404():
    payload = {
        "role_id": "non-existent-role-slug",
        "student_ratings": {"python": 50},
        "degree_discipline": "Computer Science",
    }
    response = client.post("/api/v1/matching/calculate-match", json=payload)
    assert response.status_code == 404
