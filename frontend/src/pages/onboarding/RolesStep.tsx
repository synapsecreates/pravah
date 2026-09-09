// FILE: src/pages/onboarding/RolesStep.tsx
// PURPOSE: Step 3 predicted national occupational roles, cosine match scores, industry demand, and dashboard entry CTA.
// PHASE: 8 | DEPENDS ON: React, motion/react, lucide-react, types/student.ts | LAST TOUCHED: Phase 8

import React from "react";
import { motion } from "motion/react";
import { AlertCircle, ArrowRight } from "lucide-react";
import type { RoleMatchSummary } from "../../types/student";

interface RolesStepProps {
  isPredictingRoles: boolean;
  predictionError: string | null;
  predictedRoles: RoleMatchSummary[];
  selectedRoleSlug: string;
  setSelectedRoleSlug: (slug: string) => void;
  skillsCount: number;
  onPrev: () => void;
  onFinalSubmit: () => void;
}

export const RolesStep: React.FC<RolesStepProps> = ({
  isPredictingRoles,
  predictionError,
  predictedRoles,
  selectedRoleSlug,
  setSelectedRoleSlug,
  skillsCount,
  onPrev,
  onFinalSubmit,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
          National Role Affinities &amp; Readiness Standing
        </h2>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
          Ranked by deterministic cosine similarity against NOS-2015 benchmarks with critical skill penalty floors.
        </p>
      </div>

      {isPredictingRoles ? (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid var(--border-strong)",
              borderTopColor: "var(--brand-600)",
              borderRadius: "50%",
              margin: "0 auto 16px auto",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
            Analyzing {skillsCount} competencies against National Occupational Roles...
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Calibrating critical skill penalties, domain weights, and degree alignment floors.
          </p>
        </div>
      ) : predictionError ? (
        <div
          style={{
            padding: "24px",
            borderRadius: "12px",
            backgroundColor: "var(--bg-sunken)",
            border: "1px solid var(--danger)",
            textAlign: "center",
          }}
        >
          <AlertCircle size={28} color="var(--danger)" style={{ margin: "0 auto 10px auto" }} />
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
            {predictionError}
          </p>
          <button
            type="button"
            onClick={onPrev}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              backgroundColor: "var(--brand-600)",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Modify Skills
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {predictedRoles.map((role, idx) => {
            const isSelected = role.slug === selectedRoleSlug;
            const matchColor =
              role.match_percentage >= 75
                ? "var(--success)"
                : role.match_percentage >= 50
                ? "var(--brand-600)"
                : "var(--warning)";

            return (
              <motion.div
                key={role.slug}
                onClick={() => setSelectedRoleSlug(role.slug)}
                whileHover={{ y: -3, rotateX: 1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="interactive-btn"
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: isSelected ? "var(--brand-50)" : "var(--bg-sunken)",
                  border: isSelected ? "2px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  boxShadow: isSelected ? "0 4px 14px rgba(96, 165, 250, 0.2)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        width: "22px",
                        height: "22px",
                        borderRadius: "6px",
                        backgroundColor: "var(--bg-base)",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>
                      {role.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 900,
                      color: matchColor,
                      fontFamily: "monospace",
                    }}
                  >
                    {role.match_percentage.toFixed(0)}%
                  </span>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(96, 165, 250, 0.15)",
                      color: "var(--brand-600)",
                    }}
                  >
                    {role.domain}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: "6px",
                      backgroundColor: "var(--bg-base)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Demand: {role.industry_demand}/10
                  </span>
                </div>

                <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  {role.why_match_rationale}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ACTION FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <button
          type="button"
          onClick={onPrev}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-strong)",
            color: "var(--text-primary)",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Edit Skills
        </button>

        <motion.button
          type="button"
          onClick={onFinalSubmit}
          whileHover={{ y: -3, rotateX: 1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.16 }}
          className="interactive-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 28px",
            borderRadius: "10px",
            backgroundColor: "var(--brand-600)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 800,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(96, 165, 250, 0.35)",
          }}
        >
          <span>Complete Onboarding &amp; Enter Dashboard</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};
