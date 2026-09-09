// FILE: src/pages/analysis/GatewayCards.tsx
// PURPOSE: Section 03 gateway navigator cards previewing Learning Action Plan and 106 Specialized Roles.
// PHASE: 8 | DEPENDS ON: React, lucide-react, types/student.ts | LAST TOUCHED: Phase 8

import React from "react";
import { Calendar, Compass, ArrowRight } from "lucide-react";
import type { GapAnalysisResult } from "../../types/student";

interface GatewayCardsProps {
  gapResult: GapAnalysisResult | null;
  totalRoadmapHours: number;
  specializedRecommendations: any[];
  onOpenRoadmap: () => void;
  onOpenSpecializations: () => void;
}

export const GatewayCards: React.FC<GatewayCardsProps> = ({
  gapResult,
  totalRoadmapHours,
  specializedRecommendations,
  onOpenRoadmap,
  onOpenSpecializations,
}) => {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
      {/* Gateway Card 1: Learning Action Plan */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "22px",
          boxShadow: "var(--shadow-elevation)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  backgroundColor: "var(--brand-50)", border: "1px solid var(--brand-600)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-600)",
                }}
              >
                <Calendar size={18} />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                Learning Action Plan
              </h3>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--danger)" }}>
              {gapResult?.critical_gaps.length || 0} critical deficits
            </span>
          </div>

          <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 14px 0", lineHeight: "1.5" }}>
            Structured 8-week remedial roadmap with curated lectures & capstone deliverables calibrated to bridge target deficits.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(gapResult?.critical_gaps.slice(0, 2) || []).map((gap, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px", backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{gap.skill_name}</span>
                <span style={{ color: "var(--danger)", fontWeight: 700, fontFamily: "monospace" }}>
                  Deficit -{gap.gap}%
                </span>
              </div>
            ))}
            {gapResult?.critical_gaps.length === 0 && (
              <div style={{ fontSize: "11px", color: "var(--success)", padding: "4px 0" }}>
                ✓ All required core competencies meet industry baseline!
              </div>
            )}
          </div>
        </div>

        <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Total Plan: <strong>~{totalRoadmapHours} hrs</strong>
          </span>
          <button
            type="button"
            onClick={onOpenRoadmap}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px",
              borderRadius: "8px", backgroundColor: "var(--brand-600)", color: "var(--bg-base)",
              fontWeight: 700, fontSize: "12px", border: "none", cursor: "pointer",
            }}
          >
            <span>Open Full Action Plan</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Gateway Card 2: Specialized Career Pathways */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "22px",
          boxShadow: "var(--shadow-elevation)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  backgroundColor: "var(--brand-50)", border: "1px solid var(--brand-600)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-600)",
                }}
              >
                <Compass size={18} />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                Specialized Roles & Pathways
              </h3>
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 14px 0", lineHeight: "1.5" }}>
            Discovered high-demand engineering careers from our national catalog matching your existing skill fingerprint.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {specializedRecommendations.slice(0, 2).map((role) => (
              <div
                key={role.slug}
                style={{
                  padding: "8px 12px", backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{role.title}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{role.domain}</div>
                </div>
                <span style={{ color: "var(--success)", fontWeight: 700, fontFamily: "monospace" }}>
                  {role.matchPct}% Match
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            6 High-Match Roles
          </span>
          <button
            type="button"
            onClick={onOpenSpecializations}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px",
              borderRadius: "8px", backgroundColor: "var(--brand-600)", color: "var(--bg-base)",
              fontWeight: 700, fontSize: "12px", border: "none", cursor: "pointer",
            }}
          >
            <span>Explore All 106 Roles</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
