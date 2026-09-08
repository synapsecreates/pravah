// FILE: src/context/BackendStatusContext.tsx
// PURPOSE: Global React context providing real-time backend connectivity state (isLiveBackend), startup 8s probe execution, 60s silent cold-start re-probe, and reconnect reload triggers.
// PHASE: 8 | DEPENDS ON: src/api/client.ts | LAST TOUCHED: Phase 8

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  getIsLiveBackend,
  subscribeBackendStatus,
  checkBackendHealth,
} from "../api/client";

interface BackendStatusContextType {
  isLiveBackend: boolean;
  isChecking: boolean;
  hasChecked: boolean;
  hasReconnected: boolean;
  clearReconnected: () => void;
  checkHealth: () => Promise<boolean>;
}

const BackendStatusContext = createContext<BackendStatusContextType>({
  isLiveBackend: false,
  isChecking: false,
  hasChecked: false,
  hasReconnected: false,
  clearReconnected: () => {},
  checkHealth: async () => false,
});

export const BackendStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLive, setIsLive] = useState<boolean>(getIsLiveBackend());
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [hasReconnected, setHasReconnected] = useState<boolean>(false);
  const wasDownRef = useRef<boolean>(false);

  const runHealthCheck = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsChecking(true);
    try {
      // Calls /api/v1/health/ping with an 8-second AbortController timeout
      const live = await checkBackendHealth(8000);
      if (live) {
        if (wasDownRef.current) {
          setHasReconnected(true);
          window.dispatchEvent(new CustomEvent("pravah:backend-reconnected"));
        }
        wasDownRef.current = false;
      } else {
        wasDownRef.current = true;
      }
      setIsLive(live);
      return live;
    } finally {
      if (!isSilent) setIsChecking(false);
      setHasChecked(true);
    }
  }, []);

  const clearReconnected = useCallback(() => {
    setHasReconnected(false);
  }, []);

  useEffect(() => {
    // Synchronize React state with module-level updates triggered by client.ts fallbacks
    const unsubscribe = subscribeBackendStatus((live) => {
      if (live) {
        if (wasDownRef.current) {
          setHasReconnected(true);
          window.dispatchEvent(new CustomEvent("pravah:backend-reconnected"));
        }
        wasDownRef.current = false;
      } else {
        wasDownRef.current = true;
      }
      setIsLive(live);
    });

    let coldStartTimer: any = null;

    // Execute startup liveness probe immediately on app load
    runHealthCheck().then((initialLive) => {
      // If startup check failed (e.g. Render cold start), schedule one silent re-probe in 60s
      if (!initialLive) {
        wasDownRef.current = true;
        coldStartTimer = setTimeout(async () => {
          await runHealthCheck(true);
        }, 60000);
      }
    });

    return () => {
      unsubscribe();
      if (coldStartTimer) clearTimeout(coldStartTimer);
    };
  }, [runHealthCheck]);

  return (
    <BackendStatusContext.Provider
      value={{
        isLiveBackend: isLive,
        isChecking,
        hasChecked,
        hasReconnected,
        clearReconnected,
        checkHealth: () => runHealthCheck(false),
      }}
    >
      {children}
    </BackendStatusContext.Provider>
  );
};

export const useBackendStatus = () => useContext(BackendStatusContext);
