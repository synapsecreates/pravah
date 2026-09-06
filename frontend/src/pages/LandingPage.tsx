// FILE: src/pages/LandingPage.tsx
// PURPOSE: Public landing page showcasing Pravah's 4-stakeholder intelligence, mathematical invariants, and interactive theme sandbox.
// PHASE: 4 | DEPENDS ON: ThemeContext.tsx, PerspectiveCard.tsx, ThemeSelector.tsx | LAST TOUCHED: Phase 4

import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { ThemeSelector } from "../components/ThemeSelector";
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
} from "lucide-react";

interface LandingPageProps {
  onSelectPersona?: (persona: PersonaType) => void;
}

// LandingPage renders the public face of Pravah.
// Combines 3D perspective cards, dynamic theme tokens, and tactile micro-animations.
export const LandingPage: React.FC<LandingPageProps> = ({ onSelectPersona }) => {
  const { theme } = useTheme();
  const [sliderVal, setSliderVal] = useState<number>(75);
  const [activeTab, setActiveTab] = useState<number>(0);

  const mathInvariants = [
    {
      title: "Overqualification Capping",
      formula: "min(s_i, r_i)",
      desc: "Excess points in auxiliary skills cannot artificially inflate overall job readiness.",
    },
    {
      title: "Critical Prerequisite Floor",
      formula: "P_crit = 0.75 + 0.25 × (met / total)",
      desc: "Missing mandatory foundation skills penalizes the total score by up to 25%.",
    },
    {
      title: "4-Tier Semantic Weights",
      formula: "W = {1.00, 0.75, 0.45, 0.20}",
      desc: "Critical, Core, Supporting, and Complementary competencies have explicit fixed weights.",
    },
    {
      title: "Pedagogical Study Hours",
      formula: "H = round(Gap × 1.5 × μ)",
      desc: "Effort estimation based on verified curriculum benchmarks, not arbitrary guesses.",
    },
  ];

  return (
    <div className="landing-stage stage-perspective" style={{ width: "100%", paddingBottom: "60px" }}>
      {/* 1. Hero Section */}
      <section
        style={{
          padding: "56px 24px 40px 24px",
          maxWidth: "1160px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* National Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "30px",
            backgroundColor: "var(--brand-50)",
            border: "1px solid var(--border-strong)",
            color: "var(--brand-600)",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            marginBottom: "20px",
          }}
        >
          <Sparkles size={15} />
          <span>प्रवाह • NATIONAL SKILL INTELLIGENCE ENGINE</span>
        </div>

        {/* Headline */}
        <h1
          className="hero-headline"
          style={{
            fontSize: "44px",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-1.2px",
            color: "var(--text-primary)",
            maxWidth: "840px",
            margin: "0 0 16px 0",
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
            fontSize: "17px",
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: "680px",
            margin: "0 0 32px 0",
          }}
        >
          A unified, privacy-first platform connecting <strong>Students</strong>,{" "}
          <strong>Universities</strong>, <strong>District Administrations</strong>, and{" "}
          <strong>Industry Leaders</strong> with zero-randomness skill calculations and verifiable
          learning trajectories.
        </p>

        {/* Hero Actions & Theme Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <button
            type="button"
            className="interactive-btn"
            onClick={() => onSelectPersona && onSelectPersona("student")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "12px",
              backgroundColor: "var(--brand-600)",
              color: theme === "paper" ? "#ffffff" : "#0b1020",
              fontWeight: 700,
              fontSize: "15px",
              border: "none",
              boxShadow: "var(--shadow-elevation)",
            }}
          >
            <span>Explore As Student</span>
            <ArrowRight size={17} />
          </button>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>
              Theme:
            </span>
            <ThemeSelector />
          </div>
        </div>
      </section>

      {/* 2. Four Stakeholder Perspective Cards */}
      <section
        style={{
          maxWidth: "1160px",
          margin: "0 auto 56px auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
              margin: "0 0 8px 0",
            }}
          >
            One Architecture, Four Stakeholder Perspectives
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
            Anti-box 3D elevation cards designed for tactile clarity and zero visual clutter.
          </p>
        </div>

        <div
          className="stakeholder-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Card 1: Student */}
          <PerspectiveCard
            onClick={() => onSelectPersona && onSelectPersona("student")}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "var(--brand-50)",
                color: "var(--brand-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <GraduationCap size={24} />
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 8px 0",
              }}
            >
              Student Journey
            </h3>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.55,
                color: "var(--text-secondary)",
                flex: 1,
                margin: "0 0 16px 0",
              }}
            >
              Continuous self-diagnosis, 4-tier gap visualization, readiness simulation, and
              realistic study hour roadmaps.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--brand-600)",
              }}
            >
              <span>Explore Student Canvas</span>
              <ArrowRight size={14} />
            </div>
          </PerspectiveCard>

          {/* Card 2: University */}
          <PerspectiveCard
            onClick={() => onSelectPersona && onSelectPersona("institution")}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "var(--brand-50)",
                color: "var(--brand-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Building2 size={24} />
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 8px 0",
              }}
            >
              Academic Institution
            </h3>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.55,
                color: "var(--text-secondary)",
                flex: 1,
                margin: "0 0 16px 0",
              }}
            >
              Departmental curriculum audits, 3-state course flags (Aligned, At Risk, Obsolete),
              and cohort aggregations with DPDP privacy shields.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--brand-600)",
              }}
            >
              <span>Audit Curricula</span>
              <ArrowRight size={14} />
            </div>
          </PerspectiveCard>

          {/* Card 3: District */}
          <PerspectiveCard
            onClick={() => onSelectPersona && onSelectPersona("government")}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "var(--brand-50)",
                color: "var(--brand-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <MapPin size={24} />
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 8px 0",
              }}
            >
              District DSDO
            </h3>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.55,
                color: "var(--text-secondary)",
                flex: 1,
                margin: "0 0 16px 0",
              }}
            >
              District Skill Development Officers monitor live supply vs demand balances across 5
              key economic sectors to target subsidies.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--brand-600)",
              }}
            >
              <span>View Regional Balances</span>
              <ArrowRight size={14} />
            </div>
          </PerspectiveCard>

          {/* Card 4: Employer */}
          <PerspectiveCard
            onClick={() => onSelectPersona && onSelectPersona("employer")}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "var(--brand-50)",
                color: "var(--brand-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Briefcase size={24} />
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 8px 0",
              }}
            >
              Industry Employer
            </h3>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.55,
                color: "var(--text-secondary)",
                flex: 1,
                margin: "0 0 16px 0",
              }}
            >
              106 standard industry roles, Gemini JD parsing with fallback, and blind merit-first
              candidate discovery.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--brand-600)",
              }}
            >
              <span>Search Qualified Talent</span>
              <ArrowRight size={14} />
            </div>
          </PerspectiveCard>
        </div>
      </section>

      {/* 3. Mathematical Foundations & Micro-Animations Showcase */}
      <section
        style={{
          maxWidth: "1160px",
          margin: "0 auto 56px auto",
          padding: "0 24px",
        }}
      >
        <PerspectiveCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <Calculator size={22} color="var(--brand-600)" />
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Transparent Calculation Invariants
            </h2>
          </div>

          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            Every readiness score, curriculum flag, and regional gap is computed by pure
            deterministic functions. Zero neural hallucination, zero black-box weights.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {mathInvariants.map((inv, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  {inv.title}
                </div>
                <code
                  style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--brand-600)",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    marginBottom: "8px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {inv.formula}
                </code>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {inv.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Micro-Interaction Tester (Buttons and Sliders) */}
          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-sunken)",
              border: "1px solid var(--border-strong)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sliders size={18} color="var(--brand-600)" />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                  Micro-Animation & Tactile Feel Tester
                </span>
              </div>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Tactile slider response: <strong>{sliderVal}%</strong>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: "var(--brand-600)",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  minWidth: "48px",
                  textAlign: "center",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--brand-600)",
                }}
              >
                {sliderVal}%
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Linear Smooth", "4-Tier Threshold", "DPDP Shield", "Zero Jitter"].map(
                (tab, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className="interactive-btn"
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border:
                        activeTab === idx
                          ? "1px solid var(--brand-600)"
                          : "1px solid var(--border-subtle)",
                      backgroundColor:
                        activeTab === idx ? "var(--brand-50)" : "var(--bg-surface)",
                      color: activeTab === idx ? "var(--brand-600)" : "var(--text-secondary)",
                    }}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>
        </PerspectiveCard>
      </section>

      {/* 4. Footer & Trust Credentials */}
      <footer
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          padding: "32px 24px 0 24px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldCheck size={16} color="var(--success)" />
          <span>
            Pravah • Strictly adhering to DPDP 2023 privacy guidelines & AICTE curriculum standards.
          </span>
        </div>
        <div>Active Theme Mode: <strong style={{ color: "var(--text-primary)", textTransform: "capitalize" }}>{theme}</strong></div>
      </footer>
    </div>
  );
};
