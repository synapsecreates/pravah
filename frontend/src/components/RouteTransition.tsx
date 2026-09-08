// FILE: src/components/RouteTransition.tsx
// PURPOSE: Real page transition container built on Framer Motion AnimatePresence executing 220ms exit, 280ms entry, and 40ms stagger reveals.
// PHASE: 8 | DEPENDS ON: motion/react | LAST TOUCHED: Phase 8

import React from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";

interface RouteTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
  style?: React.CSSProperties;
  className?: string;
}

// Exact transition specification variants:
// leave: opacity 0 + translateY(-12px) over 220ms
// enter: opacity 0 -> 1 + translateY(16px -> 0) over 280ms
// child cards/metrics stagger at 40ms via staggerChildren: 0.04
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28, // 280ms
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04, // 40ms stagger reveal for child elements
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    y: -12, // -12px translateY
    transition: {
      duration: 0.22, // 220ms
      ease: [0.4, 0, 1, 1], // easeIn
    },
  },
};

// Child stagger item variant for metric blocks and cards
export const staggerChildVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  transitionKey,
  style,
  className = "",
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className={className}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          ...style,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
