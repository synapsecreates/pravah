// FILE: src/context/ThemeContext.tsx
// PURPOSE: Global theme provider managing Paper, Midnight, and Parchment color modes with persistent storage.
// PHASE: 4 | DEPENDS ON: CSS data-theme attribute (§6) | LAST TOUCHED: Phase 4

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "midnight" | "paper" | "parchment";

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  description: string;
  dotColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep navy-black obsidian canvas with royal indigo & soft violet accents",
    dotColor: "#60A5FA",
  },
  {
    id: "paper",
    name: "Paper",
    description: "Clean editorial off-white studio with deep indigo contrast",
    dotColor: "#2563EB",
  },
  {
    id: "parchment",
    name: "Parchment",
    description: "Warm sepia eye-comfort canvas with amber & forest sage tones",
    dotColor: "#B45309",
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  options: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Top-level provider applying the active data-theme attribute to the root HTML document.
// Persists user choice in localStorage so theme preferences survive page refreshes.
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("pravah_theme") as ThemeMode;
    if (saved && ["midnight", "paper", "parchment"].includes(saved)) {
      return saved;
    }
    return "midnight";
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("pravah_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, options: THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom React hook accessing the current active theme mode and toggle function.
// Throws an error if invoked outside of a ThemeProvider hierarchy.
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
