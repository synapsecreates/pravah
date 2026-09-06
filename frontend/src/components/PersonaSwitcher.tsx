// FILE: src/components/PersonaSwitcher.tsx
// PURPOSE: Top navigation persona switcher for judges to jump between all four platform roles.
// PHASE: 3 | DEPENDS ON: /api/v1/auth/demo-token | LAST TOUCHED: Phase 3

import React, { useState, useEffect } from "react";

export type PersonaType = "student" | "institution" | "government" | "employer";

interface PersonaConfig {
  id: PersonaType;
  label: string;
  roleTitle: string;
  badge: string;
}

const PERSONAS: PersonaConfig[] = [
  { id: "student", label: "Student Canvas", roleTitle: "Demo Student", badge: "Candidate" },
  { id: "institution", label: "Institution Portal", roleTitle: "Dean / Academic Council", badge: "AISHE Verified" },
  { id: "government", label: "District Planning (DSDO)", roleTitle: "District Skill Officer", badge: "Govt Admin" },
  { id: "employer", label: "Employer Portal", roleTitle: "Talent Acquisition", badge: "Corporate" },
];

interface Props {
  onPersonaChange?: (persona: PersonaType, token: string) => void;
}

// Renders the interactive persona switcher bar at the top of the viewport.
// Allows evaluation judges to switch security roles instantaneously with demo authentication.
export const PersonaSwitcher: React.FC<Props> = ({ onPersonaChange }) => {
  const [activePersona, setActivePersona] = useState<PersonaType>("student");
  const [activeEmail, setActiveEmail] = useState<string>("demo.student@pravah.internal");
  const [permissionsCount, setPermissionsCount] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);

  // Switches active persona by requesting an authenticated demo JWT from the backend API.
  // Updates local storage and triggers the parent onPersonaChange callback.
  const switchPersona = async (persona: PersonaType) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/auth/demo-token/${persona}`);
      if (res.ok) {
        const data = await res.json();
        setActivePersona(persona);
        setActiveEmail(data.email);
        setPermissionsCount(data.permissions?.length || 0);
        localStorage.setItem("pravah_token", data.access_token);
        localStorage.setItem("pravah_role", data.role);
        if (onPersonaChange) {
          onPersonaChange(persona, data.access_token);
        }
      }
    } catch (err) {
      // Offline fallback: set active persona locally
      setActivePersona(persona);
      localStorage.setItem("pravah_role", persona);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedRole = localStorage.getItem("pravah_role") as PersonaType;
    if (savedRole && PERSONAS.some((p) => p.id === savedRole)) {
      setActivePersona(savedRole);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#131a30",
        color: "#f1f5f9",
        borderBottom: "1px solid #232c48",
        fontSize: "13px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontWeight: 700, letterSpacing: "0.5px", color: "#60a5fa" }}>
          PRAVAH JURY SANDBOX:
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          {PERSONAS.map((p) => {
            const isActive = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => switchPersona(p.id)}
                disabled={loading}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  border: isActive ? "1px solid #60a5fa" : "1px solid #354063",
                  backgroundColor: isActive ? "#1e3a8a" : "#0a0e1c",
                  color: isActive ? "#ffffff" : "#b6c0d4",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "#8a94a8" }}>
        <span>
          Active: <strong style={{ color: "#f1f5f9" }}>{activeEmail}</strong>
        </span>
        <span
          style={{
            backgroundColor: "#232c48",
            color: "#60a5fa",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {permissionsCount} Scopes Active
        </span>
      </div>
    </div>
  );
};
