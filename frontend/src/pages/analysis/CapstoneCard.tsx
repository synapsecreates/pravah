// FILE: src/pages/analysis/CapstoneCard.tsx
// PURPOSE: Capstone project deliverable summary card with title, deliverables, and duration.
// PHASE: 8 | DEPENDS ON: React, lucide-react | LAST TOUCHED: Phase 8

import React from "react";
import { Award } from "lucide-react";

interface CapstoneCardProps {
  capstone: {
    title: string;
    deliverables: string;
    estimated_weeks: string;
  };
}

export const CapstoneCard: React.FC<CapstoneCardProps> = ({ capstone }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "var(--shadow-elevation)",
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
      }}
    >
      <Award size={26} color="var(--warning)" style={{ flexShrink: 0, marginTop: "2px" }} />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--brand-600)" }}>Capstone Deliverable</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Estimated Duration: {capstone.estimated_weeks}
          </span>
        </div>
        <h3 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
          {capstone.title}
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 10px 0", lineHeight: "1.5" }}>
          {capstone.deliverables}
        </p>
        <div style={{ fontSize: "12px", color: "var(--brand-600)", fontWeight: 600 }}>
          Build and publish to GitHub with comprehensive README to prove end-to-end competency to hiring committees.
        </div>
      </div>
    </div>
  );
};
