# FILE: backend/app/engines/gap_analyzer.py
# PURPOSE: Pure mathematical engine for individual skill gap calculation and 4-tier categorization.
# PHASE: 2 | DEPENDS ON: constants.py, role_matcher.py | LAST TOUCHED: Phase 2

from typing import Dict, List
from app.engines.role_matcher import get_tier_multiplier


# Calculates mathematical gap between required benchmark level and student rating.
# Formula: Gap_i = max(0, required_level - student_level).
def calculate_skill_gap(student_level: float, required_level: float) -> int:
    s = max(0.0, min(100.0, float(student_level)))
    r = max(0.0, min(100.0, float(required_level)))
    return int(round(max(0.0, r - s)))


# Calculates weighted gap severity factor incorporating the requirement tier multiplier.
# Formula: Severity = (Gap / 100.0) * mu_i.
def calculate_gap_severity(gap: int, requirement_category: str) -> float:
    mu = get_tier_multiplier(requirement_category)
    return round((gap / 100.0) * mu, 4)


# Classifies skill into one of four visual dashboard tiers: critical, core, supporting, or strength.
# Zero gap indicates well-aligned strength; otherwise maps directly to requirement criticality.
def classify_gap_tier(gap: int, requirement_category: str) -> str:
    if gap == 0:
        return "strengths"
    cat = requirement_category.strip().lower()
    if cat == "critical":
        return "critical"
    if cat == "core":
        return "core"
    return "supporting"


# Generates complete deterministic gap matrix for all skills required by an occupational role.
# Pure function returning list of gap records with mathematical transparency strings.
def analyze_skill_gaps(student_skills: Dict[str, float], role_skills: List[dict]) -> List[dict]:
    normalized_student = {k.strip().lower(): float(v) for k, v in student_skills.items()}
    gaps: List[dict] = []

    for skill in role_skills:
        name = skill.get("name", "")
        slug = skill.get("skill_id", name).strip().lower()
        name_key = name.strip().lower()

        student_level = int(round(normalized_student.get(slug, normalized_student.get(name_key, 0.0))))
        required_level = int(round(float(skill.get("required_level", 70))))
        req_cat = skill.get("requirement_category", "core")

        gap = calculate_skill_gap(student_level, required_level)
        severity = calculate_gap_severity(gap, req_cat)
        tier = classify_gap_tier(gap, req_cat)

        breakdown = f"Required: {required_level}% - Current: {student_level}% = Gap: {gap}% (Tier: {req_cat})"

        gaps.append(
            {
                "skill_id": slug,
                "skill_name": name,
                "category": skill.get("category", "General"),
                "requirement_category": req_cat,
                "required_level": required_level,
                "student_level": student_level,
                "gap": gap,
                "gap_severity": severity,
                "tier": tier,
                "formula_breakdown": breakdown,
            }
        )

    return gaps
