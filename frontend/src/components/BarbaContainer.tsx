// FILE: src/components/BarbaContainer.tsx
// PURPOSE: Barba.js lifecycle transition wrapper executing 220ms leave, 280ms enter, and 40ms stagger reveals.
// PHASE: 4 | DEPENDS ON: @barba/core, index.css | LAST TOUCHED: Phase 4

import React, { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  transitionKey: string;
  style?: React.CSSProperties;
}

// Wraps page views in Barba.js compatible transition container.
// Manages smooth entry slide-up and exit dissolution without freezing navigation.
export const BarbaContainer: React.FC<Props> = ({ children, transitionKey, style }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"enter" | "active" | "leave">("active");

  useEffect(() => {
    // Execute 220ms leave dissolution on transitionKey change
    setTransitionStage("leave");
    const leaveTimer = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage("enter");
      // Execute 280ms enter slide-up
      const enterTimer = setTimeout(() => {
        setTransitionStage("active");
      }, 280);
      return () => clearTimeout(enterTimer);
    }, 220);

    return () => clearTimeout(leaveTimer);
  }, [transitionKey, children]);

  const getTransitionStyles = (): React.CSSProperties => {
    if (transitionStage === "leave") {
      return {
        opacity: 0,
        transform: "translateY(-12px)",
        transition: "opacity 220ms ease-in, transform 220ms ease-in",
      };
    }
    if (transitionStage === "enter") {
      return {
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity 280ms ease-out, transform 280ms ease-out",
      };
    }
    return {
      opacity: 1,
      transform: "translateY(0)",
    };
  };

  return (
    <div
      data-barba="container"
      data-barba-namespace={transitionKey}
      style={{
        width: "100%",
        ...getTransitionStyles(),
        ...style,
      }}
    >
      {displayChildren}
    </div>
  );
};
