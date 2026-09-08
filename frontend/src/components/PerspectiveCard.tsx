// FILE: src/components/PerspectiveCard.tsx
// PURPOSE: Reusable 3D perspective container component implementing Framer Motion tactile hover elevation (y: -3, rotateX: 1) and tap feel (scale: 0.98).
// PHASE: 8 | DEPENDS ON: motion/react, index.css | LAST TOUCHED: Phase 8

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";

interface Props extends Omit<HTMLMotionProps<"div">, "children" | "style"> {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

// Renders an open-stage card with gentle 3D tilt and floating elevation via Framer Motion.
export const PerspectiveCard: React.FC<Props> = ({
  children,
  style,
  className = "",
  onClick,
  ...rest
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -3, rotateX: 1 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`perspective-card ${className}`}
      style={{
        padding: "28px",
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "16px",
        boxShadow: "var(--shadow-elevation)",
        transformStyle: "preserve-3d",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
