# FILE: backend/app/engines/priority_engine.py
# PURPOSE: Pure mathematical engine for learning priority sorting and study hours calculation.
# PHASE: 2 | DEPENDS ON: constants.py, role_matcher.py | LAST TOUCHED: Phase 2

from typing import List
from app.engines.constants import STUDY_HOURS_PER_GAP_POINT
from app.engines.role_matcher import get_tier_multiplier


# Calculates estimated pedagogical study hours required to close a competency gap.
# Formula: Hours = round(Gap * 1.5 * mu_i). Pure function with zero randomness.
def calculate_study_hours(gap: int, requirement_category: str) -> int:
    if gap <= 0:
        return 0
    mu = get_tier_multiplier(requirement_category)
    return int(round(gap * STUDY_HOURS_PER_GAP_POINT * mu))


# Calculates multi-criteria priority index combining gap, requirement tier, role importance, and market demand.
# Formula: Priority = (Gap / 100) * mu_i * (Importance / 10) * (Demand / 10) * 10.
def calculate_priority_index(
    gap: int, requirement_category: str, role_importance: float = 8.0, industry_demand: float = 8.0
) -> float:
    if gap <= 0:
        return 0.0
    mu = get_tier_multiplier(requirement_category)
    imp_factor = max(1.0, min(10.0, float(role_importance))) / 10.0
    demand_factor = max(1.0, min(10.0, float(industry_demand))) / 10.0
    gap_ratio = gap / 100.0

    priority = gap_ratio * mu * imp_factor * demand_factor * 10.0
    return round(priority, 4)


# Computes prioritized action roadmap items for all detected skill gaps.
# Sorts recommendations deterministically in descending order of calculated priority score.
def prioritize_remediation_actions(gaps: List[dict], role_industry_demand: float = 8.0) -> List[dict]:
    actions: List[dict] = []

    for item in gaps:
        gap = int(item.get("gap", 0))
        if gap <= 0:
            continue

        req_cat = item.get("requirement_category", "core")
        role_imp = float(item.get("role_importance", 8.0))
        priority = calculate_priority_index(gap, req_cat, role_imp, role_industry_demand)
        hours = calculate_study_hours(gap, req_cat)

        actions.append(
            {
                "skill_id": item["skill_id"],
                "skill_name": item["skill_name"],
                "category": item.get("category", "General"),
                "requirement_category": req_cat,
                "gap": gap,
                "priority_score": priority,
                "estimated_study_hours": hours,
                "pedagogical_formula": f"round(Gap: {gap} x 1.5 x Weight: {get_tier_multiplier(req_cat):.2f}) = {hours}h",
            }
        )

    # Deterministic sort: highest priority first; break ties by larger gap then alphabetical skill name
    actions.sort(key=lambda x: (-x["priority_score"], -x["gap"], x["skill_name"]))
    return actions
