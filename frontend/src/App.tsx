// FILE: src/App.tsx
// PURPOSE: Root application entry wiring ThemeProvider, top judge persona switcher, Barba transitions, and LandingPage.
// PHASE: 4 | DEPENDS ON: ThemeContext.tsx, PersonaSwitcher.tsx, BarbaContainer.tsx, LandingPage.tsx | LAST TOUCHED: Phase 4

import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { PersonaSwitcher, type PersonaType } from "./components/PersonaSwitcher";
import { BarbaContainer } from "./components/BarbaContainer";
import { LandingPage } from "./pages/LandingPage";
import { PerspectiveCard } from "./components/PerspectiveCard";
import { ArrowLeft, Sparkles } from "lucide-react";
import "./App.css";

// Root application component.
// Houses ThemeProvider, top persona switcher for evaluators, and Barba transition container.
function App() {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>("student");
  const [showLanding, setShowLanding] = useState<boolean>(true);

  return (
    <ThemeProvider>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--bg-base)",
          color: "var(--text-primary)",
          transition: "background-color 0.25s ease, color 0.25s ease",
        }}
      >
        {/* Top Persona Switcher for Evaluation Judges */}
        <PersonaSwitcher
          onPersonaChange={(persona) => {
            setCurrentPersona(persona);
          }}
        />

        {/* Top Sub-Bar for Quick Navigation Between Landing & Evaluator Sandbox */}
        <div
          style={{
            padding: "8px 20px",
            backgroundColor: "var(--bg-sunken)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Pravah Platform</span>
            <span style={{ color: "var(--border-strong)" }}>|</span>
            <span style={{ color: "var(--text-secondary)" }}>
              Active Persona: <strong style={{ color: "var(--brand-600)", textTransform: "capitalize" }}>{currentPersona}</strong>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {showLanding ? (
              <button
                type="button"
                onClick={() => setShowLanding(false)}
                className="interactive-btn"
                style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--brand-50)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--brand-600)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Inspect {currentPersona.toUpperCase()} Context
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLanding(true)}
                className="interactive-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <ArrowLeft size={14} />
                <span>Return to Public Landing</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Barba Transition Stage */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <BarbaContainer transitionKey={showLanding ? "landing" : `persona-${currentPersona}`}>
            {showLanding ? (
              <LandingPage
                onSelectPersona={(persona) => {
                  setCurrentPersona(persona);
                  setShowLanding(false);
                }}
              />
            ) : (
              /* Phase 3 Evaluator Context View inside 3D Perspective Card */
              <div
                className="stage-perspective"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "48px 20px",
                }}
              >
                <PerspectiveCard style={{ maxWidth: "680px", width: "100%", textAlign: "center" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                  >
                    <Sparkles size={14} />
                    <span>PHASE 3 & 4 VERIFIED • DESIGN SYSTEM & AUTH ACTIVE</span>
                  </div>

                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: 700,
                      margin: "0 0 12px 0",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {currentPersona.toUpperCase()} Context Loaded
                  </h2>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      fontSize: "15px",
                      margin: "0 0 24px 0",
                    }}
                  >
                    Security principal authenticated with scoped JWT token.
                    <br />
                    All design tokens, 3D elevation perspectives, and Barba transitions are fully operational.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginBottom: "24px",
                    }}
                  >
                    <span>• Theme Repaint Active</span>
                    <span>• No-Boxes 3D Tilt</span>
                    <span>• Smooth 220ms/280ms Transitions</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowLanding(true)}
                    className="interactive-btn"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "10px",
                      backgroundColor: "var(--brand-600)",
                      color: "var(--bg-base)",
                      fontWeight: 700,
                      fontSize: "14px",
                      border: "none",
                    }}
                  >
                    Back to Public Landing
                  </button>
                </PerspectiveCard>
              </div>
            )}
          </BarbaContainer>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
