// FILE: src/pages/analysis/SimulationHistoryTable.tsx
// PURPOSE: Comparative what-if simulation experiment log table and highest ROI finding banner.
// PHASE: 8 | DEPENDS ON: React, lucide-react, ./constants.ts | LAST TOUCHED: Phase 8

import React from "react";
import { History, Trash2, Zap, X } from "lucide-react";
import type { BumpLogEntry } from "./constants";

interface SimulationHistoryTableProps {
  bumpHistory: BumpLogEntry[];
  bestExperiment: BumpLogEntry | null;
  onClearHistory: () => void;
  onReapplyExperiment: (entry: BumpLogEntry) => void;
  onRemoveExperiment: (id: string) => void;
}

export const SimulationHistoryTable: React.FC<SimulationHistoryTableProps> = ({
  bumpHistory,
  bestExperiment,
  onClearHistory,
  onReapplyExperiment,
  onRemoveExperiment,
}) => {
  return (
    <div style={{ marginTop: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <History size={16} color="var(--brand-600)" />
          <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
            Comparative What-If Experiment Log ({bumpHistory.length})
          </h4>
        </div>

        {bumpHistory.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            style={{
              background: "none", border: "none", color: "var(--text-muted)", fontSize: "11px",
              fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px",
            }}
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {bestExperiment && bumpHistory.length >= 2 && (
        <div
          style={{
            padding: "10px 14px", backgroundColor: "var(--success-bg)", border: "1px solid var(--success)",
            borderRadius: "8px", marginBottom: "12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <Zap size={16} color="var(--success)" style={{ flexShrink: 0 }} />
          <span>
            <strong style={{ color: "var(--success)" }}>Highest ROI Finding: </strong>
            Elevating <strong>{bestExperiment.skill}</strong> to <strong>{bestExperiment.bumpedLevel}%</strong> produces the greatest acceleration (
            <strong>+{bestExperiment.gain.toFixed(2)}%</strong>) among all tested hypotheses.
          </span>
        </div>
      )}

      {bumpHistory.length > 0 ? (
        <div style={{ overflowX: "auto", border: "1px solid var(--border-strong)", borderRadius: "10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-sunken)", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                <th style={{ padding: "10px 14px", fontWeight: 600, width: "60px" }}>#</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Target Skill</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Shift Range</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Score Gain</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Simulated Score</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Time</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bumpHistory.map((entry) => {
                const isBest = bestExperiment?.id === entry.id && bumpHistory.length >= 2;
                return (
                  <tr
                    key={entry.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      backgroundColor: isBest ? "var(--bg-surface)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                      #{entry.experimentNumber}
                    </td>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--text-primary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{entry.skill}</span>
                        {isBest && <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--success)" }}>(Highest ROI)</span>}
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "var(--text-secondary)" }}>
                      <span>{entry.baselineLevel}%</span>
                      <span style={{ color: "var(--brand-600)", margin: "0 6px" }}>→</span>
                      <strong style={{ color: "var(--text-primary)" }}>{entry.bumpedLevel}%</strong>
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "6px" }}>
                        (+{entry.bumpedLevel - entry.baselineLevel}%)
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          display: "inline-block", padding: "2px 8px", borderRadius: "6px", fontWeight: 700,
                          fontFamily: "monospace", backgroundColor: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)",
                        }}
                      >
                        +{entry.gain.toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--brand-600)" }}>
                      {Math.round(entry.simulatedScore)}%
                    </td>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontSize: "11px" }}>
                      {entry.timestamp}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => onReapplyExperiment(entry)}
                          style={{
                            background: "none", border: "1px solid var(--border-subtle)", borderRadius: "6px",
                            padding: "4px 8px", color: "var(--brand-600)", fontSize: "11px", fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          Re-test
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveExperiment(entry.id)}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: "20px", textAlign: "center", backgroundColor: "var(--bg-sunken)", borderRadius: "10px", border: "1px dashed var(--border-subtle)", color: "var(--text-muted)", fontSize: "12px" }}>
          No simulation experiments logged yet. Adjust the proficiency slider above and click &quot;Calculate Score Bump&quot; to test and compare multiple upskilling hypotheses.
        </div>
      )}
    </div>
  );
};
