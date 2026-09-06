// FILE: src/components/PerspectiveCard.tsx
// PURPOSE: Reusable 3D perspective container component implementing tactile hover elevation and anti-box depth.
// PHASE: 4 | DEPENDS ON: index.css 3D stage classes | LAST TOUCHED: Phase 4

import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

// Renders an open-stage card with gentle 3D tilt and floating elevation.
// Replaces rigid nested boxes with tactile physical depth and ambient drop shadows.
export const PerspectiveCard: React.FC<Props> = ({ children, style, className = "", onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`perspective-card ${className}`}
      style={{
        padding: "28px",
        backgroundColor: "var(--bg-surface)",
        border: `1px solid ${isHovered ? "var(--border-strong)" : "var(--border-subtle)"}`,
        borderRadius: "16px",
        boxShadow: isHovered ? "var(--shadow-hover)" : "var(--shadow-elevation)",
        transform: isHovered ? "translateY(-4px) rotateX(1.2deg) rotateY(-0.4deg)" : "translateY(0) rotateX(0) rotateY(0)",
        transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
