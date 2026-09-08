// FILE: src/pages/LandingPage.tsx
// PURPOSE: Enhanced public landing page featuring national problem statement, 4-stakeholder portal hub, live KPI metrics, deterministic math engine showcase, and DPDP compliance.
// PHASE: 8 | DEPENDS ON: ThemeContext.tsx, PerspectiveCard.tsx, ThemeSelector.tsx, lucide-react, motion/react | LAST TOUCHED: Phase 8

import React, { useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { PerspectiveCard } from "../components/PerspectiveCard";
import type { PersonaType } from "../components/PersonaSwitcher";
import {
  GraduationCap,
  Building2,
  MapPin,
  Briefcase,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Award,
  TrendingUp,
  BarChart3,
  BookOpen,
  Cpu,
  ExternalLink,
} from "lucide-react";

interface LandingPageProps {
  onSelectPersona?: (persona: PersonaType) => void;
  onInstantDemoStudent?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPersona,
  onInstantDemoStudent,
}) => {
  const { theme } = useTheme();

  // Interactive formula simulation sandbox state
  const [interactiveRating, setInteractiveRating] = useState<number>(75);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("Computer Science");
  const [hasCriticalSkill, setHasCriticalSkill] = useState<boolean>(true);

  // Compute live sandbox score based on exact formula
  const benchmarkReq = 85;
  const cappedRating = Math.min(interactiveRating, benchmarkReq);
  const rawScore = (cappedRating / benchmarkReq) * 100;
  const criticalPenalty = hasCriticalSkill ? 1.0 : 0.5;
  const disciplineFactor =
    selectedDiscipline === "Computer Science"
      ? 1.0
      : selectedDiscipline === "Information Technology"
      ? 0.95
      : selectedDiscipline === "Electronics"
      ? 0.9
      : 0.85;
  const simulatedFinalScore = (rawScore * criticalPenalty * disciplineFactor).toFixed(1);

  const mathInvariants = [
    {
      index: "01",
      title: "Overqualification Capping",
      formula: "min(R_i, B_i)",
      desc: "Excess points in auxiliary or over-practiced skills cannot artificially mask critical gaps in fundamental prerequisites.",
    },
    {
      index: "02",
      title: "Critical Prerequisite Penalty Floor",
      formula: "P_crit = 0.50 (if missing)",
      desc: "Lacking non-negotiable core competencies (e.g. Docker for DevOps) immediately halves overall readiness, preventing misleading high scores.",
    },
    {
      index: "03",
      title: "4-Tier Semantic Weights",
      formula: "W = {1.00, 0.75, 0.45, 0.20}",
      desc: "Critical (1.00), Core (0.75), Supporting (0.45), and Peripheral (0.20) competency tiers prevent soft skills from outweighing technical rigor.",
    },
    {
      index: "04",
      title: "Pedagogical Study Hours Formula",
      formula: "H_i = round(Gap_i × 1.5 × μ_i)",
      desc: "Realistic remedial hours calibrated against AICTE credit frameworks, giving students realistic sprint horizons instead of arbitrary guesses.",
    },
  ];

  const nationalKPIs = [
    {
      value: "106",
      label: "Standardized Occupations",
      desc: "NCO-2015 & NOS catalog across 6 technical domains",
      icon: <Layers size={20} color="#3b82f6" />,
    },
    {
      value: "0.0%",
      label: "Hallucination Variance",
      desc: "Closed-form deterministic linear algebraic scoring",
      icon: <CheckCircle2 size={20} color="#10b981" />,
    },
    {
      value: "N ≥ 20",
      label: "DPDP Privacy Floor",
      desc: "Small cohorts automatically blended with regional baselines",
      icon: <ShieldCheck size={20} color="#8b5cf6" />,
    },
    {
      value: "4-Way",
      label: "Stakeholder Alignment",
      desc: "Students, Academic Colleges, State DSDOs, and Employers",
      icon: <TrendingUp size={20} color="#f59e0b" />,
    },
  ];

  return (
    <div className="landing-stage stage-perspective" style={{ width: "100%", paddingBottom: "40px" }}>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: "56px 24px 44px 24px",
          maxWidth: "1280px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Typographic Eyebrow */}
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--brand-600)",
            marginBottom: "16px",
          }}
        >
          National Career &amp; Skill Intelligence Platform
        </div>

        {/* Headline */}
        <h1
          className="hero-headline"
          style={{
            fontSize: "48px",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
            color: "var(--text-primary)",
            maxWidth: "920px",
            margin: "0 0 20px 0",
          }}
        >
          Closing India's Career-Readiness Gap With{" "}
          <span
            style={{
              background: "var(--gradient-brand)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pure Deterministic Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.65,
            color: "var(--text-secondary)",
            maxWidth: "760px",
            margin: "0 0 36px 0",
          }}
        >
          A four-sided intelligence grid connecting <strong>Students</strong>,{" "}
          <strong>Higher Education Institutions</strong>, <strong>District Administrations</strong>, and{" "}
          <strong>Industry Employers</strong> with zero-hallucination mathematical scoring and verifiable
          career pathways.
        </p>

        {/* Primary Call-to-Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <motion.a
            href="#portals"
            className="interactive-btn"
            whileHover={{ y: -3, rotateX: 1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.16 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px",
              borderRadius: "12px",
              backgroundColor: "var(--brand-600)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "16px",
              textDecoration: "none",
              boxShadow: "var(--shadow-elevation)",
              cursor: "pointer",
            }}
          >
            <span>Explore 4 Stakeholder Portals</span>
            <ArrowRight size={18} />
          </motion.a>

          {onInstantDemoStudent && (
            <motion.button
              type="button"
              className="interactive-btn"
              onClick={onInstantDemoStudent}
              whileHover={{ y: -3, rotateX: 1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 24px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-strong)",
                fontWeight: 700,
                fontSize: "15px",
                boxShadow: "var(--shadow-elevation)",
                cursor: "pointer",
              }}
            >
              <Sparkles size={16} color="var(--brand-600)" />
              <span>1-Click Student Instant Demo</span>
            </motion.button>
          )}
        </div>

        {/* National KPI Counter Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "16px",
            width: "100%",
            maxWidth: "1200px",
            marginTop: "12px",
          }}
        >
          {nationalKPIs.map((kpi, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "14px",
                padding: "18px 20px",
                textAlign: "left",
                boxShadow: "var(--shadow-elevation)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {kpi.value}
                </span>
                <div
                  style={{
                    padding: "6px",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-sunken)",
                  }}
                >
                  {kpi.icon}
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {kpi.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE FOUR STAKEHOLDER PORTALS (PRIMARY ENTRY POINTS) */}
      {/* ========================================================================= */}
      <section
        id="portals"
        style={{
          maxWidth: "1280px",
          margin: "0 auto 64px auto",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--brand-600)",
              marginBottom: "8px",
            }}
          >
            Stakeholder Portals
          </div>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.8px",
              margin: "0 0 10px 0",
            }}
          >
            Four Dedicated Stakeholder Portals
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", maxWidth: "680px", margin: "0 auto" }}>
            Each stakeholder operates within an isolated, purpose-built terminal. Transitions between portals are securely
            managed from this hub. Select a portal below to begin.
          </p>
        </div>

        <div
          className="stakeholder-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Card 1: Student Career Canvas */}
          <PerspectiveCard
            onClick={() => onSelectPersona && onSelectPersona("student")}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "28px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(59, 130, 246, 0.12)",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <GraduationCap size={24} />
            </div>

            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
              Student Career Canvas
            </h3>
            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-secondary)", flex: 1, margin: "0 0 20px 0" }}>
              Individualized competency profiling across 106 standardized industry roles, 4-tier gap diagnosis, transparent
              LaTeX mathematical proof inspector, and interactive what-if skill bump simulations.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
                marginBottom: "20px",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#3b82f6" />
                <span>106 Standardized Roles Directory</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#3b82f6" />
                <span>Interactive What-If Bump Simulator</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#3b82f6" />
                <span>Personalized Learning Milestones</span>
              </div>
            </div>

            <motion.button
              type="button"
              className="interactive-btn"
              whileHover={{ y: -3, rotateX: 1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <span>Enter Student Portal</span>
              <ArrowRight size={15} />
            </motion.button>
          </PerspectiveCard>

          {/* Card 2: Academic Institution Portal */}
          <PerspectiveCard
            onClick={() => onSelectPersona && onSelectPersona("institution")}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "28px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(139, 92, 246, 0.12)",
                color: "#8b5cf6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <Building2 size={24} />
            </div>

            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
              Academic Institution Portal
            </h3>
            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-secondary)", flex: 1, margin: "0 0 20px 0" }}>
              5-department cohort competency heatmaps (CSE, IT, ECE, Mech, Civil), dynamic syllabus modernization status flip
              engine, placement eligibility tiers, and DPDP under-20 privacy floor blending.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
                marginBottom: "20px",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#8b5cf6" />
                <span>5-Department Competency Heatmaps</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#8b5cf6" />
                <span>Dynamic Syllabus Status Flip Engine</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#8b5cf6" />
                <span>DPDP N &lt; 20 Privacy Floor Blending</span>
              </div>
            </div>

            <motion.button
              type="button"
              className="interactive-btn"
              whileHover={{ y: -3, rotateX: 1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: "#8b5cf6",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <span>Enter Institution Portal</span>
              <ArrowRight size={15} />
            </motion.button>
          </PerspectiveCard>

          {/* Card 3: District Planning Portal (DSDO) */}
          <PerspectiveCard
            onClick={() => onSelectPersona && onSelectPersona("government")}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "28px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(245, 158, 11, 0.12)",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <MapPin size={24} />
            </div>

            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
              District Planning Portal
            </h3>
            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-secondary)", flex: 1, margin: "0 0 20px 0" }}>
              Regional labor supply vs. demand deficit matrices across 5 economic sectors, net shortage alarm meters, and state
              training subsidy allocation engine with projected placement ROI.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
                marginBottom: "20px",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#f59e0b" />
                <span>5-Sector Labor Deficit Matrix</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#f59e0b" />
                <span>Net Shortage Alarms (Δ = Demand - Supply)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#f59e0b" />
                <span>Targeted Subsidy Grant Allocator</span>
              </div>
            </div>

            <motion.button
              type="button"
              className="interactive-btn"
              whileHover={{ y: -3, rotateX: 1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: "#f59e0b",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <span>Enter District Portal</span>
              <ArrowRight size={15} />
            </motion.button>
          </PerspectiveCard>

          {/* Card 4: Industry Hiring Portal */}
          <PerspectiveCard
            onClick={() => onSelectPersona && onSelectPersona("employer")}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "28px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <Briefcase size={24} />
            </div>

            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
              Industry Hiring Portal
            </h3>
            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-secondary)", flex: 1, margin: "0 0 20px 0" }}>
              Extract structured 4-tier requirement profiles from unstructured job postings via Gemini NLP (with deterministic
              NOS offline fallback) and discover verified blind student talent cohorts.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
                marginBottom: "20px",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>Unstructured JD NLP Entity Extractor</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>Vetted Blind Candidate Cohorts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>Candidate Shortlisting & Drawer</span>
              </div>
            </div>

            <motion.button
              type="button"
              className="interactive-btn"
              whileHover={{ y: -3, rotateX: 1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: "#10b981",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <span>Enter Employer Portal</span>
              <ArrowRight size={15} />
            </motion.button>
          </PerspectiveCard>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE NATIONAL PARADOX (PROBLEM STATEMENT) */}
      {/* ========================================================================= */}
      <section
        id="problem"
        style={{
          maxWidth: "1280px",
          margin: "0 auto 64px auto",
          padding: "0 24px",
        }}
      >
        <PerspectiveCard style={{ padding: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <AlertTriangle size={24} color="#f59e0b" />
            <h2 style={{ fontSize: "24px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              The National Paradox: Why 55%+ Engineering Graduates Are Unemployed
            </h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.65, margin: "0 0 28px 0" }}>
            India is home to the world's largest technical talent pool, yet both employers and state governments face severe
            talent shortages. This is not a failure of student capability—it is a structural failure of information feedback.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--danger)", marginBottom: "8px" }}>
                1. The 4-Year Academic Delay
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                Colleges update syllabi every 4 to 6 years through bureaucratic university boards. When employers shift from
                monolithic Java to Cloud Microservices, colleges discover this gap on campus placement day—too late for students.
              </p>
            </div>

            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--warning)", marginBottom: "8px" }}>
                2. Hallucinatory AI & Opaque ATS
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                Existing recruitment platforms use black-box LLMs that hallucinate scores with ±20% variance on identical prompts,
                or rigid keyword ATS that reject qualified candidates simply for lacking exact buzzword phrasing.
              </p>
            </div>

            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#3b82f6", marginBottom: "8px" }}>
                3. Regional Planning Blindspots
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                District Skill Development Officers lack visibility into localized corporate hiring demand versus student output,
                leading to crores of rupees wasted on generic training programs with zero local placement.
              </p>
            </div>
          </div>
        </PerspectiveCard>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE DETERMINISTIC MATHEMATICAL ENGINE */}
      {/* ========================================================================= */}
      <section
        id="engine"
        style={{
          maxWidth: "1280px",
          margin: "0 auto 64px auto",
          padding: "0 24px",
        }}
      >
        <PerspectiveCard style={{ padding: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--brand-600)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                }}
              >
                Mathematical Integrity
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                The Deterministic Scoring Equation
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--brand-600)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <Calculator size={15} />
              <span>Pure Closed-Form Linear Algebra</span>
            </div>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.65, margin: "0 0 24px 0" }}>
            Every score in Pravah is calculated through rigorous closed-form equations calibrated against National Occupational
            Standards (NOS-2015) and AICTE Model Curricula.
          </p>

          {/* LaTeX Formula Highlight Card */}
          <div
            style={{
              padding: "24px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-sunken)",
              border: "1px solid var(--border-strong)",
              textAlign: "center",
              marginBottom: "32px",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--brand-600)",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              S_readiness = [ Σ (w_i × min(R_i, B_i)) / Σ (w_i × B_i) ] × P_critical × E_degree
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Where w_i = Tier Weight, R_i = Student Rating, B_i = Benchmark Level, P_critical = Prerequisite Penalty, E_degree = Degree Alignment
            </div>
          </div>

          {/* The 4 Invariants Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {mathInvariants.map((inv, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand-600)", letterSpacing: "0.05em" }}>
                    INVARIANT {inv.index}
                  </span>
                  <code style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 600 }}>{inv.formula}</code>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                  {inv.title}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.45 }}>{inv.desc}</div>
              </div>
            ))}
          </div>

          {/* Interactive Calculation Sandbox */}
          <div
            style={{
              padding: "24px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-sunken)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Sliders size={18} color="var(--brand-600)" />
              <h4 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                Live Formula Simulator: Test the Deterministic Invariants
              </h4>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                alignItems: "center",
              }}
            >
              {/* Slider Input */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Student Skill Rating (R_i): <strong>{interactiveRating} / 100</strong> (Req: 85)
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={interactiveRating}
                  onChange={(e) => setInteractiveRating(parseInt(e.target.value, 10))}
                  style={{ width: "100%", accentColor: "var(--brand-600)", cursor: "pointer" }}
                />
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Notice: Ratings above 85 are automatically capped to prevent overqualification distortion.
                </span>
              </div>

              {/* Degree Factor */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Degree Discipline (E_degree):
                </label>
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  className="interactive-input"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-strong)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                  }}
                >
                  <option value="Computer Science">Computer Science (1.00)</option>
                  <option value="Information Technology">Information Technology (0.95)</option>
                  <option value="Electronics">Electronics & Comm (0.90)</option>
                  <option value="Other STEM">Other STEM (0.85)</option>
                </select>
              </div>

              {/* Critical Prerequisite Checkbox */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={hasCriticalSkill}
                    onChange={(e) => setHasCriticalSkill(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--brand-600)" }}
                  />
                  <span>Has Critical Prerequisite</span>
                </label>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                  Unchecking triggers non-negotiable 0.50 penalty floor.
                </span>
              </div>

              {/* Live Computed Output */}
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--brand-600)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand-600)", textTransform: "uppercase" }}>
                  Simulated Score
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {simulatedFinalScore}%
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Capped: {cappedRating}/85 | Penalty: {criticalPenalty.toFixed(2)} | Factor: {disciplineFactor.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </PerspectiveCard>
      </section>

      {/* ========================================================================= */}
      {/* 5. DPDP COMPLIANCE & NATIONAL STANDARDS */}
      {/* ========================================================================= */}
      <section
        id="compliance"
        style={{
          maxWidth: "1280px",
          margin: "0 auto 64px auto",
          padding: "0 24px",
        }}
      >
        <PerspectiveCard style={{ padding: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Lock size={22} color="#10b981" />
            <h2 style={{ fontSize: "24px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              Data Protection & Compliance Architecture
            </h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.65, margin: "0 0 24px 0" }}>
            Pravah is engineered from the ground up to comply with India's Digital Personal Data Protection (DPDP) Act 2023
            and AICTE / NBA accreditation standards.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <ShieldCheck size={18} color="#10b981" />
                <h4 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  DPDP Under-20 Privacy Floor
                </h4>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                In classes with fewer than 20 students, displaying individual average scores creates deanonymization risks.
                Pravah automatically detects N &lt; 20 and blends cohort distributions with regional baselines to safeguard
                student confidentiality.
              </p>
            </div>

            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Award size={18} color="#8b5cf6" />
                <h4 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Bias-Free Blind Talent Search
                </h4>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                Recruiters discover candidates by verified mathematical percentiles and skill tags under masked IDs (e.g. CAND-8942).
                Direct personal identifiable information (name, gender, personal email) is strictly hidden until the candidate
                accepts an interview request.
              </p>
            </div>

            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <BookOpen size={18} color="#3b82f6" />
                <h4 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  AICTE / NBA Accreditation Dossiers
                </h4>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                Every curriculum gap audit and modernization action produces timestamped mathematical records for direct export into
                NBA Criteria 2 &amp; 3 accreditation portfolios, eliminating manual survey guesswork.
              </p>
            </div>
          </div>
        </PerspectiveCard>
      </section>
    </div>
  );
};
