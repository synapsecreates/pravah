// FILE: src/components/GlobalHeader.tsx
// PURPOSE: Unified global application header with branding, global theme switcher, offline indicator, and strict hub-and-spoke portal navigation.
// PHASE: 8 | DEPENDS ON: ThemeSelector.tsx, ThemeContext.tsx, lucide-react, motion/react | LAST TOUCHED: Phase 8

import React from "react";
import { motion } from "motion/react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import type { PersonaType } from "./PersonaSwitcher";
import {
  ArrowLeft,
  GraduationCap,
  Building2,
  MapPin,
  Briefcase,
  Sparkles,
} from "lucide-react";

interface GlobalHeaderProps {
  showLanding: boolean;
  currentPersona: PersonaType;
  onReturnToHub: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  onSwitchPersona?: (persona: PersonaType) => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  showLanding,
  currentPersona,
  onReturnToHub,
  onNavigateToSection,
  onSwitchPersona,
}) => {
  const getPersonaBadge = () => {
    switch (currentPersona) {
      case "student":
        return {
          icon: <GraduationCap size={15} />,
          title: "Student Career Canvas",
          subtitle: "106 Occupations Directory",
          color: "#3b82f6",
          bgColor: "rgba(59, 130, 246, 0.12)",
        };
      case "institution":
        return {
          icon: <Building2 size={15} />,
          title: "Academic Institution Portal",
          subtitle: "Guru Ghasidas Vishwavidyalaya · AICTE Aligned",
          color: "#8b5cf6",
          bgColor: "rgba(139, 92, 246, 0.12)",
        };
      case "government":
        return {
          icon: <MapPin size={15} />,
          title: "District Planning Portal",
          subtitle: "Bilaspur DSDO · 5-Sector Deficit Matrix",
          color: "#f59e0b",
          bgColor: "rgba(245, 158, 11, 0.12)",
        };
      case "employer":
        return {
          icon: <Briefcase size={15} />,
          title: "Industry Hiring Portal",
          subtitle: "Gemini JD Parser · Vetted Blind Cohorts",
          color: "#10b981",
          bgColor: "rgba(16, 185, 129, 0.12)",
        };
      default:
        return {
          icon: <Sparkles size={15} />,
          title: "Platform Context",
          subtitle: "Deterministic Intelligence",
          color: "var(--brand-600)",
          bgColor: "var(--brand-50)",
        };
    }
  };

  const personaInfo = getPersonaBadge();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Left Section: Brand Logo & Navigation or Return to Hub */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* Logo & Platform Name */}
          <div
            onClick={onReturnToHub}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              userSelect: "none",
            }}
            title="Pravah (प्रवाह) - Return to Main Landing Page"
          >
            {/* National Emblem Lotus Symbol */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--gradient-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "18px",
                boxShadow: "0 4px 12px rgba(96, 165, 250, 0.35)",
              }}
            >
              प्र
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "19px",
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                    color: "var(--text-primary)",
                  }}
                >
                  Pravah
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    letterSpacing: "0.5px",
                  }}
                >
                  (प्रवाह)
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.2px",
                }}
              >
                National Career & Skill Intelligence Platform
              </div>
            </div>
          </div>

          {/* Contextual Divider & Portal Navigation */}
          {!showLanding ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ color: "var(--border-strong)", fontSize: "18px" }}>|</span>
              {/* PRIMARY RETURN TO HUB BUTTON */}
              <motion.button
                type="button"
                onClick={onReturnToHub}
                whileHover={{ y: -3, rotateX: 1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="interactive-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "var(--brand-50)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--brand-600)",
                  fontSize: "12px",
                  fontWeight: 700,
                  boxShadow: "var(--shadow-elevation)",
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={14} />
                <span>Return to Portals Hub</span>
              </motion.button>

              {/* Active Portal Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  backgroundColor: personaInfo.bgColor,
                  border: `1px solid ${personaInfo.color}40`,
                  color: personaInfo.color,
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {personaInfo.icon}
                <span>{personaInfo.title}</span>
              </div>

              {/* Quick Persona Switcher for Evaluators & Judges */}
              {onSwitchPersona && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <select
                    value={currentPersona}
                    onChange={(e) => onSwitchPersona(e.target.value as PersonaType)}
                    aria-label="Switch stakeholder portal"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: "var(--bg-sunken)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="student">Student Portal</option>
                    <option value="institution">Institution Portal</option>
                    <option value="government">District Portal</option>
                    <option value="employer">Employer Portal</option>
                  </select>
                </div>
              )}
            </div>
          ) : (
            /* Navigation Anchor Links on Landing Page */
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                marginLeft: "8px",
              }}
              className="landing-nav-links"
            >
              <span style={{ color: "var(--border-strong)", fontSize: "18px" }}>|</span>
              <a
                href="#portals"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToSection && onNavigateToSection("portals");
                }}
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-600)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                4 Portals Hub
              </a>
              <a
                href="#problem"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToSection && onNavigateToSection("problem");
                }}
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-600)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                National Paradox
              </a>
              <a
                href="#engine"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToSection && onNavigateToSection("engine");
                }}
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-600)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                Deterministic Math
              </a>
              <a
                href="#compliance"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToSection && onNavigateToSection("compliance");
                }}
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-600)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                DPDP & Compliance
              </a>
            </nav>
          )}
        </div>

        {/* Right Section: Theme Toggle Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
};
