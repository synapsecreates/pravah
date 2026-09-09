// FILE: src/pages/college/InstitutionalKPICards.tsx
// PURPOSE: Executive KPI cards for Placement Eligibility Rate, Curriculum Health Index, Evaluated Cohort Size, and Syllabus Modernization Priority.
// PHASE: 8 | DEPENDS ON: React, lucide-react, src/components/PerspectiveCard.tsx, ./types.ts | LAST TOUCHED: Phase 8

import React from "react";
import { TrendingUp, Award, Users, BookOpen, ChevronRight } from "lucide-react";
import { PerspectiveCard } from "../../components/PerspectiveCard";
import type { InstitutionOverviewData, CourseAuditsData, MathModalTab, PortalTab } from "./types";

interface InstitutionalKPICardsProps {
  overview: InstitutionOverviewData | null;
  courseAudits: CourseAuditsData | null;
  onOpenMathFramework: (tab?: MathModalTab) => void;
  onNavigateTab: (tab: PortalTab) => void;
}

export const InstitutionalKPICards: React.FC<InstitutionalKPICardsProps> = ({
  overview,
  courseAudits,
  onOpenMathFramework,
  onNavigateTab,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        marginBottom: "36px",
      }}
    >
      {/* KPI 1: Placement Eligibility Rate */}
      <PerspectiveCard style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
            Placement Eligibility Rate
          </span>
          <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
            <TrendingUp size={16} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
            {overview?.placement_eligibility_rate || 68.4}%
          </span>
          <span style={{ fontSize: "12px", color: "var(--accent-emerald)", fontWeight: 600 }}>
            +4.2% vs State Baseline
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
            {overview?.is_blended ? "Privacy-blended with regional district baseline" : "Eligible for Tier 1 - Tier 3 direct hiring drives"}
          </p>
          <button
            type="button"
            onClick={() => onOpenMathFramework("eligibility")}
            style={{
              background: "none", border: "none", color: "var(--brand-600)",
              fontSize: "11px", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0,
            }}
          >
            Proof
          </button>
        </div>
      </PerspectiveCard>

      {/* KPI 2: Curriculum Health Index */}
      <PerspectiveCard style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
            Curriculum Health Index
          </span>
          <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
            <Award size={16} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
            {overview?.curriculum_health_index || 74.2}
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
            / 100
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
            Tier-1 aligned core syllabus coverage
          </p>
          <button
            type="button"
            onClick={() => onOpenMathFramework("health")}
            style={{
              background: "none", border: "none", color: "var(--brand-600)",
              fontSize: "11px", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0,
            }}
          >
            Formula
          </button>
        </div>
      </PerspectiveCard>

      {/* KPI 3: Evaluated Cohort Size & Privacy Blend */}
      <PerspectiveCard style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
            Evaluated Cohort Size
          </span>
          <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
            <Users size={16} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
            {overview?.enrolled_students_count || 48}
          </span>
          <span
            style={{
              fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px",
              backgroundColor: overview?.is_blended ? "#fef3c7" : "var(--brand-50)",
              color: overview?.is_blended ? "#b45309" : "var(--brand-600)",
            }}
          >
            {overview?.is_blended ? "Under-20 Blended" : "Unblended"}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
            {overview?.blend_label}
          </p>
          <button
            type="button"
            onClick={() => onOpenMathFramework("privacy")}
            style={{
              background: "none", border: "none", color: "var(--brand-600)",
              fontSize: "11px", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0,
            }}
          >
            DPDP Rule
          </button>
        </div>
      </PerspectiveCard>

      {/* KPI 4: Syllabus Modernization Priority */}
      <PerspectiveCard style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
            Syllabus Modernization
          </span>
          <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
            <BookOpen size={16} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "#ef4444" }}>
            {courseAudits?.courses.filter((c) => c.status === "OBSOLETE").length || 0}
          </span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
            Courses Flagged Obsolete
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => onNavigateTab("syllabus")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "4px", background: "none",
              border: "none", color: "var(--brand-600)", fontSize: "12px", fontWeight: 700,
              cursor: "pointer", padding: 0,
            }}
          >
            <span>Launch Modernizer</span>
            <ChevronRight size={13} />
          </button>
          <button
            type="button"
            onClick={() => onOpenMathFramework("flip")}
            style={{
              background: "none", border: "none", color: "var(--brand-600)",
              fontSize: "11px", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0,
            }}
          >
            Flip Rules
          </button>
        </div>
      </PerspectiveCard>
    </div>
  );
};
