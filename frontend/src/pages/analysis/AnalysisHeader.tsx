// FILE: src/pages/analysis/AnalysisHeader.tsx
// PURPOSE: Executive command header with candidate bio, export actions, and sub-page navigation tabs.
// PHASE: 8 | DEPENDS ON: React, lucide-react, types/student.ts | LAST TOUCHED: Phase 8

import React from "react";
import { ShieldCheck, Globe, Calculator, Download, ArrowLeft, LayoutDashboard, Calendar, Compass, Cpu } from "lucide-react";
import type { RoleMatchSummary, StudentProfileData } from "../../types/student";

interface AnalysisHeaderProps {
  studentProfile: StudentProfileData;
  activeRole: RoleMatchSummary;
  activePortalTab: "overview" | "roadmap" | "specializations" | "parser";
  setActivePortalTab: (tab: "overview" | "roadmap" | "specializations" | "parser") => void;
  roadmapGapsCount: number;
  onOpenMathProof: () => void;
  onExportSummary: () => void;
  onBackToOnboarding: () => void;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  studentProfile,
  activeRole,
  activePortalTab,
  setActivePortalTab,
  roadmapGapsCount,
  onOpenMathProof,
  onExportSummary,
  onBackToOnboarding,
}) => {
  return (
    <header
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: "16px",
        padding: "20px 24px",
        marginBottom: "24px",
        boxShadow: "var(--shadow-elevation)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        {/* Candidate Bio & Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: "var(--brand-50)",
              border: "2px solid var(--brand-600)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--brand-600)",
              fontWeight: 800,
              fontSize: "20px",
              fontFamily: "monospace",
            }}
          >
            DS
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                {studentProfile.full_name}
              </h1>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: "var(--success)" }}>
                <ShieldCheck size={14} />
                Verified
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px", fontSize: "12px", color: "var(--text-muted)", flexWrap: "wrap" }}>
              <span>{studentProfile.degree_field}</span>
              <span>•</span>
              <span>Pre-final Year (Sem VI)</span>
              <span>•</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--brand-600)" }}>
                <Globe size={12} />
                Pan-India Placement Open
              </span>
            </div>
          </div>
        </div>

        {/* Quick Header Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={onOpenMathProof}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-strong)",
              backgroundColor: "var(--bg-sunken)",
              color: "var(--brand-600)",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Calculator size={14} />
            <span>Inspect Math Proof</span>
          </button>

          <button
            type="button"
            onClick={onExportSummary}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-strong)",
              backgroundColor: "var(--bg-sunken)",
              color: "var(--text-primary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={14} />
            <span>Export PDF Brief</span>
          </button>

          <button
            type="button"
            onClick={onBackToOnboarding}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Modular Sub-Page Navigation Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setActivePortalTab("overview")}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            border: activePortalTab === "overview" ? "1px solid var(--brand-600)" : "1px solid transparent",
            backgroundColor: activePortalTab === "overview" ? "var(--brand-50)" : "transparent",
            color: activePortalTab === "overview" ? "var(--brand-600)" : "var(--text-secondary)",
          }}
        >
          <LayoutDashboard size={16} />
          <span>Executive Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePortalTab("roadmap")}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            border: activePortalTab === "roadmap" ? "1px solid var(--brand-600)" : "1px solid transparent",
            backgroundColor: activePortalTab === "roadmap" ? "var(--brand-50)" : "transparent",
            color: activePortalTab === "roadmap" ? "var(--brand-600)" : "var(--text-secondary)",
          }}
        >
          <Calendar size={16} />
          <span>Learning Action Plan & Courseware</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>({roadmapGapsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePortalTab("specializations")}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            border: activePortalTab === "specializations" ? "1px solid var(--brand-600)" : "1px solid transparent",
            backgroundColor: activePortalTab === "specializations" ? "var(--brand-50)" : "transparent",
            color: activePortalTab === "specializations" ? "var(--brand-600)" : "var(--text-secondary)",
          }}
        >
          <Compass size={16} />
          <span>Specialized Roles & Pathways</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>(106)</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePortalTab("parser")}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            border: activePortalTab === "parser" ? "1px solid var(--brand-600)" : "1px solid transparent",
            backgroundColor: activePortalTab === "parser" ? "var(--brand-50)" : "transparent",
            color: activePortalTab === "parser" ? "var(--brand-600)" : "var(--text-secondary)",
          }}
        >
          <Cpu size={16} />
          <span>Job Description Matcher</span>
        </button>
      </div>
    </header>
  );
};
