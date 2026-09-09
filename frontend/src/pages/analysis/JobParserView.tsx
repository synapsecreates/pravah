// FILE: src/pages/analysis/JobParserView.tsx
// PURPOSE: View 4 dedicated ATS Job Description Parser with presets, fit scoring, and requirement breakdown.
// PHASE: 8 | DEPENDS ON: React, lucide-react, ./constants.ts | LAST TOUCHED: Phase 8

import React from "react";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { JOB_PRESETS } from "./constants";

interface JobParserViewProps {
  selectedJobPreset: string;
  setSelectedJobPreset: (id: string) => void;
  jobMatchEvaluation: {
    activePreset: (typeof JOB_PRESETS)[0];
    matchScore: number;
    skillsStatus: {
      name: string;
      required: boolean;
      weight: number;
      studentLvl: number;
      isMet: boolean;
    }[];
  };
  onBackToOverview: () => void;
}

export const JobParserView: React.FC<JobParserViewProps> = ({
  selectedJobPreset,
  setSelectedJobPreset,
  jobMatchEvaluation,
  onBackToOverview,
}) => {
  const { activePreset, matchScore, skillsStatus } = jobMatchEvaluation;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "var(--shadow-elevation)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <button
              type="button"
              onClick={onBackToOverview}
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px", background: "none",
                border: "none", color: "var(--brand-600)", fontWeight: 700, fontSize: "12px", cursor: "pointer", padding: 0,
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Overview</span>
            </button>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
              Real-World ATS Engine
            </span>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
            Real-World Job Description Parser & Match Evaluator
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Select live market postings or inspect candidate fit percentages against real employer requirements across Indian tech hubs.
          </p>
        </div>
      </div>

      {/* Job Presets Selector */}
      <div style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "14px", padding: "18px 22px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase" }}>
          Select Active Industry Job Listing:
        </label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {JOB_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedJobPreset(preset.id)}
              style={{
                padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                border: selectedJobPreset === preset.id ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                backgroundColor: selectedJobPreset === preset.id ? "var(--brand-50)" : "var(--bg-sunken)",
                color: selectedJobPreset === preset.id ? "var(--brand-600)" : "var(--text-secondary)",
              }}
            >
              {preset.title.split("&")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Parsed Job Card & Skills Fit */}
      <div style={{ backgroundColor: "var(--bg-surface)", borderRadius: "16px", border: "1px solid var(--border-strong)", padding: "24px", boxShadow: "var(--shadow-elevation)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>{activePreset.title}</h3>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{activePreset.company} · {activePreset.type}</span>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>ATS Candidate Fit</span>
            <span style={{ fontSize: "26px", fontWeight: 800, fontFamily: "monospace", color: matchScore >= 70 ? "var(--success)" : matchScore >= 50 ? "var(--warning)" : "var(--danger)" }}>
              {matchScore}% Match
            </span>
          </div>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 20px 0", lineHeight: "1.5" }}>
          {activePreset.description}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
            Parsed Technical Requirements & Candidate Assessed Level:
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
            {skillsStatus.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center",
                  justifyContent: "space-between", fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {s.isMet ? <CheckCircle2 size={16} color="var(--success)" /> : <AlertTriangle size={16} color="var(--danger)" />}
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</span>
                </div>
                <span style={{ fontSize: "12px", fontFamily: "monospace", color: s.isMet ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>
                  {s.studentLvl}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
