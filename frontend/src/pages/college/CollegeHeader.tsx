// FILE: src/pages/college/CollegeHeader.tsx
// PURPOSE: Executive institutional header, selectors, notification toast, callouts, and portal tabs navigation.
// PHASE: 8 | DEPENDS ON: React, lucide-react, ./types.ts, ./constants.ts, ./CollegeCalloutBanners.tsx | LAST TOUCHED: Phase 8

import React from "react";
import { School, Sparkles, X, Calculator } from "lucide-react";
import type { InstitutionItem, InstitutionOverviewData, CourseAuditsData, PortalTab, MathModalTab } from "./types";
import { PORTAL_TABS } from "./constants";
import { CollegeCalloutBanners } from "./CollegeCalloutBanners";

interface CollegeHeaderProps {
  overview: InstitutionOverviewData | null;
  institutions: InstitutionItem[];
  selectedInstId: string;
  setSelectedInstId: (id: string) => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  updateNotification: string | null;
  setUpdateNotification: (msg: string | null) => void;
  simulatedCohortSize: number;
  onOpenMathFramework: (tab?: MathModalTab) => void;
  onToggleCohortSize: () => void;
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  courseAudits: CourseAuditsData | null;
}

export const CollegeHeader: React.FC<CollegeHeaderProps> = ({
  overview,
  institutions,
  selectedInstId,
  setSelectedInstId,
  selectedDept,
  setSelectedDept,
  updateNotification,
  setUpdateNotification,
  simulatedCohortSize,
  onOpenMathFramework,
  onToggleCohortSize,
  activeTab,
  setActiveTab,
  courseAudits,
}) => {
  return (
    <>
      {/* Toast Notification */}
      {updateNotification && (
        <div
          style={{
            position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
            backgroundColor: "var(--brand-600)", color: "var(--bg-base)",
            padding: "16px 22px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", fontWeight: 600,
            maxWidth: "520px",
          }}
        >
          <Sparkles size={20} />
          <span>{updateNotification}</span>
          <button
            type="button"
            onClick={() => setUpdateNotification(null)}
            style={{ background: "transparent", border: "none", color: "var(--bg-base)", cursor: "pointer", marginLeft: "auto" }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Header & Institution Selector */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          gap: "20px", flexWrap: "wrap", marginBottom: "20px", paddingBottom: "18px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--brand-600)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <School size={14} />
              Institutional Intelligence
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              AISHE Code: <strong style={{ color: "var(--text-primary)" }}>{overview?.aishe_code || "C-49339"}</strong>
            </span>
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            {overview?.name || "Institution Intelligence Portal"}
          </h1>
          <p style={{ margin: "6px 0 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
            Institutional cohort competency audits, syllabus modernization tracker, and predictive recruitment tier analytics.
          </p>
        </div>

        {/* Institution, Department, and Global Math Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px", textTransform: "uppercase" }}>
              Selected Institution:
            </label>
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              style={{
                padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-strong)",
                backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", fontSize: "13px",
                fontWeight: 600, cursor: "pointer", maxWidth: "260px",
              }}
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.district_id}, {inst.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px", textTransform: "uppercase" }}>
              Department:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-strong)",
                backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", fontSize: "13px",
                fontWeight: 600, cursor: "pointer",
              }}
            >
              <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics &amp; Communication</option>
              <option value="AI & Data Science">AI &amp; Data Science</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", height: "100%", alignSelf: "flex-end" }}>
            <button
              type="button"
              onClick={() => onOpenMathFramework("gap")}
              className="interactive-btn"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px",
                borderRadius: "8px", backgroundColor: "var(--brand-600)", color: "var(--bg-base)",
                border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                boxShadow: "var(--shadow-hover)",
              }}
            >
              <Calculator size={15} />
              <span>Scoring Math &amp; Proofs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Callout Banners */}
      <CollegeCalloutBanners
        simulatedCohortSize={simulatedCohortSize}
        onOpenMathFramework={onOpenMathFramework}
        onToggleCohortSize={onToggleCohortSize}
      />

      {/* Section Navigation Tabs */}
      <div
        style={{
          display: "flex", gap: "8px", borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "12px", marginBottom: "24px", overflowX: "auto",
        }}
      >
        {PORTAL_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badge = tab.id === "syllabus" ? courseAudits?.courses.filter((c) => c.status === "OBSOLETE").length : undefined;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="interactive-btn"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px",
                borderRadius: "10px", fontSize: "13px", fontWeight: isActive ? 700 : 600,
                backgroundColor: isActive ? "var(--brand-600)" : "var(--bg-surface)",
                color: isActive ? "var(--bg-base)" : "var(--text-secondary)",
                border: isActive ? "none" : "1px solid var(--border-subtle)",
                cursor: "pointer", transition: "all 0.15s ease", flexShrink: 0,
                boxShadow: isActive ? "var(--shadow-hover)" : "none",
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {badge !== undefined && badge > 0 && (
                <span
                  style={{
                    backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "#fee2e2",
                    color: isActive ? "#fff" : "#ef4444",
                    fontSize: "11px", fontWeight: 800, padding: "1px 6px", borderRadius: "10px",
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
