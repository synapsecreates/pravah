// FILE: src/pages/onboarding/ProfileStep.tsx
// PURPOSE: Step 1 academic and candidate background entry form with discipline, year, institution, and autofill options.
// PHASE: 8 | DEPENDS ON: React, motion/react, lucide-react, ./constants.ts | LAST TOUCHED: Phase 8

import React from "react";
import { motion } from "motion/react";
import { AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { DEGREE_OPTIONS } from "./constants";

interface ProfileStepProps {
  fullName: string;
  setFullName: (name: string) => void;
  collegeName: string;
  setCollegeName: (college: string) => void;
  degreeField: string;
  setDegreeField: (degree: string) => void;
  currentYear: number;
  setCurrentYear: (year: number) => void;
  isAboutYouComplete: boolean;
  onNext: () => void;
  onLoadDemoPreset: () => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  fullName,
  setFullName,
  collegeName,
  setCollegeName,
  degreeField,
  setDegreeField,
  currentYear,
  setCurrentYear,
  isAboutYouComplete,
  onNext,
  onLoadDemoPreset,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
            Candidate Full Name <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Aaditya Sharma"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-base)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
            College / University <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            placeholder="e.g. Indian Institute of Technology, Roorkee"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-base)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
            Discipline / Major
          </label>
          <select
            value={degreeField}
            onChange={(e) => setDegreeField(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-base)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none",
            }}
          >
            {DEGREE_OPTIONS.map((deg) => (
              <option key={deg} value={deg}>
                {deg}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
            Current Year of Study
          </label>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-base)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none",
            }}
          >
            <option value={1}>1st Year (Foundational)</option>
            <option value={2}>2nd Year (Core Competencies)</option>
            <option value={3}>3rd Year (Pre-Placement)</option>
            <option value={4}>4th Year (Graduating / Placements)</option>
          </select>
        </div>
      </div>

      {!isAboutYouComplete && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: "var(--bg-sunken)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            fontSize: "13px",
          }}
        >
          <AlertCircle size={16} color="var(--warning)" />
          <span>
            Please enter your <strong>Full Name</strong> and <strong>College Name</strong> to activate the Skill Studio.
          </span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <button
          type="button"
          onClick={onLoadDemoPreset}
          style={{
            fontSize: "12px",
            color: "var(--brand-600)",
            background: "none",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Sparkles size={14} />
          <span>Autofill Sample Profile</span>
        </button>

        <motion.button
          type="button"
          disabled={!isAboutYouComplete}
          onClick={() => {
            if (isAboutYouComplete) onNext();
          }}
          whileHover={isAboutYouComplete ? { y: -3, rotateX: 1 } : undefined}
          whileTap={isAboutYouComplete ? { scale: 0.98 } : undefined}
          transition={{ duration: 0.16 }}
          className="interactive-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 26px",
            borderRadius: "10px",
            backgroundColor: "var(--brand-600)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 700,
            border: "none",
            cursor: isAboutYouComplete ? "pointer" : "not-allowed",
            opacity: isAboutYouComplete ? 1 : 0.45,
            boxShadow: isAboutYouComplete ? "0 4px 14px rgba(96, 165, 250, 0.35)" : "none",
          }}
        >
          <span>Enter Skill Studio</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};
