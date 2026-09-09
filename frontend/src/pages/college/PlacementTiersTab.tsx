// FILE: src/pages/college/PlacementTiersTab.tsx
// PURPOSE: Placement eligibility & 4-tier recruitment breakdown with compensation percentiles.
// PHASE: 8 | DEPENDS ON: React, src/components/PerspectiveCard.tsx, ./types.ts | LAST TOUCHED: Phase 8

import React from "react";
import { PerspectiveCard } from "../../components/PerspectiveCard";
import type { PlacementEligibilityData } from "./types";

interface PlacementTiersTabProps {
  placementData: PlacementEligibilityData | null;
}

export const PlacementTiersTab: React.FC<PlacementTiersTabProps> = ({ placementData }) => {
  return (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
              Cohort Placement Eligibility &amp; Recruitment Tier Breakdown
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
              AICTE predictive employability classification mapped to industry hiring bands and compensation percentiles.
            </p>
          </div>

          {/* 4 Tiers Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "32px" }}>
            {placementData?.tier_distribution.map((tier) => (
              <PerspectiveCard key={tier.tier_name} style={{ padding: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    {tier.tier_name}
                  </span>
                  <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
                    {tier.percentage}%
                  </span>
                </div>

                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {tier.tier_label}
                </h3>

                <div style={{ marginBottom: "12px", fontSize: "13px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>CTC Band: </span>
                  <strong style={{ color: "var(--accent-emerald)" }}>{tier.expected_ctc_band}</strong>
                </div>

                <div style={{ marginBottom: "16px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <span style={{ display: "block", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Primary Recruiters:
                  </span>
                  <span>{tier.primary_recruiters}</span>
                </div>

                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-sunken)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Evaluated Candidates:</span>
                  <strong>{tier.candidate_count} students</strong>
                </div>
              </PerspectiveCard>
            ))}
          </div>

          {/* Top Placement Roles by Cohort Readiness */}
          <PerspectiveCard style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              Top Role Placement Readiness in Current Cohort
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {placementData?.top_placement_roles.map((r) => (
                <div
                  key={r.role}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "6px" }}>
                    {r.role}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
                    <span>
                      Batch Readiness: <strong style={{ color: "var(--text-primary)" }}>{r.readiness}</strong>
                    </span>
                    <span>
                      Market Demand: <strong style={{ color: "var(--brand-600)" }}>{r.demand}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </PerspectiveCard>
        </div>


  );
};
