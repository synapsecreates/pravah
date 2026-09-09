// FILE: src/pages/onboarding/ArchetypePresets.tsx
// PURPOSE: 1-click standardized archetype presets & complementary skill suggestions.
// PHASE: 8 | DEPENDS ON: React, motion/react, lucide-react, ./constants.ts | LAST TOUCHED: Phase 8

import React from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { ARCHETYPE_DECKS } from "./constants";

interface ArchetypePresetsProps {
  activeArchetypeId: string | null;
  onApplyArchetype: (deck: (typeof ARCHETYPE_DECKS)[0]) => void;
  smartSynergies: { name: string; gain: string; from: string }[];
  onToggleSkill: (name: string, defaultLevel?: number) => void;
}

export const ArchetypePresets: React.FC<ArchetypePresetsProps> = ({
  activeArchetypeId,
  onApplyArchetype,
  smartSynergies,
  onToggleSkill,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
            Career Presets
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            1-click pre-configurations
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
          {ARCHETYPE_DECKS.map((deck) => {
            const isActive = activeArchetypeId === deck.id;
            return (
              <motion.div
                key={deck.id}
                onClick={() => onApplyArchetype(deck)}
                whileHover={{ y: -3, rotateX: 1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="interactive-btn"
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  backgroundColor: isActive ? "var(--brand-50)" : "var(--bg-sunken)",
                  border: isActive ? `1.5px solid ${deck.color}` : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>
                    {deck.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {deck.tagline}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {deck.skills.length} skills
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: isActive ? deck.color : "var(--brand-600)",
                    }}
                  >
                    {isActive ? "Equipped ✓" : "Equip preset →"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* COMPLEMENTARY SKILLS STRIP */}
      {smartSynergies.length > 0 && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            backgroundColor: "var(--bg-sunken)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>
            Complementary skills:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {smartSynergies.map((syn) => (
              <button
                key={syn.name}
                type="button"
                onClick={() => onToggleSkill(syn.name, 75)}
                className="interactive-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 9px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Plus size={11} color="var(--brand-600)" />
                <span>{syn.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
