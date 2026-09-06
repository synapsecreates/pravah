# FILE: backend/tests/test_engines.py
# PURPOSE: Full 18-test deterministic mathematical test suite covering §5, §8.1 invariants and zero randomness.
# PHASE: 2 | DEPENDS ON: engines (role_matcher, gap_analyzer, priority_engine, stakeholder_engine) | LAST TOUCHED: Phase 2

from app.core.dataset import resolve_skill_alias
from app.engines.gap_analyzer import analyze_skill_gaps, calculate_skill_gap
from app.engines.priority_engine import calculate_priority_index, calculate_study_hours
from app.engines.role_matcher import (
    calculate_critical_penalty,
    calculate_final_readiness_score,
    calculate_raw_match_score,
    cap_proficiency,
    get_degree_multiplier,
    get_tier_multiplier,
)
from app.engines.stakeholder_engine import (
    aggregate_cohort_proficiencies,
    calculate_departmental_heatmap,
    calculate_regional_deficit,
)


# Test 1: Asserts that an empty role with zero requirement points returns 0.0 without ZeroDivisionError.
def test_zero_division_protection() -> None:
    raw_score, capped, req = calculate_raw_match_score({"python": 80}, [])
    assert raw_score == 0.0
    assert capped == 0.0
    assert req == 0.0


# Test 2: Asserts that student proficiency is capped at the required benchmark level (min(s_i, r_i)).
def test_overqualification_capping_basic() -> None:
    capped = cap_proficiency(student_level=95.0, required_level=70.0)
    assert capped == 70.0


# Test 3: Asserts that student proficiency below the required level is preserved without penalty.
def test_overqualification_capping_edge() -> None:
    capped = cap_proficiency(student_level=50.0, required_level=70.0)
    assert capped == 50.0


# Test 4: Verifies that the 'critical' requirement tier multiplier is exactly 1.00.
def test_tier_weight_critical() -> None:
    assert get_tier_multiplier("critical") == 1.00


# Test 5: Verifies that the 'core' requirement tier multiplier is exactly 0.75.
def test_tier_weight_core() -> None:
    assert get_tier_multiplier("core") == 0.75


# Test 6: Verifies that the 'supporting' requirement tier multiplier is exactly 0.45.
def test_tier_weight_supporting() -> None:
    assert get_tier_multiplier("supporting") == 0.45


# Test 7: Verifies that the 'complementary' requirement tier multiplier is exactly 0.20.
def test_tier_weight_complementary() -> None:
    assert get_tier_multiplier("complementary") == 0.20


# Test 8: Asserts that meeting 100% of critical prerequisites yields a penalty factor of 1.00 (no penalty).
def test_critical_penalty_full_fulfillment() -> None:
    role_skills = [
        {"name": "Python", "required_level": 80, "requirement_category": "critical"},
        {"name": "SQL", "required_level": 70, "requirement_category": "critical"},
    ]
    student_skills = {"python": 85, "sql": 70}
    penalty, met, total = calculate_critical_penalty(student_skills, role_skills)
    assert penalty == 1.00
    assert met == 2
    assert total == 2


# Test 9: Asserts that failing all critical prerequisites drops penalty to base floor of 0.75 (25% penalty).
def test_critical_penalty_zero_fulfillment() -> None:
    role_skills = [
        {"name": "Python", "required_level": 80, "requirement_category": "critical"},
        {"name": "SQL", "required_level": 70, "requirement_category": "critical"},
    ]
    student_skills = {"python": 40, "sql": 50}
    penalty, met, total = calculate_critical_penalty(student_skills, role_skills)
    assert penalty == 0.75
    assert met == 0
    assert total == 2


# Test 10: Asserts that meeting 1 of 2 critical skills yields exactly 0.75 + 0.25 * (1/2) = 0.875.
def test_critical_penalty_partial_fulfillment() -> None:
    role_skills = [
        {"name": "Python", "required_level": 80, "requirement_category": "critical"},
        {"name": "SQL", "required_level": 70, "requirement_category": "critical"},
    ]
    student_skills = {"python": 85, "sql": 50}
    penalty, met, total = calculate_critical_penalty(student_skills, role_skills)
    assert penalty == 0.875
    assert met == 1
    assert total == 2


# Test 11: Verifies that Computer Science degree discipline multiplier is exactly 1.00.
def test_degree_multiplier_cs() -> None:
    assert get_degree_multiplier("Computer Science") == 1.00
    assert get_degree_multiplier("CSE") == 1.00


# Test 12: Verifies that Information Technology degree discipline multiplier is exactly 0.95.
def test_degree_multiplier_it() -> None:
    assert get_degree_multiplier("Information Technology") == 0.95
    assert get_degree_multiplier("IT") == 0.95


