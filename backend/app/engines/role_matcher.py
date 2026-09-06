# FILE: backend/app/engines/role_matcher.py
# PURPOSE: Pure mathematical engine for continuous role matching, capping, and readiness scoring.
# PHASE: 2 | DEPENDS ON: constants.py | LAST TOUCHED: Phase 2

from typing import Dict, List, Tuple
from app.engines.constants import (
    CRITICAL_PENALTY_BASE,
    CRITICAL_PENALTY_SCALE,
    DEGREE_MULTIPLIERS_MAP,
    DEGREE_MULTIPLIER_NON_STEM,
    TIER_WEIGHTS_MAP,
)


# Caps student proficiency at the role's required benchmark level.
# Formula: capped_s_i = min(student_level, required_level)
def cap_proficiency(student_level: float, required_level: float) -> float:
    clamped_student = max(0.0, min(100.0, float(student_level)))
    clamped_required = max(0.0, min(100.0, float(required_level)))
    return min(clamped_student, clamped_required)


# Returns the 4-tier requirement category weight multiplier (mu_i).
# Maps 'critical' -> 1.00, 'core' -> 0.75, 'supporting' -> 0.45, 'complementary' -> 0.20.
def get_tier_multiplier(requirement_category: str) -> float:
    key = str(requirement_category).strip().lower()
    return TIER_WEIGHTS_MAP.get(key, 0.75)


# Resolves the academic degree discipline multiplier (0.80x to 1.00x).
# Maps STEM fields (CS=1.00, IT=0.95, ECE=0.90, Other=0.85) down to non-STEM=0.80.
def get_degree_multiplier(degree_field: str) -> float:
    key = str(degree_field).strip().lower()
    return DEGREE_MULTIPLIERS_MAP.get(key, DEGREE_MULTIPLIER_NON_STEM)


# Calculates weighted raw fulfillment score across all role requirements.
# Formula: Sum(capped_s_i * w_i * mu_i) / Sum(r_i * w_i * mu_i) * 100 with zero-division safety.
def calculate_raw_match_score(
    student_skills: Dict[str, float], role_skills: List[dict]
) -> Tuple[float, float, float]:
    total_capped_weighted = 0.0
    total_required_weighted = 0.0

    # Case-insensitive mapping for student ratings
    normalized_student = {k.strip().lower(): float(v) for k, v in student_skills.items()}

    for skill in role_skills:
        name = skill.get("name", "")
        slug = skill.get("skill_id", name).strip().lower()
        name_key = name.strip().lower()

        # Find matching rating by slug or name
        student_level = normalized_student.get(slug, normalized_student.get(name_key, 0.0))
        required_level = float(skill.get("required_level", 70))
        weight = float(skill.get("weight", 7.0))
        req_cat = skill.get("requirement_category", "core")
        mu = get_tier_multiplier(req_cat)

        capped_level = cap_proficiency(student_level, required_level)
        total_capped_weighted += capped_level * weight * mu
        total_required_weighted += required_level * weight * mu

    # Zero-division protection (§8.1)
    if total_required_weighted == 0.0:
        return 0.0, 0.0, 0.0

    raw_score = (total_capped_weighted / total_required_weighted) * 100.0
    return round(min(100.0, max(0.0, raw_score)), 2), total_capped_weighted, total_required_weighted


# Calculates critical deficiency penalty factor based on prerequisite fulfillment.
# Formula: P_crit = 0.75 + 0.25 * (critical_met / critical_total). Returns 1.0 if no critical skills.
def calculate_critical_penalty(
    student_skills: Dict[str, float], role_skills: List[dict]
) -> Tuple[float, int, int]:
    normalized_student = {k.strip().lower(): float(v) for k, v in student_skills.items()}
    critical_skills = [
        s for s in role_skills if s.get("requirement_category", "").strip().lower() == "critical"
    ]

    total_critical = len(critical_skills)
    if total_critical == 0:
        return 1.0, 0, 0

    met_critical = 0
    for skill in critical_skills:
        name = skill.get("name", "")
        slug = skill.get("skill_id", name).strip().lower()
        name_key = name.strip().lower()
        student_level = normalized_student.get(slug, normalized_student.get(name_key, 0.0))
        required_level = float(skill.get("required_level", 70))

        if student_level >= required_level:
            met_critical += 1

    ratio = met_critical / total_critical
    penalty = CRITICAL_PENALTY_BASE + (CRITICAL_PENALTY_SCALE * ratio)
    return round(min(1.0, max(0.75, penalty)), 4), met_critical, total_critical


# Computes final deterministic readiness score combining raw fulfillment, penalty, and discipline factor.
# Formula: Score_final = round(Score_raw * P_crit * M_edu, 2). Pure function with zero randomness.
def calculate_final_readiness_score(
    student_skills: Dict[str, float], role: dict, degree_field: str = "Computer Science"
) -> dict:
    role_skills = role.get("skills", [])
    raw_score, total_capped, total_req = calculate_raw_match_score(student_skills, role_skills)
    penalty, crit_met, crit_total = calculate_critical_penalty(student_skills, role_skills)
    edu_factor = get_degree_multiplier(degree_field)

    final_score = round(raw_score * penalty * edu_factor, 2)
    final_score = min(100.0, max(0.0, final_score))

    breakdown = (
        f"Raw: {raw_score:.2f}% x Critical Penalty: {penalty:.2f} "
        f"({crit_met}/{crit_total} met) x Degree Factor: {edu_factor:.2f} = {final_score:.2f}%"
    )

    return {
        "raw_score": raw_score,
        "critical_penalty": penalty,
        "critical_met": crit_met,
        "critical_total": crit_total,
        "education_factor": edu_factor,
        "final_score": final_score,
        "total_capped_weighted": round(total_capped, 2),
        "total_required_weighted": round(total_req, 2),
        "formula_breakdown": breakdown,
    }
