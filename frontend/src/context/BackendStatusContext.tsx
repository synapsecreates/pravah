// FILE: src/context/BackendStatusContext.tsx
// PURPOSE: Global React context providing real-time backend connectivity state (isLiveBackend), startup 8s probe execution, and manual retry capability.
// PHASE: 8 | DEPENDS ON: src/api/client.ts | LAST TOUCHED: Phase 8

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getIsLiveBackend,
  subscribeBackendStatus,
  checkBackendHealth,
} from "../api/client";

interface BackendStatusContextType {
  isLiveBackend: boolean;
  isChecking: boolean;
  hasChecked: boolean;
  checkHealth: () => Promise<boolean>;
}

const BackendStatusContext = createContext<BackendStatusContextType>({
  isLiveBackend: false,
  isChecking: false,
  hasChecked: false,
  checkHealth: async () => false,
});

export const BackendStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLive, setIsLive] = useState<boolean>(getIsLiveBackend());
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  const runHealthCheck = useCallback(async () => {
    setIsChecking(true);
    try {
      // Calls /api/v1/health/ping with an 8-second AbortController timeout
      const live = await checkBackendHealth(8000);
      setIsLive(live);
      return live;
    } finally {
      setIsChecking(false);
      setHasChecked(true);
    }
  }, []);

  useEffect(() => {
    // Synchronize React state with module-level updates triggered by client.ts fallbacks
    const unsubscribe = subscribeBackendStatus((live) => {
      setIsLive(live);
    });

    // Execute startup liveness probe immediately on app load
    runHealthCheck();

    return () => {
      unsubscribe();
    };
  }, [runHealthCheck]);

  return (
    <BackendStatusContext.Provider
      value={{
        isLiveBackend: isLive,
        isChecking,
        hasChecked,
        checkHealth: runHealthCheck,
      }}
    >
      {children}
    </BackendStatusContext.Provider>
  );
};

export const useBackendStatus = () => useContext(BackendStatusContext);
