// FILE: src/components/GlobalFooter.tsx
// PURPOSE: Unified national-grade platform footer featuring 4-stakeholder directories, standards badges, DPDP compliance notes, and system telemetry.
// PHASE: 8 | DEPENDS ON: lucide-react | LAST TOUCHED: Phase 8

import React from "react";
import {
  ShieldCheck,
  Cpu,
  GraduationCap,
  Building2,
  MapPin,
  ChevronUp,
  Terminal,
  ExternalLink,
  Lock,
} from "lucide-react";

interface GlobalFooterProps {
  onNavigateToPersona?: (persona: "student" | "institution" | "government" | "employer") => void;
  onReturnToHub?: () => void;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  onNavigateToPersona,
  onReturnToHub,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        backgroundColor: "var(--bg-sunken)",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
        marginTop: "auto",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >

      {/* 2. MAIN DIRECTORY GRID */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "48px 24px 36px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "36px",
        }}
      >
        {/* BRAND & MISSION COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            onClick={onReturnToHub}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: onReturnToHub ? "pointer" : "default",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--brand-600) 0%, var(--violet-accent) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "18px",
                boxShadow: "0 4px 12px rgba(96, 165, 250, 0.35)",
              }}
            >
              प्र
            </div>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 900, letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
                Pravah <span style={{ fontSize: "14px", fontWeight: 700, opacity: 0.85 }}>(प्रवाह)</span>
              </div>
              <div style={{ fontSize: "10px", color: "var(--brand-600)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                National Skill Intelligence
              </div>
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
            India’s unified, deterministic intelligence platform bridging the gap between student competencies, academic curricula, regional economic labor demand, and industry recruitment.
          </p>

          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            National Career &amp; Skill Intelligence Platform
          </div>
        </div>

        {/* COLUMN 1: STUDENTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--brand-600)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <GraduationCap size={14} />
            <span>Students &amp; Job Seekers</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("student")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                Skill Matrix Studio
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("student")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                106 National Target Roles
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("student")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                What-If Skill Bump Simulator
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("student")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                Pedagogical Action Roadmap
              </button>
            </li>
            <li>
              <span style={{ color: "var(--text-muted)" }}>
                Diagnostic Testing Engine (Roadmap)
              </span>
            </li>
          </ul>
        </div>

        {/* COLUMN 2: INSTITUTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#34d399", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <Building2 size={14} />
            <span>Academic Institutions</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("institution")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                5-Department Competency Heatmap
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("institution")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                Syllabus Modernization Tracker
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("institution")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                Placement Eligibility Projections
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("institution")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                AICTE Model Curricula Calibration
              </button>
            </li>
            <li>
              <span style={{ color: "var(--text-muted)" }}>
                DPDP Anonymization Floor (N &lt; 20)
              </span>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: DISTRICT GOVERNANCE & EMPLOYERS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fbbf24", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <MapPin size={14} />
            <span>District &amp; Industry</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("government")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                DSDO Labor Balance (Δ = Demand - Supply)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("government")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                State Training Subsidy Allocator
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("employer")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                Gemini Unstructured JD Parser
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("employer")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                NOS 4-Tier Competency Profiler
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateToPersona && onNavigateToPersona("employer")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
                className="footer-link"
              >
                Vetted Blind Talent Cohort Search
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. BOTTOM BAR: TELEMETRY & COPYRIGHT */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "18px 24px",
          backgroundColor: "var(--bg-base)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            © 2026 <strong>Pravah (प्रवाह)</strong> · National Career &amp; Skill Intelligence Platform. v1.0.0 (Release Candidate).
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Terminal size={12} />
              <span>Interactive API Docs</span>
              <ExternalLink size={10} style={{ opacity: 0.6 }} />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="interactive-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <span>Back to Top</span>
              <ChevronUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
