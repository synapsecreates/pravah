// FILE: src/pages/analysis/BenchmarkSidebar.tsx
// PURPOSE: Right column sticky dock with active target benchmark, searchable 106-role switcher drawer, and strategic narrative brief.
// PHASE: 8 | DEPENDS ON: React, lucide-react, types/student.ts | LAST TOUCHED: Phase 8

import React, { useState } from "react";
import { ChevronUp, ChevronDown, Search, Sparkles } from "lucide-react";
import type { RoleMatchSummary, StudentProfileData } from "../../types/student";

interface BenchmarkSidebarProps {
  activeRole: RoleMatchSummary;
  studentProfile: StudentProfileData;
  readinessScore: number;
  criticalGapsSkillName?: string;
  roleSearchQuery: string;
  setRoleSearchQuery: (q: string) => void;
  selectedDomainFilter: string;
  setSelectedDomainFilter: (dom: string) => void;
  filteredTaxonomyRoles: any[];
  onSelectRole: (slug: string) => void;
}

export const BenchmarkSidebar: React.FC<BenchmarkSidebarProps> = ({
  activeRole,
  studentProfile,
  readinessScore,
  criticalGapsSkillName,
  roleSearchQuery,
  setRoleSearchQuery,
  selectedDomainFilter,
  setSelectedDomainFilter,
  filteredTaxonomyRoles,
  onSelectRole,
}) => {
  const [showOtherRoles, setShowOtherRoles] = useState<boolean>(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", minWidth: "320px" }}>
      {/* Target Role Benchmark Card */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "var(--shadow-elevation)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
              Target Role Benchmark
            </span>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
            {activeRole.title}
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0", lineHeight: "1.4" }}>
            {activeRole.primary_focus || activeRole.why_match_rationale}
          </p>
        </div>

        {/* Collapsible Switch Target Role Drawer */}
        <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
          <button
            type="button"
            onClick={() => setShowOtherRoles(!showOtherRoles)}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "10px",
              backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)",
              color: "var(--text-primary)", fontSize: "12px", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
            }}
          >
            <span>Switch Benchmark Target (106 National Roles)</span>
            {showOtherRoles ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showOtherRoles && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px", maxHeight: "440px", overflowY: "auto", paddingRight: "4px" }}>
              {/* Search Input */}
              <div style={{ position: "relative" }}>
                <Search size={14} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "10px" }} />
                <input
                  type="text"
                  placeholder="Search across 106 roles (e.g. MLOps, Cloud, Vision)..."
                  value={roleSearchQuery}
                  onChange={(e) => setRoleSearchQuery(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 10px 8px 30px", backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-strong)", borderRadius: "8px", fontSize: "11px", color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Domain Filter Pills */}
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {[
                  { key: "all", label: "All (106)" },
                  { key: "ai", label: "AI & ML" },
                  { key: "data", label: "Data" },
                  { key: "cloud", label: "Cloud" },
                  { key: "software", label: "Software" },
                  { key: "security", label: "Security" },
                  { key: "mobile", label: "Mobile" },
                ].map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setSelectedDomainFilter(d.key)}
                    style={{
                      padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 600, cursor: "pointer",
                      border: selectedDomainFilter === d.key ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                      backgroundColor: selectedDomainFilter === d.key ? "var(--brand-50)" : "var(--bg-sunken)",
                      color: selectedDomainFilter === d.key ? "var(--brand-600)" : "var(--text-secondary)",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* List of Filtered Roles */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {filteredTaxonomyRoles.slice(0, 30).map((role) => (
                  <div
                    key={role.slug}
                    onClick={() => onSelectRole(role.slug)}
                    style={{
                      padding: "10px 12px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)",
                      borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>{role.title}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{role.domain} · Demand: {role.industry_demand.toFixed(1)}/10</div>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--brand-600)", fontWeight: 700 }}>Select →</span>
                  </div>
                ))}
                {filteredTaxonomyRoles.length > 30 && (
                  <div style={{ textAlign: "center", fontSize: "10px", color: "var(--text-muted)", padding: "4px" }}>
                    Showing top 30 of {filteredTaxonomyRoles.length} matching roles. Refine search query for more.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Executive Strategic Narrative Brief */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "var(--shadow-elevation)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={16} color="var(--brand-600)" />
          <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
            Executive Strategic Brief
          </h4>
        </div>

        <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
          <strong style={{ color: "var(--text-primary)" }}>Placement Trajectory: </strong>
          {readinessScore >= 75
            ? `Candidate is in prime hiring tier for ${activeRole.title}. Verified core competencies exceed minimum threshold for direct placement shortlisting.`
            : `Candidate demonstrates strong foundations for ${activeRole.title} but possesses critical core deficits. Completing the 8-week roadmap will accelerate shortlisting probability.`}
        </div>

        <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)" }}>
          <strong style={{ color: "var(--success)" }}>Competitive Moats: </strong>
          Strong proficiency in {Object.keys(studentProfile.skills).slice(0, 2).join(" and ")} provides a defensible technical edge against peer applicants.
        </div>

        <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)" }}>
          <strong style={{ color: "var(--warning)" }}>High-Impact Quick Win: </strong>
          Upskilling in {criticalGapsSkillName || "Cloud Infrastructure"} provides the highest immediate score acceleration.
        </div>
      </div>
    </div>
  );
};
