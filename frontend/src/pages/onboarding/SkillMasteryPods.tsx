// FILE: src/pages/onboarding/SkillMasteryPods.tsx
// PURPOSE: Right column equipped competencies with 4-stage mastery tiers and micro-tuning sliders.
// PHASE: 8 | DEPENDS ON: React, lucide-react | LAST TOUCHED: Phase 8

import React from "react";
import { Compass, Trash2 } from "lucide-react";

interface SkillMasteryPodsProps {
  skills: { name: string; level: number }[];
  onUpdateLevel: (index: number, newLevel: number) => void;
  onRemoveSkill: (index: number) => void;
  onClearAll: () => void;
}

export const SkillMasteryPods: React.FC<SkillMasteryPodsProps> = ({
  skills,
  onUpdateLevel,
  onRemoveSkill,
  onClearAll,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-base)",
        borderRadius: "14px",
        border: "1px solid var(--border-strong)",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Header with Clear Action */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
            Assessed Competencies ({skills.length})
          </span>
        </div>

        {skills.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            style={{
              background: "none",
              border: "none",
              color: "var(--danger)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset All
          </button>
        )}
      </div>

      {/* Empty State */}
      {skills.length === 0 ? (
        <div
          style={{
            padding: "48px 20px",
            textAlign: "center",
            backgroundColor: "var(--bg-surface)",
            borderRadius: "12px",
            border: "1px dashed var(--border-strong)",
            color: "var(--text-secondary)",
          }}
        >
          <Compass size={32} style={{ opacity: 0.4, margin: "0 auto 12px auto", display: "block" }} />
          <p style={{ margin: "0 0 4px 0", fontWeight: 700, fontSize: "14px" }}>No Competencies Equipped</p>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
            Equip a career preset above or select competencies from the left catalog.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxHeight: "440px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          {skills.map((skill, index) => {
            const tierLabel =
              skill.level >= 85
                ? "Advanced"
                : skill.level >= 65
                ? "Proficient"
                : skill.level >= 45
                ? "Intermediate"
                : "Basic";

            return (
              <div
                key={skill.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {/* Pod Top Bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {skill.name}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "var(--text-muted)",
                      }}
                    >
                      · {tierLabel}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "var(--brand-600)",
                      }}
                    >
                      {skill.level}%
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveSkill(index)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "2px",
                      }}
                      title="Remove competence"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* 4-STAGE SEGMENTED LEVEL BUTTONS */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
                  {[
                    { label: "Basic", pct: 25 },
                    { label: "Intermediate", pct: 50 },
                    { label: "Proficient", pct: 75 },
                    { label: "Advanced", pct: 100 },
                  ].map((stage) => {
                    const isExact = Math.abs(skill.level - stage.pct) <= 12;
                    return (
                      <button
                        key={stage.label}
                        type="button"
                        onClick={() => onUpdateLevel(index, stage.pct)}
                        className="interactive-btn"
                        style={{
                          padding: "5px 4px",
                          borderRadius: "6px",
                          backgroundColor: isExact ? "var(--brand-50)" : "var(--bg-sunken)",
                          border: isExact ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                          color: isExact ? "var(--brand-600)" : "var(--text-secondary)",
                          fontSize: "11px",
                          fontWeight: isExact ? 700 : 500,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {stage.label}
                      </button>
                    );
                  })}
                </div>

                {/* MICRO FINE-TUNING SLIDER */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "2px" }}>
                  <button
                    type="button"
                    onClick={() => onUpdateLevel(index, skill.level - 5)}
                    style={{
                      background: "var(--bg-sunken)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-secondary)",
                      borderRadius: "4px",
                      width: "20px",
                      height: "20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={skill.level}
                    onChange={(e) => onUpdateLevel(index, Number(e.target.value))}
                    style={{
                      flex: 1,
                      height: "4px",
                      borderRadius: "2px",
                      accentColor: "var(--brand-600)",
                      cursor: "pointer",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateLevel(index, skill.level + 5)}
                    style={{
                      background: "var(--bg-sunken)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-secondary)",
                      borderRadius: "4px",
                      width: "20px",
                      height: "20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
