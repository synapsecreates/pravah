// FILE: src/pages/analysis/RolesCatalogView.tsx
// PURPOSE: View 3 dedicated specialized 106-role national catalog browser with search, domain filtering, and switch target actions.
// PHASE: 8 | DEPENDS ON: React, lucide-react | LAST TOUCHED: Phase 8

import React from "react";
import { ArrowLeft, Search, ArrowRight } from "lucide-react";

interface RolesCatalogViewProps {
  roleSearchQuery: string;
  setRoleSearchQuery: (q: string) => void;
  selectedDomainFilter: string;
  setSelectedDomainFilter: (dom: string) => void;
  specializedRecommendations: any[];
  onBackToOverview: () => void;
  onSelectRole: (slug: string) => void;
}

export const RolesCatalogView: React.FC<RolesCatalogViewProps> = ({
  roleSearchQuery,
  setRoleSearchQuery,
  selectedDomainFilter,
  setSelectedDomainFilter,
  specializedRecommendations,
  onBackToOverview,
  onSelectRole,
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
              106-Role National Taxonomy
            </span>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
            Specialized Career Pathways & Adjacent Roles
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Discover niche, high-paying engineering roles that strongly align with your verified skill profile. Click &quot;Switch Benchmark&quot; to recalculate the entire terminal for any path.
          </p>
        </div>
      </div>

      {/* Search & Domain Filter Bar */}
      <div style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "14px", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "12px" }} />
          <input
            type="text"
            placeholder="Search across all 106 roles (e.g. MLOps, Security, Cloud, Computer Vision)..."
            value={roleSearchQuery}
            onChange={(e) => setRoleSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px 10px 38px", backgroundColor: "var(--bg-sunken)",
              border: "1px solid var(--border-strong)", borderRadius: "8px", fontSize: "13px", color: "var(--text-primary)",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {[
            { key: "all", label: "All Technical Domains (106)" },
            { key: "ai", label: "AI & Machine Learning" },
            { key: "data", label: "Data & Analytics" },
            { key: "cloud", label: "Cloud & DevOps" },
            { key: "software", label: "Software Engineering" },
            { key: "security", label: "Cybersecurity" },
            { key: "mobile", label: "Mobile & Embedded" },
          ].map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setSelectedDomainFilter(d.key)}
              style={{
                padding: "6px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer",
                border: selectedDomainFilter === d.key ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                backgroundColor: selectedDomainFilter === d.key ? "var(--brand-50)" : "var(--bg-sunken)",
                color: selectedDomainFilter === d.key ? "var(--brand-600)" : "var(--text-secondary)",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Specialized Role Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {specializedRecommendations.map((role) => (
          <div
            key={role.slug}
            style={{
              backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)",
              borderRadius: "14px", padding: "20px", boxShadow: "var(--shadow-elevation)",
              display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "10px", fontWeight: 700, textTransform: "uppercase", padding: "2px 8px",
                    borderRadius: "4px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)", border: "1px solid var(--brand-600)",
                  }}
                >
                  {role.domain}
                </span>
                <span
                  style={{
                    fontSize: "14px", fontWeight: 800, fontFamily: "monospace",
                    color: role.matchPct >= 65 ? "var(--success)" : "var(--brand-600)",
                  }}
                >
                  {role.matchPct}% Match
                </span>
              </div>

              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
                {role.title}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 12px 0", lineHeight: "1.45" }}>
                {role.primary_focus || role.description}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>Your Aligned Skills:</span>
                {role.alignedSkills.slice(0, 4).map((s: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--bg-sunken)",
                      border: "1px solid var(--border-subtle)", color: "var(--success)", fontWeight: 600,
                    }}
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                Market Demand: <strong>{role.industry_demand.toFixed(1)}/10</strong>
              </span>

              <button
                type="button"
                onClick={() => onSelectRole(role.slug)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "4px", padding: "7px 14px",
                  borderRadius: "8px", backgroundColor: "var(--brand-600)", color: "var(--bg-base)",
                  fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer",
                }}
              >
                <span>Switch Benchmark</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
