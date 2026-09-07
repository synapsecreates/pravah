# FILE: backend/tests/test_phase7_stakeholders_api.py
# PURPOSE: Integration tests for Phase 7 District DSDO planning and Employer talent search endpoints.
# PHASE: 7 | DEPENDS ON: fastapi.testclient, main.py | LAST TOUCHED: Phase 7

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_districts():
    """Verifies that GET /api/v1/district/list returns all 5 demo administrative districts."""
    res = client.get("/api/v1/district/list")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 5
    ids = [d["id"] for d in data]
    assert "bilaspur" in ids
    assert "bangalore" in ids
    assert "raipur" in ids


def test_get_district_deficit_matrix_bilaspur():
    """Verifies 5-sector labor supply vs demand deficit matrix for Bilaspur."""
    res = client.get("/api/v1/district/bilaspur/deficit-matrix")
    assert res.status_code == 200
    data = res.json()
    assert data["district_id"] == "bilaspur"
    assert data["district_name"] == "Bilaspur"
    assert data["tier"] == 3
    assert len(data["sectors"]) == 5
    assert data["total_demand"] > 0
    assert data["total_supply"] > 0
    assert data["net_regional_deficit"] == data["total_demand"] - data["total_supply"]

    # Check top sector has required fields
    top_sector = data["sectors"][0]
    assert "sector_id" in top_sector
    assert "demand_volume" in top_sector
    assert "supply_volume" in top_sector
    assert "net_balance" in top_sector
    assert "critical_bottleneck_skills" in top_sector
    assert len(top_sector["critical_bottleneck_skills"]) > 0


def test_get_district_deficit_matrix_bangalore():
    """Verifies Bangalore high-tier district telemetry."""
    res = client.get("/api/v1/district/bangalore/deficit-matrix")
    assert res.status_code == 200
    data = res.json()
    assert data["district_id"] == "bangalore"
    assert data["tier"] == 1
    assert data["total_demand"] > 10000


def test_get_district_deficit_matrix_invalid():
    """Verifies 404 response on unknown district ID."""
    res = client.get("/api/v1/district/nonexistent-district/deficit-matrix")
    assert res.status_code == 404


def test_get_district_subsidy_recommendations():
    """Verifies state training subsidy recommendations for Bilaspur."""
    res = client.get("/api/v1/district/bilaspur/subsidy-recommendations")
    assert res.status_code == 200
    data = res.json()
    assert data["district_id"] == "bilaspur"
    assert len(data["recommendations"]) >= 3
    first_rec = data["recommendations"][0]
    assert "target_program" in first_rec
    assert "recommended_subsidy_amount" in first_rec
    assert "priority_score" in first_rec
    assert first_rec["priority_score"] > 80.0


def test_extract_job_description_devops():
    """Verifies JD parser extracts structured 4-tier skill benchmarks from raw text."""
    payload = {
        "raw_text": "We are hiring a Senior DevOps and Cloud Platform Engineer with deep expertise in Docker, Kubernetes, AWS Cloud, CI/CD pipelines, and Linux shell scripting."
    }
    res = client.post("/api/v1/employer/extract-jd", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "DevOps" in data["job_title"] or "Cloud" in data["job_title"]
    assert data["total_skills_extracted"] >= 4
    skill_names = [s["skill_name"].lower() for s in data["extracted_skills"]]
    assert any("docker" in s for s in skill_names)
    assert any("kubernetes" in s for s in skill_names)
    assert any("aws" in s for s in skill_names)


def test_extract_job_description_too_short():
    """Verifies 400 validation error when JD text is too short."""
    res = client.post("/api/v1/employer/extract-jd", json={"raw_text": "short"})
    assert res.status_code == 422 or res.status_code == 400


def test_talent_search_all():
    """Verifies talent cohort search returns vetted blind candidate pool."""
    res = client.get("/api/v1/employer/talent-search?min_score=60")
    assert res.status_code == 200
    data = res.json()
    assert data["total_matching_candidates"] >= 5
    first_c = data["candidates"][0]
    assert first_c["candidate_id"].startswith("CAND-")
    assert first_c["match_score"] >= 60.0
    assert first_c["is_verified"] is True
    assert len(first_c["top_verified_skills"]) > 0


def test_talent_search_role_filter():
    """Verifies filtering talent pool by target role."""
    res = client.get("/api/v1/employer/talent-search?role=Cloud+DevOps+Engineer")
    assert res.status_code == 200
    data = res.json()
    assert data["total_matching_candidates"] >= 1
    for c in data["candidates"]:
        assert "DevOps" in c["target_role"]


def test_talent_search_min_score_filter():
    """Verifies high readiness cut-off filter."""
    res = client.get("/api/v1/employer/talent-search?min_score=90")
    assert res.status_code == 200
    data = res.json()
    for c in data["candidates"]:
        assert c["match_score"] >= 90.0
