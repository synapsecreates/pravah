// FILE: src/types/student.ts
// PURPOSE: Strict TypeScript types for student profile, diagnostic metrics, 4-tier gaps, simulator, and learning roadmap.
// PHASE: 5 | DEPENDS ON: backend/app/models/schemas.py | LAST TOUCHED: Phase 5

export interface StudentProfileData {
  id?: string;
  user_id?: string;
  full_name: string;
  email?: string;
  institution_name: string;
  region: string;
  department: string;
  degree_field: string;
  current_year_of_study: number;
  graduation_year: number;
  career_intent: string;
  target_work_mobility: string;
  target_role_slug: string;
  skills: Record<string, number>;
  is_demo_account: boolean;
}

export interface InspectMathDetails {
  formula: string;
  capped_sum: number;
  required_sum: number;
  critical_skills_met: number;
  critical_skills_total: number;
  critical_penalty_factor: number;
  degree_multiplier: number;
}

export interface MatchCalculationResult {
  role_id: string;
  role_title: string;
  raw_match_score: number;
  critical_penalty: number;
  education_factor: number;
  final_readiness_score: number;
  inspect_math: InspectMathDetails;
}

export interface SkillGapItem {
  skill_id: string;
  skill_name: string;
  category: string;
  requirement_category: string;
  tier_category: "critical" | "core" | "supporting" | "strengths";
  required_level: number;
  student_level: number;
  gap: number;
  severity: number;
  tier_weight: number;
  role_importance: number;
}

export interface GapAnalysisResult {
  role_id: string;
  role_title: string;
  critical_gaps: SkillGapItem[];
  core_gaps: SkillGapItem[];
  supporting_gaps: SkillGapItem[];
  strengths: SkillGapItem[];
  total_gaps_count: number;
}

export interface WhatIfSimulateResult {
  role_id: string;
  target_skill: string;
  baseline_score: number;
  simulated_score: number;
  projected_gain: number;
  is_critical_skill: boolean;
}

export interface RoleMatchSummary {
  role_id: string;
  slug: string;
  title: string;
  domain: string;
  match_percentage: number;
  industry_demand: number;
  primary_focus: string;
  why_match_rationale: string;
}

export interface RoadmapMilestone {
  skill_id: string;
  skill_name: string;
  category: string;
  requirement_category: string;
  gap: number;
  priority_score: number;
  estimated_study_hours: number;
  pedagogical_formula: string;
  action_verb: string;
  recommended_topics: string[];
}

export interface CapstoneBrief {
  title: string;
  scenario: string;
  deliverables: string;
  estimated_weeks: string;
}

export interface RoadmapResult {
  role_id: string;
  role_title: string;
  total_estimated_hours: number;
  milestones: RoadmapMilestone[];
  capstone_project: CapstoneBrief;
}
