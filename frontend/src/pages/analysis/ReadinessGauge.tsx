// FILE: src/pages/analysis/ReadinessGauge.tsx
// PURPOSE: Section 01 executive diagnostic metric cards displaying readiness score, pre-factor match, education multiplier, and critical gaps.
// PHASE: 8 | DEPENDS ON: React, lucide-react, types/student.ts | LAST TOUCHED: Phase 8

import React from "react";
import { Calculator, Sliders, GraduationCap, AlertTriangle } from "lucide-react";
import type { RoleMatchSummary, StudentProfileData } from "../../types/student";
import type { MatchCalculationResult } from "../../types/student";

interface ReadinessGaugeProps {
  activeRole: RoleMatchSummary;
  studentProfile: StudentProfileData;
  matchResult: MatchCalculationResult;
  rawScore: number;
  criticalGapsCount: number;
  onInspectProof: (type: "readiness" | "match", data: any) => void;
  onViewCriticalGaps: () => void;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  activeRole,
  studentProfile,
  matchResult,
  rawScore,
  criticalGapsCount,
  onInspectProof,
  onViewCriticalGaps,
}) => {
  const readinessScore = matchResult.final_readiness_score;
  const isHighReadiness = readinessScore >= 75;
  const isModerateReadiness = readinessScore >= 50 && readinessScore < 75;

  return (
    <section
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "var(--shadow-elevation)",
      }}
    >
      {/* Guide Banner */}
      <div style={{ marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid var(--border-subtle)" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
          Executive Diagnostic & Placement Metrics
        </h2>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
          <strong style={{ color: "var(--text-primary)" }}>What this shows: </strong>
          High-level placement readiness, direct skill alignment, degree multipliers, and critical deficits for{" "}
          <strong style={{ color: "var(--brand-600)" }}>{activeRole.title}</strong>.{" "}
          <strong style={{ color: "var(--brand-600)" }}>How to use it: </strong>
          Click on any card below to inspect its exact deterministic formula and arithmetic proof.
        </p>
      </div>

      {/* 4 Interactive Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
        {/* Card 1: Target Readiness */}
        <div
          onClick={() =>
            onInspectProof("readiness", {
              role_title: activeRole.title,
              readiness_score: matchResult.final_readiness_score,
              composite_match: rawScore,
              education_factor: matchResult.education_factor,
              degree_field: studentProfile.degree_field,
            })
          }
          style={{ backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "12px", padding: "16px", cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Target Readiness</span>
            <Calculator size={15} color="var(--brand-600)" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: isHighReadiness ? "var(--success)" : isModerateReadiness ? "var(--warning)" : "var(--danger)", fontFamily: "monospace" }}>
            {Math.round(readinessScore)}%
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            Targeted: {activeRole.title}
          </div>
          <div style={{ fontSize: "10px", color: "var(--brand-600)", marginTop: "6px", fontStyle: "italic" }}>
            Click to inspect proof →
          </div>
        </div>

        {/* Card 2: Pre-Factor Match */}
        <div
          onClick={() =>
            onInspectProof("match", {
              role_title: activeRole.title,
              final_score: matchResult.final_readiness_score,
              skill_match_score: rawScore,
              education_factor: matchResult.education_factor,
              formula_breakdown: "Composite = 0.60(Req) + 0.25(Pref) + 0.15(Exp)",
            })
          }
          style={{ backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "12px", padding: "16px", cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Pre-Factor Match</span>
            <Sliders size={15} color="#0284c7" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#0284c7", fontFamily: "monospace" }}>
            {Math.round(rawScore)}%
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            Direct raw skill alignment
          </div>
          <div style={{ fontSize: "10px", color: "var(--brand-600)", marginTop: "6px", fontStyle: "italic" }}>
            Click to inspect weights →
          </div>
        </div>

        {/* Card 3: Education Factor */}
        <div
          onClick={() =>
            onInspectProof("readiness", {
              role_title: activeRole.title,
              readiness_score: matchResult.final_readiness_score,
              composite_match: rawScore,
              education_factor: matchResult.education_factor,
              degree_field: studentProfile.degree_field,
            })
          }
          style={{ backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "12px", padding: "16px", cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Education Factor</span>
            <GraduationCap size={15} color="var(--warning)" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--warning)", fontFamily: "monospace" }}>
            ×{matchResult.education_factor.toFixed(2)}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            {studentProfile.degree_field} Multiplier
          </div>
          <div style={{ fontSize: "10px", color: "var(--brand-600)", marginTop: "6px", fontStyle: "italic" }}>
            Audited via AICTE standard →
          </div>
        </div>

        {/* Card 4: Critical Gaps */}
        <div
          onClick={onViewCriticalGaps}
          style={{ backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "12px", padding: "16px", cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Critical Gaps</span>
            <AlertTriangle size={15} color="var(--danger)" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--danger)", fontFamily: "monospace" }}>
            {criticalGapsCount}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            Deficits &gt; 40 percentage points
          </div>
          <div style={{ fontSize: "10px", color: "var(--brand-600)", marginTop: "6px", fontStyle: "italic" }}>
            View in Action Plan →
          </div>
        </div>
      </div>
    </section>
  );
};
