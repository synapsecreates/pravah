// FILE: src/components/ThemeSelector.tsx
// PURPOSE: Interactive toggle component allowing users and judges to switch between Paper, Midnight, and Parchment themes.
// PHASE: 4 | DEPENDS ON: ThemeContext.tsx | LAST TOUCHED: Phase 4

import React from "react";
import { useTheme } from "../context/ThemeContext";

// Renders the theme switcher pill group with tactile micro-interactions.
// Repaints all CSS custom properties across the application in real-time.
export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, options } = useTheme();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px",
        backgroundColor: "var(--bg-sunken)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "12px",
        gap: "4px",
      }}
    >
      {options.map((opt) => {
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            className="interactive-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "8px",
              border: isActive ? "1px solid var(--border-strong)" : "1px solid transparent",
              backgroundColor: isActive ? "var(--bg-surface)" : "transparent",
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: isActive ? 600 : 500,
              fontSize: "13px",
              boxShadow: isActive ? "var(--shadow-elevation)" : "none",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: opt.dotColor,
                display: "inline-block",
              }}
            />
            {opt.name}
          </button>
        );
      })}
    </div>
  );
};
