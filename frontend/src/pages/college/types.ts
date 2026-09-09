// FILE: src/pages/college/types.ts
// PURPOSE: Common TypeScript interfaces and types for College Portal sections and modals.
// PHASE: 8 | DEPENDS ON: src/api/client.ts | LAST TOUCHED: Phase 8

import type {
  InstitutionItem,
  InstitutionOverviewData,
  DepartmentHeatmapData,
  CourseAuditsData,
  CourseAuditData,
  PlacementEligibilityData,
} from "../../api/client";

export type {
  InstitutionItem,
  InstitutionOverviewData,
  DepartmentHeatmapData,
  CourseAuditsData,
  CourseAuditData,
  PlacementEligibilityData,
};

export interface FormulaModalSkill {
  skill_name: string;
  category: string;
  benchmark_level: number;
  cohort_average: number;
  curriculum_gap: number;
  alignment_status: string;
  formula_breakdown: string;
  student_count_evaluated: number;
}

export type MathModalTab = "gap" | "privacy" | "health" | "eligibility" | "flip";
export type PortalTab = "overview" | "heatmap" | "syllabus" | "placement";
export type HeatmapFilter = "ALL" | "DEFICIENT" | "AT RISK" | "ALIGNED";
export type CourseFilter = "ALL" | "OBSOLETE" | "AT RISK" | "ALIGNED";
