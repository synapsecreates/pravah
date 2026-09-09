// FILE: src/pages/college/OverviewTab.tsx
// PURPOSE: Executive overview tab combining KPI cards, departmental deficit preview, and placement tier distribution snapshot.
// PHASE: 8 | DEPENDS ON: React, lucide-react, src/components/PerspectiveCard.tsx, ./types.ts, ./InstitutionalKPICards.tsx | LAST TOUCHED: Phase 8

import React from "react";
import { ChevronRight, Layers, GraduationCap } from "lucide-react";
import { PerspectiveCard } from "../../components/PerspectiveCard";
import type { InstitutionOverviewData, DepartmentHeatmapData, CourseAuditsData, PlacementEligibilityData, MathModalTab, PortalTab } from "./types";
import { InstitutionalKPICards } from "./InstitutionalKPICards";

interface OverviewTabProps {
  overview: InstitutionOverviewData | null;
  heatmap: DepartmentHeatmapData | null;
  courseAudits: CourseAuditsData | null;
  placementData: PlacementEligibilityData | null;
  onOpenMathFramework: (tab?: MathModalTab) => void;
  setActiveTab: (tab: PortalTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  overview,
  heatmap,
  courseAudits,
  placementData,
  onOpenMathFramework,
  setActiveTab,
}) => {
  return (
    <div>
      {/* 4 Executive KPI Cards */}
      <InstitutionalKPICards
        overview={overview}
        courseAudits={courseAudits}
        onOpenMathFramework={onOpenMathFramework}
        onNavigateTab={setActiveTab}
      />

      {/* Institutional Overview Dual Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "24px" }}>
        {/* Quick Competency Radar Snapshot */}
        <PerspectiveCard style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Departmental Competency Deficits
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                Largest syllabus skill gaps for <strong>{heatmap?.target_role || "Full Stack Developer"}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("heatmap")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px", background: "none",
                border: "none", color: "var(--brand-600)", fontSize: "13px", fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <span>View Full Heatmap</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {heatmap?.skills.slice(0, 4).map((s) => (
              <div
                key={s.skill_name}
                style={{
                  padding: "12px 16px", borderRadius: "10px", backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                      {s.skill_name}
                    </span>
                    <span
                      style={{
                        fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px",
                        backgroundColor: s.alignment_status === "DEFICIENT" ? "#fee2e2" : s.alignment_status === "AT RISK" ? "#fef3c7" : "#d1fae5",
                        color: s.alignment_status === "DEFICIENT" ? "#ef4444" : s.alignment_status === "AT RISK" ? "#b45309" : "#10b981",
                      }}
                    >
                      {s.alignment_status}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Cohort Avg: <strong>{s.cohort_average}%</strong> &bull; Benchmark Req: <strong>{s.benchmark_level}%</strong>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: s.curriculum_gap > 0 ? "#ef4444" : "#10b981" }}>
                    {s.curriculum_gap > 0 ? `-${s.curriculum_gap}%` : "Aligned"}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Curriculum Deficit (\(\Delta\))</div>
                </div>
              </div>
            ))}
          </div>
        </PerspectiveCard>

        {/* Quick Placement Tier Distribution Snapshot */}
        <PerspectiveCard style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Recruitment Tier Eligibility
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                Estimated candidate distribution across national salary bands
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("placement")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px", background: "none",
                border: "none", color: "var(--brand-600)", fontSize: "13px", fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <span>View Tier Breakdown</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {placementData?.tier_distribution.map((tier) => (
              <div
                key={tier.tier_name}
                style={{
                  padding: "12px 16px", borderRadius: "10px", backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                    {tier.tier_name}: {tier.tier_label}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Band: <strong>{tier.expected_ctc_band}</strong>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--brand-600)" }}>
                    {tier.percentage}%
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    {tier.candidate_count} candidates
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PerspectiveCard>
      </div>
    </div>
  );
};