# Test 13: Verifies that Electronics & Communication degree discipline multiplier is exactly 0.90.
def test_degree_multiplier_ece() -> None:
    assert get_degree_multiplier("Electronics and Communication") == 0.90
    assert get_degree_multiplier("ECE") == 0.90


# Test 14: Verifies that Other STEM (Mechanical, Civil, etc.) multiplier is exactly 0.85.
def test_degree_multiplier_other_stem() -> None:
    assert get_degree_multiplier("Mechanical Engineering") == 0.85
    assert get_degree_multiplier("Civil Engineering") == 0.85


# Test 15: Verifies that Non-STEM degree discipline multiplier is exactly 0.80.
def test_degree_multiplier_non_stem() -> None:
    assert get_degree_multiplier("Non-STEM") == 0.80
    assert get_degree_multiplier("Business Administration") == 0.80


# Test 16: Asserts that pedagogical study hours adhere to Hours = round(Gap * 1.5 * mu_i).
def test_pedagogical_study_hours() -> None:
    # Gap 40 on critical (mu=1.00) -> 40 * 1.5 * 1.00 = 60 hours
    assert calculate_study_hours(40, "critical") == 60
    # Gap 40 on core (mu=0.75) -> 40 * 1.5 * 0.75 = 45 hours
    assert calculate_study_hours(40, "core") == 45
    # Gap 40 on supporting (mu=0.45) -> 40 * 1.5 * 0.45 = 27 hours
    assert calculate_study_hours(40, "supporting") == 27
    # Gap 0 -> 0 hours
    assert calculate_study_hours(0, "critical") == 0


# Test 17: Asserts that district labor balance computes Net = Demand - Supply and flags deficits correctly.
def test_district_balance_deficit_and_surplus() -> None:
    deficit_result = calculate_regional_deficit(demand_volume=300, supply_volume=120)
    assert deficit_result["net_balance"] == 180
    assert deficit_result["is_deficit"] is True
    assert deficit_result["urgency_label"] == "HIGH DEFICIT"

    surplus_result = calculate_regional_deficit(demand_volume=100, supply_volume=150)
    assert surplus_result["net_balance"] == -50
    assert surplus_result["is_deficit"] is False
    assert surplus_result["urgency_label"] == "SURPLUS"


# Test 18: Asserts that cohort aggregation averages ratings and computes curricular gaps accurately.
def test_cohort_heatmap_aggregation() -> None:
    cohort = [
        {"skills": {"Python": 80, "SQL": 60}},
        {"skills": {"Python": 70, "SQL": 80}},
    ]
    averages = aggregate_cohort_proficiencies(cohort)
    assert averages["Python"] == 75.0
    assert averages["SQL"] == 70.0

    benchmark = {"Python": 85.0, "SQL": 65.0}
    heatmap = calculate_departmental_heatmap(averages, benchmark)
    python_gap = next(item for item in heatmap if item["skill_name"] == "Python")
    sql_gap = next(item for item in heatmap if item["skill_name"] == "SQL")

    assert python_gap["curriculum_gap"] == 10.0
    assert python_gap["alignment_status"] == "AT RISK"
    assert sql_gap["curriculum_gap"] == 0.0
    assert sql_gap["alignment_status"] == "ALIGNED"


# Verification: Asserts that the calculation engine produces 100% identical numbers when run twice.
def test_deterministic_zero_randomness_run_twice() -> None:
    sample_role = {
        "skills": [
            {"name": "Python", "required_level": 80, "weight": 9.0, "requirement_category": "critical"},
            {"name": "SQL", "required_level": 75, "weight": 8.0, "requirement_category": "core"},
            {"name": "Docker", "required_level": 70, "weight": 6.0, "requirement_category": "supporting"},
        ]
    }
    student_ratings = {"python": 70, "sql": 80, "docker": 50}

    run_1 = calculate_final_readiness_score(student_ratings, sample_role, "Computer Science")
    run_2 = calculate_final_readiness_score(student_ratings, sample_role, "Computer Science")

    assert run_1["raw_score"] == run_2["raw_score"]
    assert run_1["critical_penalty"] == run_2["critical_penalty"]
    assert run_1["education_factor"] == run_2["education_factor"]
    assert run_1["final_score"] == run_2["final_score"]
    assert run_1["formula_breakdown"] == run_2["formula_breakdown"]


# Verification: Asserts alias lookup translates 'k8s' to canonical 'Kubernetes'.
def test_skill_alias_k8s_resolution() -> None:
    assert resolve_skill_alias("k8s") == "Kubernetes"
    assert resolve_skill_alias("py") == "Python"
