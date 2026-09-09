// FILE: src/pages/college/HeatmapTab.tsx
// PURPOSE: Departmental Competency Heatmap with category filters, deficit bars, and math proof modal triggers.
// PHASE: 8 | DEPENDS ON: React, lucide-react, src/components/PerspectiveCard.tsx, ./types.ts | LAST TOUCHED: Phase 8

import React from "react";
import { Calculator } from "lucide-react";
import { PerspectiveCard } from "../../components/PerspectiveCard";
import type { DepartmentHeatmapData, FormulaModalSkill, HeatmapFilter } from "./types";

interface HeatmapTabProps {
  heatmap: DepartmentHeatmapData | null;
  selectedTargetRole: string;
  setSelectedTargetRole: (role: string) => void;
  heatmapFilter: HeatmapFilter;
  setHeatmapFilter: (filter: HeatmapFilter) => void;
  filteredHeatmapSkills: DepartmentHeatmapData["skills"];
  onInspectProof: (skill: FormulaModalSkill) => void;
}

export const HeatmapTab: React.FC<HeatmapTabProps> = ({
  heatmap,
  selectedTargetRole,
  setSelectedTargetRole,
  heatmapFilter,
  setHeatmapFilter,
  filteredHeatmapSkills,
  onInspectProof,
}) => {
  return (
    <div>
      {/* Target Role & Heatmap Controls */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: "16px", flexWrap: "wrap", marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
            Departmental Competency Heatmap (C_avg vs R_s)
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            Auditing cohort proficiency averages against live industry benchmarks. Formula:{" "}
            <code>Curriculum Gap = max(0, R_industry - C_cohort)</code>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={selectedTargetRole}
            onChange={(e) => setSelectedTargetRole(e.target.value)}
            className="interactive-input"
            style={{
              padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border-strong)",
              backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", fontSize: "13px",
              fontWeight: 600, cursor: "pointer",
            }}
          >
            <option value="fullstack-developer">Target Benchmark: Full Stack Developer</option>
            <option value="ai-engineer">Target Benchmark: AI / Machine Learning Engineer</option>
            <option value="cloud-devops-engineer">Target Benchmark: Cloud &amp; DevOps Engineer</option>
            <option value="data-engineer">Target Benchmark: Data Platform Engineer</option>
          </select>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "6px" }}>
            {(["ALL", "DEFICIENT", "AT RISK", "ALIGNED"] as HeatmapFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setHeatmapFilter(f)}
                className="interactive-btn"
                style={{
                  padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 700,
                  backgroundColor: heatmapFilter === f ? "var(--brand-600)" : "var(--bg-surface)",
                  color: heatmapFilter === f ? "var(--bg-base)" : "var(--text-secondary)",
                  border: "1px solid var(--border-subtle)", cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Grid / Table */}
      <PerspectiveCard style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-sunken)", borderBottom: "1px solid var(--border-subtle)" }}>
                <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)" }}>Syllabus Competency Area</th>
                <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)" }}>Domain Pillar</th>
                <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)" }}>Industry Benchmark (R_s)</th>
                <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)" }}>Cohort Proficiency (C_avg)</th>
                <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)" }}>Curriculum Deficit (\(\Delta\))</th>
                <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)" }}>Alignment Status</th>
                <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>Mathematical Audit</th>
              </tr>
            </thead>
            <tbody>
              {filteredHeatmapSkills.map((s, idx) => (
                <tr
                  key={s.skill_name}
                  style={{
                    borderBottom: idx < filteredHeatmapSkills.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.01)",
                  }}
                >
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {s.skill_name}
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--text-secondary)" }}>
                    {s.category}
                  </td>
                  <td style={{ padding: "14px 20px", fontFamily: "monospace", fontWeight: 700, color: "var(--text-primary)" }}>
                    {s.benchmark_level}%
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--text-primary)", width: "35px" }}>
                        {s.cohort_average}%
                      </span>
                      <div style={{ flex: 1, height: "6px", backgroundColor: "var(--bg-sunken)", borderRadius: "3px", overflow: "hidden", minWidth: "60px", maxWidth: "100px" }}>
                        <div
                          style={{
                            height: "100%", width: `${s.cohort_average}%`,
                            backgroundColor: s.alignment_status === "DEFICIENT" ? "#ef4444" : s.alignment_status === "AT RISK" ? "#f59e0b" : "#10b981",
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontFamily: "monospace", fontWeight: 800,
                        color: s.curriculum_gap > 15 ? "#ef4444" : s.curriculum_gap > 0 ? "#f59e0b" : "#10b981",
                      }}
                    >
                      {s.curriculum_gap > 0 ? `-${s.curriculum_gap}%` : "0% (Met)"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px", fontWeight: 800, padding: "4px 8px", borderRadius: "6px",
                        backgroundColor: s.alignment_status === "DEFICIENT" ? "#fee2e2" : s.alignment_status === "AT RISK" ? "#fef3c7" : "#d1fae5",
                        color: s.alignment_status === "DEFICIENT" ? "#ef4444" : s.alignment_status === "AT RISK" ? "#b45309" : "#10b981",
                      }}
                    >
                      {s.alignment_status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => onInspectProof(s)}
                      className="interactive-btn"
                      style={{
                        padding: "5px 12px", borderRadius: "6px", border: "1px solid var(--border-strong)",
                        backgroundColor: "var(--bg-surface)", color: "var(--brand-600)", fontSize: "11px",
                        fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px",
                      }}
                    >
                      <Calculator size={13} />
                      <span>Inspect Proof</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PerspectiveCard>
    </div>
  );
};
