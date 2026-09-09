// FILE: src/pages/analysis/NationalStandingCard.tsx
// PURPOSE: Grounded Gaussian national placement standing card with circular gauge, CTC salary band, and statistical inspector.
// PHASE: 8 | DEPENDS ON: React, lucide-react | LAST TOUCHED: Phase 8

import React from "react";
import { Award } from "lucide-react";

interface NationalStandingCardProps {
  percentileStanding: number;
  zScore: number;
  placementTierInfo: {
    tier: string;
    color: string;
    salary: string;
    label: string;
  };
  onInspectProof: () => void;
}

export const NationalStandingCard: React.FC<NationalStandingCardProps> = ({
  percentileStanding,
  zScore,
  placementTierInfo,
  onInspectProof,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-sunken)",
        borderRadius: "12px",
        border: "1px solid var(--border-subtle)",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <h4 style={{ fontSize: "13px", fontWeight: 700, margin: 0, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Award size={15} color="var(--warning)" />
            <span>National Placement Standing & Salary Band</span>
          </h4>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "14px 0" }}>
          {/* Circular Gauge */}
          <div style={{ position: "relative", width: "92px", height: "92px", flexShrink: 0 }}>
            <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-strong)" strokeWidth="9" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={placementTierInfo.color}
                strokeWidth="9"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * Math.min(100, percentileStanding)) / 100}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "monospace",
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                {percentileStanding.toFixed(0)}%
              </span>
              <span style={{ fontSize: "8px", color: "var(--text-muted)", textTransform: "uppercase" }}>Percentile</span>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
            <div style={{ fontWeight: 700, color: placementTierInfo.color, fontSize: "13px" }}>
              {placementTierInfo.tier}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
              Target Hiring: {placementTierInfo.label}
            </div>
            <div style={{ fontSize: "11px", color: "var(--warning)", marginTop: "3px", fontWeight: 600 }}>
              Expected CTC Band: {placementTierInfo.salary}
            </div>
          </div>
        </div>
      </div>

      {/* Gaussian z-Score & Bell Curve Inspector */}
      <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>
          <span>Statistical Standing: <strong style={{ color: "var(--brand-600)", fontFamily: "monospace" }}>z = +{zScore.toFixed(2)}σ</strong></span>
          <button
            type="button"
            onClick={onInspectProof}
            style={{
              background: "none",
              border: "none",
              color: "var(--brand-600)",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            Inspect Statistical Proof →
          </button>
        </div>
        <div style={{ height: "7px", borderRadius: "6px", backgroundColor: "var(--border-strong)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${Math.min(99.8, percentileStanding)}%`,
              background: "var(--gradient-brand)",
              borderRadius: "6px",
            }}
          />
        </div>
      </div>
    </div>
  );
};
