// FILE: src/pages/onboarding/SkillsStep.tsx
// PURPOSE: Step 2 orchestrating the skill matrix studio, HUD radar card, archetype decks, picker, mastery pods, and live market alignment.
// PHASE: 8 | DEPENDS ON: React, motion/react, lucide-react, ./SkillRadarCard.tsx, ./ArchetypePresets.tsx, ./SkillCatalogPicker.tsx, ./SkillMasteryPods.tsx, ./constants.ts | LAST TOUCHED: Phase 8

import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";
import { SkillRadarCard, type RadarMathData } from "./SkillRadarCard";
import { ArchetypePresets } from "./ArchetypePresets";
import { SkillCatalogPicker } from "./SkillCatalogPicker";
import { SkillMasteryPods } from "./SkillMasteryPods";
import { ARCHETYPE_DECKS, DOMAIN_CRITICAL_SKILLS } from "./constants";
import { ANCHOR_ROLES_DATA } from "../../api/client";

type AnchorRole = (typeof ANCHOR_ROLES_DATA)[0];

interface SkillsStepProps {
  skills: { name: string; level: number }[];
  totalXP: number;
  avgProficiency: number;
  dominantArchetype: string;
  domainScores: Record<string, number>;
  radarPoints: RadarMathData;
  activeArchetypeId: string | null;
  onApplyArchetype: (deck: (typeof ARCHETYPE_DECKS)[0]) => void;
  smartSynergies: { name: string; gain: string; from: string }[];
  onToggleSkill: (name: string, defaultLevel?: number) => void;
  skillSearchQuery: string;
  setSkillSearchQuery: (q: string) => void;
  activeDomainFilter: string;
  setActiveDomainFilter: (dom: string) => void;
  filteredDomainSkills: typeof DOMAIN_CRITICAL_SKILLS;
  newSkillName: string;
  setNewSkillName: (name: string) => void;
  onAddCustomSkill: () => void;
  onUpdateLevel: (index: number, newLevel: number) => void;
  onRemoveSkill: (index: number) => void;
  onClearAll: () => void;
  localRoleRankings: { role: AnchorRole; score: number }[];
  onPrev: () => void;
  onNext: () => void;
  onOpenVerificationModal: () => void;
}

export const SkillsStep: React.FC<SkillsStepProps> = (props) => {
  const {
    skills, totalXP, avgProficiency, dominantArchetype, domainScores, radarPoints,
    activeArchetypeId, onApplyArchetype, smartSynergies, onToggleSkill,
    skillSearchQuery, setSkillSearchQuery, activeDomainFilter, setActiveDomainFilter,
    filteredDomainSkills, newSkillName, setNewSkillName, onAddCustomSkill,
    onUpdateLevel, onRemoveSkill, onClearAll, localRoleRankings,
    onPrev, onNext, onOpenVerificationModal,
  } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. SECTION HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            Skill Matrix &amp; Proficiency Assessment
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Self-attest your competencies or equip a preset to compute deterministic role affinity scores.
          </p>
        </div>

        {/* Verification Roadmap Link */}
        <button
          type="button"
          onClick={onOpenVerificationModal}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "var(--brand-600)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "6px",
          }}
        >
          <ShieldCheck size={15} />
          <span>How skill verification works (Roadmap)</span>
        </button>
      </div>

      {/* 2. HERO SECTION: INTERACTIVE RADAR & ARCHETYPE DECK */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        <SkillRadarCard
          totalXP={totalXP}
          avgProficiency={avgProficiency}
          dominantArchetype={dominantArchetype}
          domainScores={domainScores}
          skillsCount={skills.length}
          radarPoints={radarPoints}
        />

        <ArchetypePresets
          activeArchetypeId={activeArchetypeId}
          onApplyArchetype={onApplyArchetype}
          smartSynergies={smartSynergies}
          onToggleSkill={onToggleSkill}
        />
      </div>

      {/* 3. MAIN WORKSPACE: 2 COLUMNS (SKILL CATALOG vs RATED PORTFOLIO PODS) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "22px",
          alignItems: "start",
        }}
      >
        <SkillCatalogPicker
          skillSearchQuery={skillSearchQuery}
          setSkillSearchQuery={setSkillSearchQuery}
          activeDomainFilter={activeDomainFilter}
          setActiveDomainFilter={setActiveDomainFilter}
          filteredDomainSkills={filteredDomainSkills}
          skills={skills}
          onToggleSkill={onToggleSkill}
          newSkillName={newSkillName}
          setNewSkillName={setNewSkillName}
          onAddCustomSkill={onAddCustomSkill}
        />

        <SkillMasteryPods
          skills={skills}
          onUpdateLevel={onUpdateLevel}
          onRemoveSkill={onRemoveSkill}
          onClearAll={onClearAll}
        />
      </div>

      {/* 4. REAL-TIME NATIONAL MARKET ALIGNMENT BAR */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "12px",
          backgroundColor: "var(--bg-sunken)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TrendingUp size={18} color="var(--brand-600)" />
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              {localRoleRankings.length > 0
                ? `Projected Alignment: ${localRoleRankings[0].role.title} (${localRoleRankings[0].score}% match)`
                : "Equip at least 3 competencies to predict role alignment"}
            </div>
            {localRoleRankings.length > 1 && (
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Other potential fits: {localRoleRankings.slice(1, 3).map((r) => `${r.role.title} (${r.score}%)`).join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            type="button"
            onClick={onPrev}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ← Back to Bio
          </button>

          <motion.button
            type="button"
            disabled={skills.length < 3}
            onClick={() => {
              if (skills.length >= 3) onNext();
            }}
            whileHover={skills.length >= 3 ? { y: -3, rotateX: 1 } : undefined}
            whileTap={skills.length >= 3 ? { scale: 0.98 } : undefined}
            transition={{ duration: 0.16 }}
            className="interactive-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "8px",
              backgroundColor: "var(--brand-600)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              border: "none",
              cursor: skills.length >= 3 ? "pointer" : "not-allowed",
              opacity: skills.length >= 3 ? 1 : 0.45,
            }}
          >
            <span>Predict Top Roles</span>
            <ArrowRight size={15} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
