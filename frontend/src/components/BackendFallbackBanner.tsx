// FILE: src/components/BackendFallbackBanner.tsx
// PURPOSE: Persistent, dismissible notification banner alerting users and evaluators when the backend is unreachable and demo illustrative data is active.
// PHASE: 8 | DEPENDS ON: src/context/BackendStatusContext.tsx, lucide-react | LAST TOUCHED: Phase 8

import React, { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { useBackendStatus } from "../context/BackendStatusContext";

export const BackendFallbackBanner: React.FC = () => {
  const { isLiveBackend, isChecking, hasChecked, checkHealth } = useBackendStatus();
  const [isDismissed, setIsDismissed] = useState(false);

  // If backend comes back online, clear dismissed state so future disconnections notify user
  useEffect(() => {
    if (isLiveBackend) {
      setIsDismissed(false);
    }
  }, [isLiveBackend]);

  // Do not show if backend is live, or if initial check hasn't finished yet, or if user dismissed it
  if (isLiveBackend || !hasChecked || isDismissed) {
    return null;
  }

  return (
    <div
      role="alert"
      style={{
        width: "100%",
        backgroundColor: "var(--warning-bg, rgba(245, 158, 11, 0.12))",
        borderBottom: "1px solid var(--warning, #f59e0b)",
        color: "var(--text-primary)",
        padding: "9px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        fontSize: "13px",
        fontWeight: 500,
        zIndex: 999,
        transition: "all 0.2s ease-in-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <AlertTriangle size={16} style={{ color: "var(--warning, #f59e0b)", flexShrink: 0 }} />
        <span>
          Demo data mode — backend unreachable. Numbers shown are illustrative.
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => checkHealth()}
          disabled={isChecking}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-strong)",
            borderRadius: "6px",
            padding: "3px 9px",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text-primary)",
            cursor: isChecking ? "not-allowed" : "pointer",
            opacity: isChecking ? 0.7 : 1,
          }}
          title="Retry pinging backend health endpoint"
        >
          <RefreshCw size={12} className={isChecking ? "spin" : ""} style={{ animation: isChecking ? "spin 1s linear infinite" : "none" }} />
          <span>{isChecking ? "Rechecking..." : "Retry"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
