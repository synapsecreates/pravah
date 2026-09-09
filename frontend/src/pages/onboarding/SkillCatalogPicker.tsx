// FILE: src/pages/onboarding/SkillCatalogPicker.tsx
// PURPOSE: Left column skill catalog browser with search, domain pills, equip chips, and custom entry.
// PHASE: 8 | DEPENDS ON: React, lucide-react, ./constants.ts | LAST TOUCHED: Phase 8

import React from "react";
import { Search, X, Plus, CheckCircle2 } from "lucide-react";
import { DOMAIN_CRITICAL_SKILLS } from "./constants";

interface SkillCatalogPickerProps {
  skillSearchQuery: string;
  setSkillSearchQuery: (q: string) => void;
  activeDomainFilter: string;
  setActiveDomainFilter: (dom: string) => void;
  filteredDomainSkills: typeof DOMAIN_CRITICAL_SKILLS;
  skills: { name: string; level: number }[];
  onToggleSkill: (skillName: string, defaultLevel?: number) => void;
  newSkillName: string;
  setNewSkillName: (name: string) => void;
  onAddCustomSkill: () => void;
}

export const SkillCatalogPicker: React.FC<SkillCatalogPickerProps> = ({
  skillSearchQuery,
  setSkillSearchQuery,
  activeDomainFilter,
  setActiveDomainFilter,
  filteredDomainSkills,
  skills,
  onToggleSkill,
  newSkillName,
  setNewSkillName,
  onAddCustomSkill,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-sunken)",
        borderRadius: "14px",
        border: "1px solid var(--border-subtle)",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Search Bar */}
      <div style={{ position: "relative" }}>
        <Search
          size={15}
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
        />
        <input
          type="text"
          value={skillSearchQuery}
          onChange={(e) => setSkillSearchQuery(e.target.value)}
          placeholder="Search 50+ canonical skills (e.g. Python, Docker, PyTorch)..."
          style={{
            width: "100%",
            padding: "10px 14px 10px 36px",
            borderRadius: "10px",
            backgroundColor: "var(--bg-base)",
            border: "1px solid var(--border-strong)",
            color: "var(--text-primary)",
            fontSize: "13px",
            outline: "none",
          }}
        />
        {skillSearchQuery && (
          <button
            type="button"
            onClick={() => setSkillSearchQuery("")}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Domain Selector Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        <button
          type="button"
          onClick={() => setActiveDomainFilter("All")}
          style={{
            padding: "5px 12px",
            borderRadius: "14px",
            fontSize: "11px",
            fontWeight: activeDomainFilter === "All" ? 800 : 500,
            backgroundColor: activeDomainFilter === "All" ? "var(--brand-600)" : "var(--bg-surface)",
            color: activeDomainFilter === "All" ? "#ffffff" : "var(--text-secondary)",
            border: activeDomainFilter === "All" ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          All Domains
        </button>
        {DOMAIN_CRITICAL_SKILLS.map((dom) => {
          const isSelected = activeDomainFilter === dom.domain;
          const Icon = dom.icon;
          return (
            <button
              key={dom.domain}
              type="button"
              onClick={() => setActiveDomainFilter(dom.domain)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "14px",
                fontSize: "11px",
                fontWeight: isSelected ? 800 : 500,
                backgroundColor: isSelected ? dom.color : "var(--bg-surface)",
                color: isSelected ? "#0B1020" : "var(--text-secondary)",
                border: isSelected ? `1px solid ${dom.color}` : "1px solid var(--border-subtle)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={12} />
              <span>{dom.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Skill Chips Group */}
      <div
        style={{
          maxHeight: "360px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          paddingRight: "4px",
        }}
      >
        {filteredDomainSkills.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text-muted)", fontSize: "12px" }}>
            No competencies match "{skillSearchQuery}". Add it as a custom skill below!
          </div>
        ) : (
          filteredDomainSkills.map((domGroup) => (
            <div key={domGroup.domain}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: domGroup.color, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <domGroup.icon size={13} />
                <span>{domGroup.domain}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {domGroup.skills.map((skillName) => {
                  const isEquipped = skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
                  const level = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())?.level;
                  return (
                    <button
                      key={skillName}
                      type="button"
                      onClick={() => onToggleSkill(skillName, 70)}
                      className="interactive-btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "5px 11px",
                        borderRadius: "14px",
                        fontSize: "11px",
                        backgroundColor: isEquipped ? "var(--brand-50)" : "var(--bg-surface)",
                        border: isEquipped ? `1.5px solid ${domGroup.color}` : "1px solid var(--border-strong)",
                        color: isEquipped ? "var(--text-primary)" : "var(--text-secondary)",
                        fontWeight: isEquipped ? 800 : 500,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isEquipped ? (
                        <>
                          <CheckCircle2 size={12} color={domGroup.color} />
                          <span>{skillName}</span>
                          <span style={{ opacity: 0.8, fontSize: "10px", color: domGroup.color }}>{level}%</span>
                        </>
                      ) : (
                        <>
                          <Plus size={11} />
                          <span>{skillName}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Skill Input */}
      <div style={{ display: "flex", gap: "8px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Add custom competence (e.g. Solidity, Rust, OpenCV)..."
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "var(--bg-base)",
            border: "1px solid var(--border-strong)",
            color: "var(--text-primary)",
            fontSize: "12px",
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={onAddCustomSkill}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-strong)",
            color: "var(--text-primary)",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Plus size={13} />
          <span>Equip</span>
        </button>
      </div>
    </div>
  );
};
