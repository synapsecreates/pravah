# FILE: backend/tests/test_phase6_institution_api.py
# PURPOSE: Automated verification tests for Phase 6 Academic Governance and College Portal endpoints.
# PHASE: 6 | DEPENDS ON: app.main, fastapi.testclient, pytest | LAST TOUCHED: Phase 6

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# 1. Test listing demo institutions
def test_list_institutions() -> None:
    resp = client.get("/api/v1/institution/list")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    inst_ids = [item["id"] for item in data]
    assert "ggv-bilaspur" in inst_ids
    assert "nit-raipur" in inst_ids


# 2. Test institutional overview default state (N >= 20, unblended live data)
def test_institution_overview_live() -> None:
    resp = client.get("/api/v1/institution/ggv-bilaspur/overview")
    assert resp.status_code == 200
    data = resp.json()
    assert data["institution_id"] == "ggv-bilaspur"
    assert data["enrolled_students_count"] >= 20
    assert data["is_blended"] is False
    assert "Live Institutional Cohort" in data["blend_label"]
    assert data["placement_eligibility_rate"] > 50.0
    assert data["curriculum_health_index"] > 0


# 3. Test under-20 privacy floor rule (N = 19 triggers blended regional data)
def test_institution_overview_privacy_floor() -> None:
    resp = client.get("/api/v1/institution/ggv-bilaspur/overview?simulated_cohort_size=19")
    assert resp.status_code == 200
    data = resp.json()
    assert data["enrolled_students_count"] == 19
    assert data["is_blended"] is True
    assert "Blended Regional Cohort" in data["blend_label"]
    assert "Privacy Floor Protected" in data["blend_label"]


# 4. Test boundary condition: N = 20 flips to live institutional data
def test_institution_privacy_boundary_flip() -> None:
    # At N=19: blended
    resp_19 = client.get("/api/v1/institution/ggv-bilaspur/overview?simulated_cohort_size=19")
    assert resp_19.json()["is_blended"] is True

    # At N=20: live data
    resp_20 = client.get("/api/v1/institution/ggv-bilaspur/overview?simulated_cohort_size=20")
    assert resp_20.json()["is_blended"] is False
    assert "Live Institutional Cohort" in resp_20.json()["blend_label"]


# 5. Test departmental competency heatmap calculation and sorting
def test_departmental_heatmap() -> None:
    resp = client.get(
        "/api/v1/institution/ggv-bilaspur/heatmap?department=Computer+Science+%26+Engineering&target_role=fullstack-developer"
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["institution_id"] == "ggv-bilaspur"
    assert data["total_skills_audited"] > 0
    assert len(data["skills"]) > 0

    skills = data["skills"]
    # Check that skills are sorted by largest curriculum gap first
    for i in range(len(skills) - 1):
        assert skills[i]["curriculum_gap"] >= skills[i + 1]["curriculum_gap"]

    # Verify formula breakdown exists
    assert "Benchmark:" in skills[0]["formula_breakdown"]
    assert "Cohort Avg:" in skills[0]["formula_breakdown"]


# 6. Test departmental heatmap with privacy blending applied (<20 students)
def test_departmental_heatmap_blended() -> None:
    resp = client.get(
        "/api/v1/institution/ggv-bilaspur/heatmap?simulated_cohort_size=19"
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["is_blended"] is True
    assert "Blended Regional Data" in data["blend_label"]


# 7. Test course syllabus modernization audits
def test_course_syllabus_audits() -> None:
    resp = client.get("/api/v1/institution/ggv-bilaspur/course-audits")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_courses_audited"] > 0
    courses = data["courses"]

    # CS405 (8085 Microprocessor) should be OBSOLETE
    micro_course = next((c for c in courses if "8085" in c["course_name"] or c["course_code"] == "CS405"), None)
    if micro_course:
        assert micro_course["status"] == "OBSOLETE"
        assert "ARM Cortex" in micro_course["recommended_action"]


# 8. Test editing course skills flips status dynamically in real-time
def test_update_course_skills_flips_status() -> None:
    # Update CS105 (Linux Shell) with modern Docker and CI/CD skills
    payload = {
        "mapped_skills": ["Linux Shell & Scripting", "Docker", "CI/CD", "AWS Cloud"]
    }
    resp = client.post(
        "/api/v1/institution/ggv-bilaspur/course-audits/cs105/update-skills",
        json=payload,
    )
    assert resp.status_code == 200
    updated = resp.json()
    assert updated["id"] == "cs105"
    assert "Docker" in updated["mapped_skills"]
    # Should dynamically evaluate to ALIGNED
    assert updated["status"] == "ALIGNED"
    assert updated["alignment_score"] > 80.0


# 9. Test placement eligibility and batch percentiles
def test_placement_eligibility() -> None:
    resp = client.get("/api/v1/institution/ggv-bilaspur/placement-eligibility")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_evaluated"] > 0
    assert data["overall_eligibility_rate"] > 0

    tiers = data["tier_distribution"]
    assert len(tiers) == 4
    tier_names = [t["tier_name"] for t in tiers]
    assert "Tier 1" in tier_names
    assert "Tier 2" in tier_names
    assert "Tier 3" in tier_names
    assert "Tier 4" in tier_names

    # Candidate counts sum to total evaluated
    total_in_tiers = sum(t["candidate_count"] for t in tiers)
    assert total_in_tiers == data["total_evaluated"]
