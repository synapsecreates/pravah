# FILE: backend/app/engines/constants.py
# PURPOSE: Named mathematical constants for deterministic scoring, penalties, and multipliers.
# PHASE: 2 | DEPENDS ON: None | LAST TOUCHED: Phase 2

from typing import Dict

# 1. 4-Tier Semantic Category Weights (§5.2)
# Formula: mu_i where critical=1.00, core=0.75, supporting=0.45, complementary=0.20
CRITICAL_TIER_WEIGHT: float = 1.00
CORE_TIER_WEIGHT: float = 0.75
SUPPORTING_TIER_WEIGHT: float = 0.45
COMPLEMENTARY_TIER_WEIGHT: float = 0.20

TIER_WEIGHTS_MAP: Dict[str, float] = {
    "critical": CRITICAL_TIER_WEIGHT,
    "core": CORE_TIER_WEIGHT,
    "supporting": SUPPORTING_TIER_WEIGHT,
    "complementary": COMPLEMENTARY_TIER_WEIGHT,
}

# 2. Critical Deficiency Penalty Bounds (§5.3)
# Formula: P_crit = 0.75 + 0.25 * (critical_met / critical_total)
CRITICAL_PENALTY_BASE: float = 0.75
CRITICAL_PENALTY_SCALE: float = 0.25

# 3. Degree Discipline Multipliers (§5.4)
# Calibrated multipliers based on foundational academic engineering curriculum
DEGREE_MULTIPLIER_CS: float = 1.00
DEGREE_MULTIPLIER_IT: float = 0.95
DEGREE_MULTIPLIER_ECE: float = 0.90
DEGREE_MULTIPLIER_OTHER_STEM: float = 0.85
DEGREE_MULTIPLIER_NON_STEM: float = 0.80

DEGREE_MULTIPLIERS_MAP: Dict[str, float] = {
    "computer science": DEGREE_MULTIPLIER_CS,
    "cs": DEGREE_MULTIPLIER_CS,
    "computer science & engineering": DEGREE_MULTIPLIER_CS,
    "cse": DEGREE_MULTIPLIER_CS,
    "information technology": DEGREE_MULTIPLIER_IT,
    "it": DEGREE_MULTIPLIER_IT,
    "electronics and communication": DEGREE_MULTIPLIER_ECE,
    "ece": DEGREE_MULTIPLIER_ECE,
    "electronics & communication engineering": DEGREE_MULTIPLIER_ECE,
    "mechanical engineering": DEGREE_MULTIPLIER_OTHER_STEM,
    "civil engineering": DEGREE_MULTIPLIER_OTHER_STEM,
    "electrical engineering": DEGREE_MULTIPLIER_OTHER_STEM,
    "chemical engineering": DEGREE_MULTIPLIER_OTHER_STEM,
    "biotechnology": DEGREE_MULTIPLIER_OTHER_STEM,
    "other stem": DEGREE_MULTIPLIER_OTHER_STEM,
    "non-stem": DEGREE_MULTIPLIER_NON_STEM,
}

# 4. Pedagogical Study Hours Constant (§5.5)
# Formula: Hours = round(Gap * 1.5 * mu_i)
STUDY_HOURS_PER_GAP_POINT: float = 1.5
