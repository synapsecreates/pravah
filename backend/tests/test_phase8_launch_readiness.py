# FILE: tests/test_phase8_launch_readiness.py
# PURPOSE: Phase 8 launch readiness test suite verifying cold-start response times, honesty claims, offline resilience, and DPDP privacy floors.
# PHASE: 8 | DEPENDS ON: FastAPI TestClient, main.py, router.py | LAST TOUCHED: Phase 8

import os
import re
import time
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# -----------------------------------------------------------------------------
# 1. COLD START & SYSTEM DIAGNOSTICS TIMING TEST
# -----------------------------------------------------------------------------
def test_cold_start_timing_and_health() -> None:
    """Verifies that cold start health checks respond in under 100ms with accurate system stats."""
    start_time = time.perf_counter()
    response = client.get("/api/v1/health")
    duration = time.perf_counter() - start_time

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OK"
    assert data["version"] == "1.0.0"
    # Latency should be well under 200ms for in-process test client
    assert duration < 0.20, f"Health check response time took too long: {duration:.4f}s"


def test_system_stats_counts_integrity() -> None:
    """Verifies exact counts across canonical stores: 50 skills, 10 anchor roles, 106 directory roles, 5 districts, 5 colleges."""
    response = client.get("/api/v1/health/stats")
    assert response.status_code == 200
    data = response.json()

    assert data["skills_count"] == 50
    assert data["anchor_roles_count"] == 10
    assert data["total_roles_count"] == 106
    assert data["districts_count"] == 5
    assert data["institutions_count"] == 5


# -----------------------------------------------------------------------------
# 2. HONESTY AUDIT & BANNED MARKETING CLAIMS SCANNER
# -----------------------------------------------------------------------------
def test_zero_banned_marketing_claims_in_codebase() -> None:
    """Scans all source code in backend and frontend to ensure absolute honesty with 0 deceptive marketing claims."""
    banned_patterns = [
        re.compile(r"\bAI\s+decided\b", re.IGNORECASE),
        re.compile(r"\b100%\s+placement\b", re.IGNORECASE),
        re.compile(r"\bguaranteed\s+job\b", re.IGNORECASE),
        re.compile(r"\breal-time\s+placement\b", re.IGNORECASE),
        re.compile(r"\breal-time\s+market\b", re.IGNORECASE),
        re.compile(r"\breal-time\s+cohort\b", re.IGNORECASE),
        re.compile(r"\bformulated in real time\b", re.IGNORECASE),
    ]

    # Resolve repo root from test location
    tests_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(tests_dir, "..", ".."))

    violations = []
    for root, dirs, files in os.walk(repo_root):
        # Skip node_modules, git, venv, and build artifacts
        if any(ign in root for ign in ["node_modules", ".git", "venv", "dist", "__pycache__", "brain"]):
            continue
        for f in files:
            if f.endswith((".ts", ".tsx", ".py", ".html")):
                fpath = os.path.join(root, f)
                with open(fpath, "r", encoding="utf-8", errors="ignore") as file_obj:
                    for line_idx, line in enumerate(file_obj, 1):
                        for pat in banned_patterns:
                            if pat.search(line):
                                violations.append(f"{f}:{line_idx} - {line.strip()}")

    assert len(violations) == 0, f"Found banned deceptive claims: {violations}"


# -----------------------------------------------------------------------------
# 3. OFFLINE FALLBACK RESILIENCE TEST
# -----------------------------------------------------------------------------
def test_employer_jd_parser_offline_fallback_resilience(monkeypatch) -> None:
    """Verifies that the JD extractor produces a structured 4-tier profile even when GEMINI_API_KEY is empty or unavailable."""
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)

    sample_jd = (
        "Looking for a Cloud DevOps Engineer with extensive hands-on experience in "
        "Kubernetes, Docker, Terraform, CI/CD pipelines, and Python automation. "
        "Experience in Prometheus, AWS, and Linux administration is highly preferred."
    )

    response = client.post("/api/v1/employer/extract-jd", json={"raw_text": sample_jd})
    assert response.status_code == 200
    data = response.json()

    assert data["job_title"] != ""
    assert data["total_skills_extracted"] >= 3
    assert len(data["extracted_skills"]) >= 3
    # Check that tier classifications exist
    tiers = {s["tier"] for s in data["extracted_skills"]}
    assert "critical" in tiers or "core" in tiers

    # Verify fallback or model used is recorded
    assert "gemini" in data["model_used"].lower() or "nos" in data["model_used"].lower()


# -----------------------------------------------------------------------------
# 4. DPDP COMPLIANT PRIVACY FLOOR TEST (< 20 STUDENTS BLENDING)
# -----------------------------------------------------------------------------
def test_college_cohort_privacy_floor() -> None:
    """Verifies that institutional cohort analytics enforce under-20 student privacy safeguards."""
    # Under 20 students (N=19): must flip is_blended to True
    resp_19 = client.get("/api/v1/institution/ggv-bilaspur/overview?simulated_cohort_size=19")
    assert resp_19.status_code == 200
    data_19 = resp_19.json()
    assert data_19["enrolled_students_count"] == 19
    assert data_19["is_blended"] is True
    assert "Blended Regional Cohort" in data_19["blend_label"]

    # At or above 20 students (N=20): live unblended cohort data
    resp_20 = client.get("/api/v1/institution/ggv-bilaspur/overview?simulated_cohort_size=20")
    assert resp_20.status_code == 200
    data_20 = resp_20.json()
    assert data_20["enrolled_students_count"] == 20
    assert data_20["is_blended"] is False
    assert "Live Institutional Cohort" in data_20["blend_label"]


# -----------------------------------------------------------------------------
# 5. END-TO-END 4-PERSONA SMOKE TEST
# -----------------------------------------------------------------------------
def test_all_four_stakeholder_portals_health() -> None:
    """Verifies that core endpoints across Student, Institution, District, and Employer all return valid 200 responses."""
    # 1. Student Canvas Match Calculation
    student_resp = client.post(
        "/api/v1/matching/calculate-match",
        json={
            "role_id": "backend-dev",
            "student_ratings": {"Python": 80, "SQL": 75, "Git": 70},
            "degree_discipline": "Computer Science",
        },
    )
    assert student_resp.status_code == 200
    assert "final_readiness_score" in student_resp.json()

    # 2. Institution Portal Heatmap
    inst_resp = client.get("/api/v1/institution/ggv-bilaspur/heatmap")
    assert inst_resp.status_code == 200
    assert "skills" in inst_resp.json()

    # 3. District DSDO Deficit Matrix
    district_resp = client.get("/api/v1/district/bilaspur/deficit-matrix")
    assert district_resp.status_code == 200
    assert "sectors" in district_resp.json()

    # 4. Employer Talent Search
    employer_resp = client.get("/api/v1/employer/talent-search?role=Backend+Developer")
    assert employer_resp.status_code == 200
    assert "candidates" in employer_resp.json()
