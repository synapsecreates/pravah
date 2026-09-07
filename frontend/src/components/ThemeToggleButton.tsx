// FILE: src/components/ThemeToggleButton.tsx
// PURPOSE: Sleek, tactile theme toggle button on the top-right that cycles between Midnight, Paper, and Parchment themes with visual icons and micro-interactions.
// PHASE: 8 | DEPENDS ON: ThemeContext.tsx, lucide-react | LAST TOUCHED: Phase 8

import React, { useState } from "react";
import { useTheme, type ThemeMode } from "../context/ThemeContext";
import { Moon, Sun, BookOpen, ChevronDown } from "lucide-react";

export const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme, options } = useTheme();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Cycle order: Midnight -> Paper -> Parchment -> Midnight
  const cycleTheme = () => {
    if (theme === "midnight") {
      setTheme("paper");
    } else if (theme === "paper") {
      setTheme("parchment");
    } else {
      setTheme("midnight");
    }
  };

  const getThemeMeta = (mode: ThemeMode) => {
    switch (mode) {
      case "midnight":
        return {
          label: "Midnight",
          nextLabel: "Paper",
          icon: <Moon size={15} color="#60a5fa" />,
          accentColor: "#60a5fa",
          bgGlow: "rgba(96, 165, 250, 0.15)",
        };
      case "paper":
        return {
          label: "Paper",
          nextLabel: "Parchment",
          icon: <Sun size={15} color="#f59e0b" />,
          accentColor: "#f59e0b",
          bgGlow: "rgba(245, 158, 11, 0.15)",
        };
      case "parchment":
        return {
          label: "Parchment",
          nextLabel: "Midnight",
          icon: <BookOpen size={15} color="#b45309" />,
          accentColor: "#b45309",
          bgGlow: "rgba(180, 83, 9, 0.15)",
        };
    }
  };

  const currentMeta = getThemeMeta(theme);

  return (
    <div
      style={{ position: "relative" }}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "30px",
          backgroundColor: "var(--bg-sunken)",
          border: "1px solid var(--border-strong)",
          padding: "3px 4px 3px 6px",
          boxShadow: "var(--shadow-elevation)",
          transition: "all 0.25s ease",
        }}
      >
        {/* Main 1-Click Toggle Button (Cycles to next theme) */}
        <button
          type="button"
          onClick={cycleTheme}
          className="interactive-btn"
          title={`Theme: ${currentMeta.label}. Click to toggle to ${currentMeta.nextLabel}.`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "5px 12px",
            borderRadius: "24px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Animated Glow Icon Circle */}
          <span
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: currentMeta.bgGlow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 10px ${currentMeta.accentColor}30`,
              transition: "all 0.2s ease",
            }}
          >
            {currentMeta.icon}
          </span>
          <span style={{ letterSpacing: "0.2px" }}>{currentMeta.label}</span>
        </button>

        {/* Small Dropdown Trigger Chevron */}
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="interactive-btn"
          title="Select theme from list"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            padding: "4px 6px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ChevronDown
            size={13}
            style={{
              transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
      </div>

      {/* Floating Theme Selection Menu */}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "190px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-strong)",
            borderRadius: "14px",
            padding: "6px",
            boxShadow: "var(--shadow-hover)",
            zIndex: 150,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              padding: "4px 8px 2px 8px",
              letterSpacing: "0.5px",
            }}
          >
            Select Color Mode
          </div>
          {options.map((opt) => {
            const isSelected = theme === opt.id;
            const meta = getThemeMeta(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setShowDropdown(false);
                }}
                className="interactive-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: isSelected ? "1px solid var(--border-strong)" : "1px solid transparent",
                  backgroundColor: isSelected ? "var(--bg-sunken)" : "transparent",
                  color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: meta.bgGlow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {meta.icon}
                </span>
                <span style={{ flex: 1 }}>{opt.name}</span>
                {isSelected && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: meta.accentColor,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
