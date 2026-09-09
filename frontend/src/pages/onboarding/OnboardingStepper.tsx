// FILE: src/pages/onboarding/OnboardingStepper.tsx
// PURPOSE: Top wizard navigation header displaying active step indicator and current stage title.
// PHASE: 8 | DEPENDS ON: React | LAST TOUCHED: Phase 8

import React from "react";

interface OnboardingStepperProps {
  step: number;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ step }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "28px",
        paddingBottom: "20px",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "var(--brand-600)",
              backgroundColor: "var(--brand-50)",
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            Step {step} of 3
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>· Pravah Intelligence Engine</span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "6px 0 0 0", color: "var(--text-primary)" }}>
          {step === 1 && "Academic & Candidate Background"}
          {step === 2 && "Tactile Skill Mastery & Archetype Studio"}
          {step === 3 && "Verified Target Role Matching & Readiness Forecast"}
        </h1>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              width: "36px",
              height: "7px",
              borderRadius: "4px",
              backgroundColor: s === step ? "var(--brand-600)" : s < step ? "var(--success)" : "var(--border-strong)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
};
