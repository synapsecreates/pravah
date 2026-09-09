// FILE: src/pages/college/MathFrameworkModal.tsx
// PURPOSE: Master institutional mathematical scoring framework modal dialog and tab navigation.
// PHASE: 8 | DEPENDS ON: React, lucide-react, ./types.ts, ./MathFrameworkTabContent.tsx | LAST TOUCHED: Phase 8

import React from "react";
import { Calculator, X } from "lucide-react";
import type { MathModalTab } from "./types";
import { MathFrameworkTabContent } from "./MathFrameworkTabContent";

interface MathFrameworkModalProps {
  showMathFrameworkModal: boolean;
  mathModalActiveTab: MathModalTab;
  setMathModalActiveTab: (tab: MathModalTab) => void;
  onClose: () => void;
}

export const MathFrameworkModal: React.FC<MathFrameworkModalProps> = ({
  showMathFrameworkModal,
  mathModalActiveTab,
  setMathModalActiveTab,
  onClose,
}) => {
  if (!showMathFrameworkModal) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)", zIndex: 10000, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--bg-surface)", borderRadius: "16px", padding: "30px",
          maxWidth: "840px", width: "100%", maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)", border: "1px solid var(--border-strong)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Calculator size={18} color="var(--brand-600)" />
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--brand-600)" }}>
                Institutional Intelligence Engine
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>
              Mathematical Scoring Framework &amp; Auditing Methodology
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
              Open, audited formulas governing competency deficits, DPDP privacy floors, curriculum health, and tier placements.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px",
              padding: "6px", cursor: "pointer", color: "var(--text-secondary)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div
          style={{
            display: "flex", gap: "8px", borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "20px", overflowX: "auto",
          }}
        >
          {[
            { id: "gap" as MathModalTab, label: "1. Curriculum Deficit (Δ)" },
            { id: "privacy" as MathModalTab, label: "2. Under-20 Privacy Floor" },
            { id: "health" as MathModalTab, label: "3. Curriculum Health Index" },
            { id: "eligibility" as MathModalTab, label: "4. Placement Eligibility" },
            { id: "flip" as MathModalTab, label: "5. Obsolete-to-Aligned Flip" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMathModalActiveTab(tab.id)}
              style={{
                padding: "8px 14px", background: "none", border: "none",
                borderBottom: mathModalActiveTab === tab.id ? "2px solid var(--brand-600)" : "2px solid transparent",
                color: mathModalActiveTab === tab.id ? "var(--brand-600)" : "var(--text-secondary)",
                fontSize: "13px", fontWeight: mathModalActiveTab === tab.id ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <MathFrameworkTabContent mathModalActiveTab={mathModalActiveTab} />

        {/* Close Button */}
        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            className="interactive-btn"
            style={{
              padding: "9px 20px", borderRadius: "8px", backgroundColor: "var(--brand-600)",
              border: "none", color: "var(--bg-base)", fontWeight: 700, fontSize: "13px", cursor: "pointer",
            }}
          >
            Close Methodology Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
