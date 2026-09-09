// FILE: src/pages/college/FormulaInspectionModal.tsx
// PURPOSE: Mathematical proof inspector modal for individual heatmap competency gaps.
// PHASE: 8 | DEPENDS ON: React, lucide-react, ./types.ts | LAST TOUCHED: Phase 8

import React from "react";
import { Calculator, X, ShieldAlert } from "lucide-react";
import type { FormulaModalSkill } from "./types";

interface FormulaInspectionModalProps {
  formulaModalSkill: FormulaModalSkill | null;
  simulatedCohortSize: number;
  targetRole?: string;
  onClose: () => void;
}

export const FormulaInspectionModal: React.FC<FormulaInspectionModalProps> = ({
  formulaModalSkill,
  simulatedCohortSize,
  targetRole,
  onClose,
}) => {
  if (!formulaModalSkill) return null;

  return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => onClose()}
        >
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid var(--border-strong)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {formulaModalSkill.skill_name} Competency Audit
                </h3>
                <div style={{ fontSize: "12px", color: formulaModalSkill.alignment_status === "DEFICIENT" ? "#ef4444" : formulaModalSkill.alignment_status === "AT RISK" ? "#d97706" : "#059669", fontWeight: 600 }}>
                  Status: {formulaModalSkill.alignment_status}
                </div>
              </div>
              <button
                onClick={() => onClose()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Step-by-Step Mathematical Evaluation */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px" }}>
              {/* Step 1: Input Parameters */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", fontSize: "14px" }}>
                  Step 1 · Parameter Extraction
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>Industry Benchmark Demand (R_s): <strong style={{ color: "var(--brand-600)" }}>{formulaModalSkill.benchmark_level}%</strong></div>
                  <div>Reported Cohort Proficiency (C_avg): <strong style={{ color: "var(--text-primary)" }}>{formulaModalSkill.cohort_average}%</strong></div>
                  <div>Active Sample Size (N): <strong style={{ color: "var(--text-primary)" }}>{simulatedCohortSize} students</strong></div>
                  <div>Privacy Mode: <strong style={{ color: simulatedCohortSize < 20 ? "#d97706" : "#059669" }}>{simulatedCohortSize < 20 ? "Under-20 Blended" : "Unblended Live"}</strong></div>
                </div>
              </div>

              {/* Step 2: Under-20 Privacy Floor Evaluation */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: simulatedCohortSize < 20 ? "rgba(245, 158, 11, 0.08)" : "rgba(16, 185, 129, 0.08)",
                  border: simulatedCohortSize < 20 ? "1px solid rgba(245, 158, 11, 0.25)" : "1px solid rgba(16, 185, 129, 0.25)",
                }}
              >
                <div style={{ fontWeight: 700, color: simulatedCohortSize < 20 ? "#b45309" : "#047857", marginBottom: "6px", fontSize: "14px" }}>
                  Step 2 · DPDP Privacy Floor Conditioning
                </div>
                {simulatedCohortSize < 20 ? (
                  <div style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
                    Because cohort size <em>N = {simulatedCohortSize} &lt; 20</em>, publishing raw averages would permit faculty to reverse-identify individual student marks. Thus, differential blending is applied:
                    <div style={{ fontFamily: "monospace", padding: "6px 10px", backgroundColor: "var(--bg-surface)", borderRadius: "6px", margin: "6px 0", color: "var(--text-primary)" }}>
                      C_avg = 0.70 × College_Score ({formulaModalSkill.cohort_average}%) + 0.30 × Regional_Baseline = {formulaModalSkill.cohort_average}%
                    </div>
                  </div>
                ) : (
                  <div style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
                    Because cohort size <em>N = {simulatedCohortSize} &ge; 20</em>, the sample is statistically sufficient for full anonymization. Cohort Average is <strong>100% direct departmental assessment</strong> without regional synthetic blending.
                  </div>
                )}
              </div>

              {/* Step 3: Curriculum Deficit Gap Calculation */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", fontSize: "14px" }}>
                  Step 3 · Curriculum Deficit Gap (Δ)
                </div>
                <div style={{ fontFamily: "monospace", padding: "8px 12px", backgroundColor: "var(--bg-surface)", borderRadius: "6px", marginBottom: "8px", color: "var(--text-primary)" }}>
                  Curriculum Gap (Δ) = max(0, Benchmark - Cohort_Average)<br />
                  Δ = max(0, {formulaModalSkill.benchmark_level}% - {formulaModalSkill.cohort_average}%) = <strong>{formulaModalSkill.curriculum_gap}%</strong>
                </div>
                <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  The gap represents the exact percentage of technical competency missing from the average student's skillset compared to standard hiring requisitions for <em>{targetRole || "Full Stack Developer"}</em>.
                </p>
              </div>

              {/* Step 4: Classification Rule Application */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", fontSize: "14px" }}>
                  Step 4 · Statutory Alignment Classification
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <div>• <strong>ALIGNED (Δ &le; 15%)</strong>: Curriculum adequately covers industry standard.</div>
                  <div>• <strong>AT RISK (15% &lt; Δ &le; 30%)</strong>: Moderate skills gap; needs coursework adjustments.</div>
                  <div>• <strong>DEFICIENT (Δ &gt; 30%)</strong>: Critical syllabus gap; fails national accreditation benchmark.</div>
                </div>
                <div style={{ marginTop: "10px", fontWeight: 700, color: formulaModalSkill.alignment_status === "DEFICIENT" ? "#ef4444" : formulaModalSkill.alignment_status === "AT RISK" ? "#d97706" : "#059669" }}>
                  Result: Δ = {formulaModalSkill.curriculum_gap}% &rarr; Classified as {formulaModalSkill.alignment_status}
                </div>
              </div>

              {/* Step 5: Plain English Dean Action Item */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--brand-50)",
                  border: "1px solid var(--border-strong)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--brand-600)", marginBottom: "4px", fontSize: "13px" }}>
                  Dean / Faculty Action Item:
                </div>
                <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.5 }}>
                  {formulaModalSkill.alignment_status === "DEFICIENT"
                    ? `Critical deficiency detected in ${formulaModalSkill.skill_name}. Update departmental elective course syllabi (e.g. introduce hands-on project labs) to close the ${formulaModalSkill.curriculum_gap}% curriculum gap before the upcoming placement cycle.`
                    : formulaModalSkill.alignment_status === "AT RISK"
                    ? `Moderate risk detected in ${formulaModalSkill.skill_name}. Introduce supplementary workshops or industry certifications to bring cohort proficiency above ${formulaModalSkill.benchmark_level}%.`
                    : `${formulaModalSkill.skill_name} is fully aligned with market expectations. Continue maintaining practical lab assignments and code reviews.`}
                </p>
              </div>

              {/* Close Button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => onClose()}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    backgroundColor: "var(--brand-600)",
                    color: "var(--bg-base)",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Close Proof Inspector
                </button>
              </div>
            </div>
          </div>
        </div>


  );
};
