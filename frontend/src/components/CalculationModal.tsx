// FILE: src/components/CalculationModal.tsx
// PURPOSE: Mathematical Transparency Inspector modal displaying deterministic formula breakdowns, arithmetic proofs, plain English variable glossaries, and Gaussian statistical percentile models.
// PHASE: 5 | DEPENDS ON: lucide-react, src/index.css | LAST TOUCHED: Phase 5

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Award,
  TrendingUp,
  Users,
  Info,
  BookOpen,
  Sliders,
  Scale,
  Sparkles,
} from "lucide-react";

export type CalculationPayload =
  | {
      type: "match";
      data: {
        role_title: string;
        final_score: number;
        skill_match_score: number;
        education_factor: number;
        experience_score?: number;
        formula_breakdown?: string;
      };
    }
  | {
      type: "gap";
      data: {
        skill_name: string;
        required_level: number;
        student_level: number;
        gap: number;
        tier: string;
        formula_breakdown?: string;
      };
    }
  | {
      type: "priority";
      data: {
        skill_name: string;
        gap: number;
        industry_demand: number;
        role_importance: number;
        priority_score: number;
        formula_breakdown?: string;
        why_text?: string;
      };
    }
  | {
      type: "readiness";
      data: {
        role_title: string;
        readiness_score: number;
        composite_match: number;
        education_factor: number;
        degree_field: string;
      };
    }
  | {
      type: "statistical";
      data: {
        role_title: string;
        readiness_score: number;
        national_mean: number;
        national_std: number;
        z_score: number;
        percentile: number;
        placement_tier: string;
        salary_band: string;
        cohort_size: string;
      };
    };

interface CalculationModalProps {
  payload: CalculationPayload | null;
  onClose: () => void;
}

