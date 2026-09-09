// FILE: src/pages/analysis/Roadmap.tsx
// PURPOSE: View 2 prioritized learning action plan with filter tabs, time estimation, and capstone project brief.
// PHASE: 8 | DEPENDS ON: React, lucide-react, ./CapstoneCard.tsx, types/student.ts | LAST TOUCHED: Phase 8

import React from "react";
import { ArrowLeft, Calculator, Calendar } from "lucide-react";
import { CapstoneCard } from "./CapstoneCard";
import type { GapAnalysisResult, SkillGapItem } from "../../types/student";

interface RoadmapProps {
  activeRoleTitle: string;
  gapResult: GapAnalysisResult | null;
  roadmapResult: any;
  gapFilter: "all" | "critical" | "core" | "supporting" | "strengths";
  setGapFilter: (f: "all" | "critical" | "core" | "supporting" | "strengths") => void;
  filteredGaps: SkillGapItem[];
  onBackToOverview: () => void;
  onInspectPriorityFormula: () => void;
  onViewTimeline: (skillName: string, estimatedHours: number, priorityTier: string) => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({
  activeRoleTitle,
  gapResult,
  roadmapResult,
  gapFilter,
  setGapFilter,
  filteredGaps,
  onBackToOverview,
  onInspectPriorityFormula,
  onViewTimeline,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "var(--shadow-elevation)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <button
              type="button"
              onClick={onBackToOverview}
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px", background: "none",
                border: "none", color: "var(--brand-600)", fontWeight: 700, fontSize: "12px", cursor: "pointer", padding: 0,
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Overview</span>
            </button>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
              Target Role: {activeRoleTitle}
            </span>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
            Prioritized Learning Action Plan & Curated Courseware
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Every deficit skill is mapped to an 8-week structured roadmap with curated free video lectures, allocated study hours, and capstone milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={onInspectPriorityFormula}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px",
            borderRadius: "8px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)",
            color: "var(--brand-600)", fontWeight: 700, fontSize: "12px", cursor: "pointer",
          }}
        >
          <Calculator size={14} />
          <span>Inspect Priority Formula</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[
          { key: "all", label: `All Gaps (${(gapResult?.critical_gaps.length || 0) + (gapResult?.core_gaps.length || 0) + (gapResult?.supporting_gaps.length || 0)})` },
          { key: "critical", label: `Critical Deficit (${gapResult?.critical_gaps.length || 0})` },
          { key: "core", label: `Core Competency (${gapResult?.core_gaps.length || 0})` },
          { key: "supporting", label: `Supporting (${gapResult?.supporting_gaps.length || 0})` },
          { key: "strengths", label: `Strengths Verified (${gapResult?.strengths.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setGapFilter(tab.key as any)}
            style={{
              padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              border: gapFilter === tab.key ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
              backgroundColor: gapFilter === tab.key ? "var(--brand-50)" : "var(--bg-surface)",
              color: gapFilter === tab.key ? "var(--brand-600)" : "var(--text-secondary)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Items List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredGaps.map((gap, idx) => {
          const tierLabel =
            gap.tier_category === "critical"
              ? "Critical Deficit"
              : gap.tier_category === "core"
              ? "Core Competency"
              : gap.tier_category === "supporting"
              ? "Supporting"
              : "Strengths Verified";

          return (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)",
                borderRadius: "14px", padding: "18px 22px", display: "flex", flexDirection: "column",
                gap: "12px", boxShadow: "var(--shadow-elevation)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {gap.skill_name}
                  </span>
                  <span
                    style={{
                      fontSize: "10px", fontWeight: 700, textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px",
                      backgroundColor: gap.tier_category === "critical" ? "var(--danger-bg)" : gap.tier_category === "core" ? "var(--warning-bg)" : "var(--brand-50)",
                      color: gap.tier_category === "critical" ? "var(--danger)" : gap.tier_category === "core" ? "var(--warning)" : "var(--brand-600)",
                      border: "1px solid currentColor",
                    }}
                  >
                    {tierLabel}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    Current: {gap.student_level}% / Benchmark: {gap.required_level}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onViewTimeline(gap.skill_name, Math.max(15, Math.round(gap.gap * 0.8)), tierLabel)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px",
                    borderRadius: "8px", backgroundColor: "var(--brand-50)", border: "1px solid var(--brand-600)",
                    color: "var(--brand-600)", fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  }}
                >
                  <Calendar size={14} />
                  <span>~{Math.max(15, Math.round(gap.gap * 0.8))} hrs Timeline & Video Lectures</span>
                </button>
              </div>

              <div>
                <div style={{ height: "7px", borderRadius: "4px", backgroundColor: "var(--border-strong)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%", width: `${Math.min(100, gap.student_level)}%`,
                      backgroundColor: gap.gap > 0 ? "var(--danger)" : "var(--success)", borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", paddingTop: "4px" }}>
                <span>{gap.gap > 0 ? `Calculated Deficit: -${gap.gap}%` : "Verified Strength · Target Satisfied"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Capstone Project Brief */}
      {roadmapResult?.capstone_project && (
        <CapstoneCard capstone={roadmapResult.capstone_project} />
      )}
    </div>
  );
};
