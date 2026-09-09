// FILE: src/pages/college/SyllabusEditorModal.tsx
// PURPOSE: Interactive course syllabus editor with real-time modernization and status flip engine.
// PHASE: 8 | DEPENDS ON: React, lucide-react, ./types.ts, ./constants.ts | LAST TOUCHED: Phase 8

import React from "react";
import { BookOpen, X, Plus, Sparkles, RefreshCw, Check } from "lucide-react";
import type { CourseAuditData } from "./types";
import { MODERN_SKILL_SUGGESTIONS } from "./constants";

interface SyllabusEditorModalProps {
  editingCourse: CourseAuditData | null;
  editSkillsList: string[];
  customSkillInput: string;
  setCustomSkillInput: (val: string) => void;
  isUpdatingCourse: boolean;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  onSaveModernizedSyllabus: () => void;
  onClose: () => void;
}

export const SyllabusEditorModal: React.FC<SyllabusEditorModalProps> = ({
  editingCourse,
  editSkillsList,
  customSkillInput,
  setCustomSkillInput,
  isUpdatingCourse,
  onAddSkill,
  onRemoveSkill,
  onSaveModernizedSyllabus,
  onClose,
}) => {
  if (!editingCourse) return null;

  return (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(6px)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", }}
          onClick={() => !isUpdatingCourse && onClose()}
        >
          <div
            style={{ backgroundColor: "var(--bg-surface)", borderRadius: "16px", padding: "28px", maxWidth: "680px", width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.35)", border: "1px solid var(--border-strong)", }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}> <div>  <h3 style={{ margin: "6px 0 0 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {editingCourse.course_code}: {editingCourse.course_name}
                </h3>
              </div>
              <button
                onClick={() => !isUpdatingCourse && onClose()}
                style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}> Modify the mapped competencies for this course. Adding modern industry skills will dynamically increase the course's alignment score and automatically flip its status from <code>OBSOLETE</code> / <code>AT RISK</code> to <code>ALIGNED</code>. </p>  {/* Current Mapped Skills in Editor */} <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}> CURRENTLY MAPPED COMPETENCIES ({editSkillsList.length}) </label> <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)", minHeight: "48px", border: "1px solid var(--border-subtle)", }}
              >
                {editSkillsList.map((skill) => (
                  <span
                    key={skill}
                    style={{ padding: "4px 10px", borderRadius: "6px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)", fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", display: "inline-flex", alignItems: "center", gap: "6px", }}
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveSkill(skill)}
                      style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
                {editSkillsList.length === 0 && (
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}> No skills mapped yet. Add skills below. </span> )} </div> </div>  {/* Suggested Modern Skills to Add */} {MODERN_SKILL_SUGGESTIONS[editingCourse.course_code] && ( <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}> SUGGESTED INDUSTRY UPGRADES (Click to Add): </label> <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {MODERN_SKILL_SUGGESTIONS[editingCourse.course_code].map((s) => {
                    const alreadyAdded = editSkillsList.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => !alreadyAdded && onAddSkill(s)}
                        disabled={alreadyAdded}
                        style={{ padding: "4px 10px", borderRadius: "6px", backgroundColor: alreadyAdded ? "var(--bg-sunken)" : "var(--brand-50)", border: "1px solid var(--border-strong)", color: alreadyAdded ? "var(--text-secondary)" : "var(--brand-600)", fontSize: "12px", fontWeight: 600, cursor: alreadyAdded ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: "4px", }}
                      >
                        {alreadyAdded ? <Check size={12} /> : <Plus size={12} />}
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Custom Skill Input */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}> <input type="text" value={customSkillInput} onChange={(e) => setCustomSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddSkill(customSkillInput); setCustomSkillInput(""); } }}
                placeholder="Or type custom industry competency..."
                className="interactive-input"
                style={{ flex: 1, padding: "9px 14px", borderRadius: "8px", border: "1px solid var(--border-strong)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", fontSize: "13px", }}
              />
              <button
                type="button"
                onClick={() => {
                  onAddSkill(customSkillInput);
                  setCustomSkillInput("");
                }}
                style={{ padding: "9px 16px", borderRadius: "8px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)", color: "var(--text-primary)", fontSize: "13px", fontWeight: 600, cursor: "pointer", }}
              >
                Add Skill
              </button>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}> <button type="button" onClick={() => onClose()} disabled={isUpdatingCourse} style={{ padding: "9px 18px", borderRadius: "8px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)", color: "var(--text-primary)", fontSize: "13px", fontWeight: 600, cursor: "pointer", }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onSaveModernizedSyllabus}
                disabled={isUpdatingCourse}
                style={{ padding: "9px 20px", borderRadius: "8px", backgroundColor: "var(--brand-600)", border: "none", color: "var(--bg-base)", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", }}
              >
                {isUpdatingCourse ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
                <span>Save &amp; Run Modernization Engine</span>
              </button>
            </div>
          </div>
        </div>
  );
};
