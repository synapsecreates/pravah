// FILE: src/pages/onboarding/VerificationModal.tsx
// PURPOSE: Proctored skill verification & diagnostic roadmap modal explaining future CAT testing, sandbox assessments, and anti-cheat mechanisms.
// PHASE: 8 | DEPENDS ON: React, lucide-react | LAST TOUCHED: Phase 8

import React from "react";
import { ShieldCheck, X, Zap, Cpu, Award, Lock } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "28px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                Skill Verification &amp; Diagnostic Protocol (Roadmap)
              </h3>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Automated assessment, sandbox evaluation, and credential verification blueprint.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Explanatory Note */}
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "10px",
            backgroundColor: "var(--bg-sunken)",
            border: "1px solid var(--border-subtle)",
            fontSize: "13px",
            lineHeight: "1.5",
            color: "var(--text-secondary)",
          }}
        >
          <strong style={{ color: "var(--text-primary)" }}>Why Self-Attestation for MVP?</strong>
          <br />
          Pravah currently utilizes structured self-evaluation so students can immediately explore role matching, syllabus gap analytics, and learning pathways without upfront test friction. In production deployment, all claims are verified via proctored assessments.
        </div>

        {/* 4 Pillars of Verification */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Zap size={16} color="#38bdf8" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                1. Adaptive 15-Minute Diagnostic Quizzes
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Computerized Adaptive Testing (CAT) calibrating question difficulty dynamically based on real-time candidate answers.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Cpu size={16} color="#34d399" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                2. Live Interactive Sandboxes &amp; Unit Tests
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Real-time browser-based coding execution against automated unit test suites for verified hands-on proficiency.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Award size={16} color="#fbbf24" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                3. Tamper-Proof Cryptographic Skill Badges
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Candidates who pass proctored diagnostics earn a permanent verified badge, appearing at the top of employer searches.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Lock size={16} color="#a78bfa" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                4. Anti-Cheat &amp; LLM Deterrence Proctoring
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Tab-switch monitoring, keystroke entropy analysis, and prompt-injection defenses to guarantee authentic student assessment.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            className="interactive-btn"
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              backgroundColor: "var(--brand-600)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Got It · Continue with Self-Attestation for MVP
          </button>
        </div>
      </div>
    </div>
  );
};
