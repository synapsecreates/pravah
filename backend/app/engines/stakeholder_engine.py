# FILE: backend/app/engines/stakeholder_engine.py
# PURPOSE: Pure mathematical aggregation functions for departmental heatmaps and regional labor balances.
# PHASE: 2 | DEPENDS ON: None | LAST TOUCHED: Phase 2

from typing import Dict, List


# Calculates the net regional labor balance between industry hiring demand and candidate supply.
# Formula: Net Balance = Demand Volume - Supply Volume. Positive indicates regional shortage/deficit.
def calculate_regional_deficit(demand_volume: int, supply_volume: int) -> dict:
    net_balance = int(demand_volume) - int(supply_volume)
    is_deficit = net_balance > 0
    urgency = "HIGH DEFICIT" if net_balance > 100 else ("MODERATE DEFICIT" if net_balance > 0 else "SURPLUS")

    return {
        "demand_volume": demand_volume,
        "supply_volume": supply_volume,
        "net_balance": net_balance,
        "is_deficit": is_deficit,
        "urgency_label": urgency,
        "formula_breakdown": f"Demand: {demand_volume} - Supply: {supply_volume} = Net: {net_balance} ({urgency})",
    }


# Aggregates student cohort proficiencies into departmental average skill vectors.
# Formula: Average_k = Sum(student_ratings_k) / N. Pure aggregation with zero division safety.
def aggregate_cohort_proficiencies(cohort_students: List[dict]) -> Dict[str, float]:
    if not cohort_students:
        return {}

    skill_sums: Dict[str, float] = {}
    skill_counts: Dict[str, int] = {}

    for student in cohort_students:
        skills = student.get("skills", {})
        for skill_name, rating in skills.items():
            skill_sums[skill_name] = skill_sums.get(skill_name, 0.0) + float(rating)
            skill_counts[skill_name] = skill_counts.get(skill_name, 0) + 1

    averages: Dict[str, float] = {}
    for skill_name, total in skill_sums.items():
        count = skill_counts[skill_name]
        averages[skill_name] = round(total / count, 2) if count > 0 else 0.0

    return averages


# Evaluates departmental curriculum deficit against industry benchmark requirements.
# Formula: Gap = max(0, Benchmark - Cohort Average). Pure calculation with no database dependency.
def calculate_departmental_heatmap(
    cohort_averages: Dict[str, float], benchmark_requirements: Dict[str, float]
) -> List[dict]:
    heatmap: List[dict] = []

    for skill_name, req_level in benchmark_requirements.items():
        cohort_avg = cohort_averages.get(skill_name, 0.0)
        gap = round(max(0.0, req_level - cohort_avg), 2)
        alignment_status = "ALIGNED" if gap <= 5.0 else ("AT RISK" if gap <= 25.0 else "DEFICIENT")

        heatmap.append(
            {
                "skill_name": skill_name,
                "benchmark_level": req_level,
                "cohort_average": cohort_avg,
                "curriculum_gap": gap,
                "alignment_status": alignment_status,
                "formula_breakdown": f"Benchmark: {req_level}% - Cohort Avg: {cohort_avg:.1f}% = Gap: {gap:.1f}%",
            }
        )

    # Sort by largest curricular gap first
    heatmap.sort(key=lambda x: -x["curriculum_gap"])
    return heatmap
