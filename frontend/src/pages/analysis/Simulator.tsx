// FILE: src/pages/analysis/Simulator.tsx
// PURPOSE: Live skill bump what-if projection controls and score gain cards.
// PHASE: 8 | DEPENDS ON: React, lucide-react | LAST TOUCHED: Phase 8

import React from "react";
import { Sparkles } from "lucide-react";
import type { WhatIfSimulateResult } from "../../types/student";

interface SimulatorProps {
  skills: Record<string, number>;
  selectedSkillToBump: string;
  setSelectedSkillToBump: (skill: string) => void;
  bumpValue: number;
  setBumpValue: (val: number) => void;
  simulationResult: WhatIfSimulateResult | null;
  setSimulationResult: (res: WhatIfSimulateResult | null) => void;
  isSimulating: boolean;
  onRunSimulation: () => void;
  readinessScore: number;
  activeRoleTitle: string;
  onViewTimeline: (skill: string, hours: number) => void;
}

export const Simulator: React.FC<SimulatorProps> = ({
  skills,
  selectedSkillToBump,
  setSelectedSkillToBump,
  bumpValue,
  setBumpValue,
  simulationResult,
  setSimulationResult,
  isSimulating,
  onRunSimulation,
  readinessScore,
  activeRoleTitle,
  onViewTimeline,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "end" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
            Select Deficit Skill to Upgrade:
          </label>
          <select
            value={selectedSkillToBump}
            onChange={(e) => {
              setSelectedSkillToBump(e.target.value);
              setBumpValue(Math.min(100, (skills[e.target.value] || 50) + 25));
              setSimulationResult(null);
            }}
            style={{
              width: "100%", padding: "10px 12px", backgroundColor: "var(--bg-sunken)",
              border: "1px solid var(--border-strong)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "13px",
            }}
          >
            {Object.keys(skills).map((skill) => (
              <option key={skill} value={skill}>
                {skill} (Current: {skills[skill]}%)
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Target Proficiency Level:</span>
            <strong style={{ color: "var(--brand-600)", fontFamily: "monospace" }}>{bumpValue}%</strong>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={bumpValue}
            onChange={(e) => {
              setBumpValue(Number(e.target.value));
              setSimulationResult(null);
            }}
            style={{ width: "100%", cursor: "pointer", accentColor: "var(--brand-600)" }}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={onRunSimulation}
            disabled={isSimulating}
            style={{
              width: "100%", padding: "10px 16px", borderRadius: "8px",
              backgroundColor: "var(--brand-600)", color: "var(--bg-base)",
              border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}
          >
            <Sparkles size={15} />
            <span>{isSimulating ? "Simulating..." : "Calculate Score Bump"}</span>
          </button>
        </div>
      </div>

      {simulationResult && (
        <div
          style={{
            padding: "16px", borderRadius: "12px", backgroundColor: "var(--bg-sunken)",
            border: "1px solid var(--brand-600)", display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Active Simulation Result for {activeRoleTitle}
            </div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
              Elevating {selectedSkillToBump} to {bumpValue}% yields{" "}
              <span style={{ color: "var(--success)" }}>
                +{simulationResult.projected_gain.toFixed(2)}% Score Gain
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
              Projected New Readiness:{" "}
              <strong style={{ color: "var(--brand-600)", fontFamily: "monospace" }}>
                {Math.round(simulationResult.simulated_score)}%
              </strong>{" "}
              (Baseline: {Math.round(readinessScore)}%) · Recorded in comparison log below.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onViewTimeline(
                selectedSkillToBump,
                Math.max(20, Math.round((bumpValue - (skills[selectedSkillToBump] || 0)) * 1.2))
              )
            }
            style={{
              padding: "8px 16px", borderRadius: "8px", backgroundColor: "var(--brand-50)",
              border: "1px solid var(--brand-600)", color: "var(--brand-600)", fontWeight: 700, fontSize: "12px", cursor: "pointer",
            }}
          >
            View Learning Timeline for {selectedSkillToBump} →
          </button>
        </div>
      )}
    </div>
  );
};
