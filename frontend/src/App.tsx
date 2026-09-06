// FILE: src/App.tsx
// PURPOSE: Root application entry rendering top judge persona switcher and clean baseline stage.
// PHASE: 3 | DEPENDS ON: PersonaSwitcher.tsx | LAST TOUCHED: Phase 3

import { useState } from "react";
import { PersonaSwitcher, type PersonaType } from "./components/PersonaSwitcher";
import "./App.css";

// Root application component.
// Houses the top multi-persona evaluation switcher and status indicator.
function App() {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>("student");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0b1020", color: "#f1f5f9" }}>
      {/* Top Persona Switcher for Judges */}
      <PersonaSwitcher
        onPersonaChange={(persona) => {
          setCurrentPersona(persona);
        }}
      />

      {/* Main Stage Placeholder (Phase 3 Baseline) */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            padding: "36px",
            borderRadius: "16px",
            backgroundColor: "#131a30",
            border: "1px solid #232c48",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: "20px",
              backgroundColor: "#1e3a8a33",
              color: "#60a5fa",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            PHASE 3 ACTIVE: AUTH & PERSISTENCE
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
            Pravah Multi-Stakeholder Intelligence
          </h1>

          <p style={{ color: "#b6c0d4", lineHeight: 1.6, fontSize: "15px", margin: "0 0 24px 0" }}>
            Current Active Security Context:{" "}
            <strong style={{ color: "#60a5fa", textTransform: "capitalize" }}>
              {currentPersona}
            </strong>
            <br />
            JWT tokens, database tables, and scoped permissions are active.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              fontSize: "13px",
              color: "#8a94a8",
            }}
          >
            <span>• Student Profile DB Active</span>
            <span>• DPDP Privacy Boundary Active</span>
            <span>• Employer Blind Sourcing Active</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