// Renders the mathematical and statistical formula inspector modal portal.
// Provides absolute transparency into scoring arithmetic, plain English variable definitions, and Gaussian national percentile models.
// Features a strict body scroll lock to ensure the background dashboard does not scroll while inspecting formulas.
export const CalculationModal: React.FC<CalculationModalProps> = ({ payload, onClose }) => {
  // UI Scroll Lock: Prevent background page scrolling while the modal is open.
  // The modal card itself will scroll if its content exceeds viewport height.
  useEffect(() => {
    if (!payload) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [payload]);

  if (!payload) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "86vh",
          overflowY: "auto",
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "var(--shadow-hover)",
          color: "var(--text-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor: "var(--brand-50)",
                border: "1px solid var(--brand-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--brand-600)",
                flexShrink: 0,
              }}
            >
              {payload.type === "statistical" ? <Award size={22} /> : <Calculator size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                {payload.type === "statistical"
                  ? "Gaussian National Standing & Statistical Model"
                  : "Deterministic Mathematical Transparency Inspector"}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "3px 0 0 0" }}>
                AICTE / National Occupational Standards (NOS) · Non-Generative Auditable Proof
              </p>
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
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Rigor Notice Banner */}
        <div
          style={{
            padding: "10px 14px",
            backgroundColor: "var(--bg-sunken)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "11px",
            color: "var(--text-secondary)",
          }}
        >
          <Scale size={16} color="var(--brand-600)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Deterministic System:</strong> This score is calculated via closed-form mathematical equations, not randomized generation. Every variable and weight is strictly auditable.
          </span>
        </div>

        {/* ======================================================== */}
        {/* Content Type: Skill Gap                                   */}
        {/* ======================================================== */}
        {payload.type === "gap" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "12px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Assessed Skill Benchmark</span>
              <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "2px", color: "var(--text-primary)" }}>{payload.data.skill_name}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", textAlign: "center" }}>
              <div style={{ padding: "12px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Industry Benchmark (Req)</span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--brand-600)", fontFamily: "monospace" }}>{payload.data.required_level}%</span>
              </div>
              <div style={{ padding: "12px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Current Proficiency (Assessed)</span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--success)", fontFamily: "monospace" }}>{payload.data.student_level}%</span>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "10px", fontFamily: "monospace", fontSize: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "var(--text-muted)", fontFamily: "sans-serif", fontSize: "11px", fontWeight: 600 }}>Deterministic Formulation:</div>
              <div style={{ color: "var(--brand-600)", fontWeight: 700 }}>Gap = max(0, Required_Level - Assessed_Level)</div>
              <div style={{ paddingTop: "6px", borderTop: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                Numerical Substitution: Gap = max(0, {payload.data.required_level} - {payload.data.student_level}) ={" "}
                <span style={{ color: payload.data.gap > 0 ? "var(--danger)" : "var(--success)", fontWeight: 700 }}>
                  {payload.data.gap > 0 ? `${payload.data.gap}% Deficit` : "0% (Benchmark Satisfied)"}
                </span>
              </div>
            </div>

            {/* Plain English Variable Glossary */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-primary)" }}>
                <BookOpen size={14} color="var(--brand-600)" />
                <span>Plain English Variable Glossary</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: "var(--text-secondary)", lineHeight: "1.45" }}>
                <div>
                  <strong style={{ color: "var(--brand-600)" }}>Required Benchmark: </strong>
                  The target competency threshold identified by employer hiring data and AICTE occupational standards for entry into this role.
                </div>
                <div>
                  <strong style={{ color: "var(--success)" }}>Assessed Level: </strong>
                  The student\'s verified mastery evaluated through academic coursework, lab assessments, and verified project ratings.
                </div>
                <div>
                  <strong style={{ color: "var(--danger)" }}>Deficit (Gap): </strong>
                  The exact numerical shortfall between market expectations and current ability. If Assessed Level exceeds the Requirement, the gap is capped at 0 and designated as a <em>Verified Strength</em>.
                </div>
                <div>
                  <strong style={{ color: "var(--warning)" }}>Classification Tier ({payload.data.tier}): </strong>
                  Deficits &gt; 40% are flagged as <em>Critical Deficits</em> because enterprise recruiters use them as immediate screening filters.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* Content Type: Role Match / Pre-Factor Match               */}
        {/* ======================================================== */}
        {payload.type === "match" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "12px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Target Role Evaluated</span>
              <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "2px", color: "var(--text-primary)" }}>{payload.data.role_title}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", textAlign: "center" }}>
              <div style={{ padding: "12px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Pre-Factor Match</span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--brand-600)", fontFamily: "monospace" }}>{payload.data.skill_match_score}%</span>
              </div>
              <div style={{ padding: "12px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Education Multiplier</span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--warning)", fontFamily: "monospace" }}>×{payload.data.education_factor.toFixed(2)}</span>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "10px", fontFamily: "monospace", fontSize: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "var(--text-muted)", fontFamily: "sans-serif", fontSize: "11px", fontWeight: 600 }}>Deterministic Tri-Component Formulation:</div>
              <div style={{ color: "var(--brand-600)", fontWeight: 700 }}>Composite = 0.60 × Required + 0.25 × Preferred + 0.15 × Experiential</div>
              <div style={{ color: "var(--violet-accent)", fontWeight: 700 }}>Final Readiness = min(100.0, Composite × Education_Multiplier)</div>
              <div style={{ paddingTop: "6px", borderTop: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                Computed Final Score: <strong style={{ color: "var(--success)", fontSize: "14px" }}>{Math.round(payload.data.final_score)}%</strong>
              </div>
            </div>

            {/* Plain English Variable Glossary */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-primary)" }}>
                <BookOpen size={14} color="var(--brand-600)" />
                <span>Plain English Variable Glossary</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: "var(--text-secondary)", lineHeight: "1.45" }}>
                <div>
                  <strong style={{ color: "var(--brand-600)" }}>Pre-Factor Match (Raw Skill Alignment): </strong>
                  The pure, objective percentage match between candidate skills and job requirements before academic degree adjustments. It prevents formal college degrees from artificially hiding or inflating raw technical competency.
                </div>
                <div>
                  <strong style={{ color: "var(--text-primary)" }}>60% Required Skills Weight (W_req): </strong>
                  Allocated to non-negotiable core technologies (e.g. Python, SQL, React) essential for day-one job performance.
                </div>
                <div>
                  <strong style={{ color: "var(--text-primary)" }}>25% Preferred Skills Weight (W_pref): </strong>
                  Secondary frameworks and specialized tools that elevate a candidate above standard applicants.
                </div>
                <div>
                  <strong style={{ color: "var(--text-primary)" }}>15% Experiential Weight (W_exp): </strong>
                  Engineering best practices (e.g. Git workflows, clean code, CLI mastery, unit testing).
                </div>
                <div>
                  <strong style={{ color: "var(--warning)" }}>Education Multiplier (E_d = {payload.data.education_factor.toFixed(2)}): </strong>
                  AICTE-calibrated curricular alignment factor. Validates disciplinary foundations (Computer Science = 1.00×, IT = 0.98×, ECE = 0.92×, Other = 0.85×).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* Content Type: Priority ROI Ranking                        */}
        {/* ======================================================== */}
        {payload.type === "priority" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "12px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Priority Action Evaluated</span>
              <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "2px", color: "var(--text-primary)" }}>{payload.data.skill_name}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", textAlign: "center" }}>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>Skill Deficit</span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--danger)", fontFamily: "monospace" }}>{payload.data.gap}%</span>
              </div>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>Hiring Demand</span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--brand-600)", fontFamily: "monospace" }}>{payload.data.industry_demand.toFixed(1)}/10</span>
              </div>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>Role Criticality</span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--warning)", fontFamily: "monospace" }}>{payload.data.role_importance.toFixed(1)}/10</span>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "10px", fontFamily: "monospace", fontSize: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "var(--text-muted)", fontFamily: "sans-serif", fontSize: "11px", fontWeight: 600 }}>Multi-Criteria ROI Formula:</div>
              <div style={{ color: "var(--brand-600)", fontWeight: 700 }}>Priority Score = (Gap / 100) × Market_Demand × Role_Criticality</div>
              <div style={{ paddingTop: "6px", borderTop: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                Substitution: ({payload.data.gap} / 100) × {payload.data.industry_demand.toFixed(1)} × {payload.data.role_importance.toFixed(1)} ={" "}
                <span style={{ color: "var(--brand-600)", fontWeight: 700 }}>{payload.data.priority_score.toFixed(2)} pts</span>
              </div>
            </div>

            {/* Plain English Variable Glossary */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-primary)" }}>
                <BookOpen size={14} color="var(--brand-600)" />
                <span>Why This Formula Matters</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: "var(--text-secondary)", lineHeight: "1.45" }}>
                <div>
                  <strong style={{ color: "var(--text-primary)" }}>ROI Optimization Principle: </strong>
                  Students have limited study time. Instead of arbitrarily picking topics, this formula maximizes <em>placement probability gained per hour invested</em>.
                </div>
                <div>
                  <strong style={{ color: "var(--brand-600)" }}>Market Hiring Demand (1 – 10): </strong>
                  Reflects the frequency of this skill across active recruiter searches across India.
                </div>
                <div>
                  <strong style={{ color: "var(--warning)" }}>Role Criticality (1 – 10): </strong>
                  Measures whether the skill is a core prerequisite or a bonus nice-to-have for this exact career path.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* Content Type: Overall Readiness                           */}
        {/* ======================================================== */}
        {payload.type === "readiness" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "12px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Target Benchmark</span>
              <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "2px", color: "var(--text-primary)" }}>{payload.data.role_title}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", textAlign: "center" }}>
              <div style={{ padding: "12px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Pre-Factor Composite</span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--brand-600)", fontFamily: "monospace" }}>{payload.data.composite_match.toFixed(1)}%</span>
              </div>
              <div style={{ padding: "12px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>{payload.data.degree_field} Multiplier</span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--warning)", fontFamily: "monospace" }}>×{payload.data.education_factor.toFixed(2)}</span>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "10px", fontFamily: "monospace", fontSize: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "var(--text-muted)", fontFamily: "sans-serif", fontSize: "11px", fontWeight: 600 }}>Deterministic Equation:</div>
              <div style={{ color: "var(--brand-600)", fontWeight: 700 }}>Final Readiness = min(100.0, Composite_Score × Education_Multiplier)</div>
              <div style={{ paddingTop: "6px", borderTop: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                Substitution: min(100.0, {payload.data.composite_match.toFixed(1)} × {payload.data.education_factor.toFixed(2)}) ={" "}
                <span style={{ color: "var(--success)", fontWeight: 700, fontSize: "14px" }}>{Math.round(payload.data.readiness_score)}%</span>
              </div>
            </div>

            {/* Plain English Variable Glossary */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-primary)" }}>
                <BookOpen size={14} color="var(--brand-600)" />
                <span>Plain English Variable Glossary</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: "var(--text-secondary)", lineHeight: "1.45" }}>
                <div>
                  <strong style={{ color: "var(--brand-600)" }}>Composite Match: </strong>
                  The weighted synthesis of verified skills without degree weighting (0.60 × Required + 0.25 × Preferred + 0.15 × Experiential).
                </div>
                <div>
                  <strong style={{ color: "var(--warning)" }}>Education Multiplier ({payload.data.degree_field}): </strong>
                  Multiplicative factor representing curriculum overlap between the student\'s university degree and role requirements.
                </div>
                <div>
                  <strong style={{ color: "var(--success)" }}>Final Readiness Score: </strong>
                  The final placement readiness percentage, clipped at 100.0%, representing direct employment probability.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* Content Type: Gaussian Statistical National Standing       */}
        {/* ======================================================== */}
        {payload.type === "statistical" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "12px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>National Benchmark Cohort</span>
              <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "2px", color: "var(--text-primary)" }}>{payload.data.role_title}</div>
              <div style={{ fontSize: "11px", color: "var(--brand-600)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Users size={12} />
                <span>Benchmarked against {payload.data.cohort_size}</span>
              </div>
            </div>

            {/* 3 Statistical Pillars */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", textAlign: "center" }}>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>Readiness Score (X)</span>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>{Math.round(payload.data.readiness_score)}%</span>
              </div>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>z-Score (Std Units)</span>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--brand-600)", fontFamily: "monospace" }}>+{payload.data.z_score.toFixed(2)}σ</span>
              </div>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>National Percentile</span>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--success)", fontFamily: "monospace" }}>{payload.data.percentile.toFixed(1)}th</span>
              </div>
            </div>

            {/* Mathematical Model Explanation */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "10px", fontFamily: "monospace", fontSize: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "var(--text-muted)", fontFamily: "sans-serif", fontSize: "11px", fontWeight: 600 }}>Gaussian Standard Normal Model:</div>
              <div style={{ color: "var(--brand-600)", fontWeight: 700 }}>z = (Readiness_Score - μ_national) / σ_national</div>
              <div style={{ color: "var(--text-secondary)" }}>
                z = ({payload.data.readiness_score.toFixed(1)} - {payload.data.national_mean.toFixed(1)}) / {payload.data.national_std.toFixed(1)} = <strong style={{ color: "var(--brand-600)" }}>+{payload.data.z_score.toFixed(2)}σ</strong>
              </div>
              <div style={{ paddingTop: "6px", borderTop: "1px solid var(--border-subtle)", color: "var(--violet-accent)", fontWeight: 700 }}>
                Percentile = Φ(z) = (1 / √(2π)) ∫ exp(-t²/2) dt = <strong style={{ color: "var(--success)" }}>{payload.data.percentile.toFixed(1)}%</strong>
              </div>
            </div>

            {/* Plain English Variable Glossary */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-primary)" }}>
                <BookOpen size={14} color="var(--brand-600)" />
                <span>Plain English Statistical Glossary</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: "var(--text-secondary)", lineHeight: "1.45" }}>
                <div>
                  <strong style={{ color: "var(--text-primary)" }}>Population Mean (μ = {payload.data.national_mean.toFixed(1)}%): </strong>
                  The national average readiness score across all accredited engineering universities in India.
                </div>
                <div>
                  <strong style={{ color: "var(--text-primary)" }}>Standard Deviation (σ = {payload.data.national_std.toFixed(1)}%): </strong>
                  The measure of score dispersion across the 1.2M student engineering cohort.
                </div>
                <div>
                  <strong style={{ color: "var(--brand-600)" }}>Standard Score (z = +{payload.data.z_score.toFixed(2)}σ): </strong>
                  Indicates exactly how many standard deviations the candidate ranks above the national average. A positive z confirms above-average standing.
                </div>
                <div>
                  <strong style={{ color: "var(--success)" }}>Cumulative Percentile (Φ(z) = {payload.data.percentile.toFixed(1)}%): </strong>
                  The true proportion of national engineering candidates scoring below this student. An 85th percentile student outperforms 85 out of every 100 peers nationally.
                </div>
              </div>
            </div>

            {/* Tier & Compensation Context */}
            <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>Placement Standing Bracket:</span>
                <strong style={{ color: "var(--success)" }}>{payload.data.placement_tier}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>Calibrated Compensation Expectation:</span>
                <strong style={{ color: "var(--warning)", fontFamily: "monospace" }}>{payload.data.salary_band}</strong>
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: "4px 0 0 0", lineHeight: "1.4" }}>
                <strong>Essence of the Metric: </strong>
                Out of 1.2M engineering students nationally, this candidate\'s verified skills place them ahead of {payload.data.percentile.toFixed(1)}% of peers, qualifying them directly for {payload.data.placement_tier} campus shortlists.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "14px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success)" }}>
            <ShieldCheck size={16} />
            <span>Auditable AICTE / NOS Methodology</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 16px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-sunken)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
