import { pingBackend } from "@/lib/api";
import { useEffect, useState } from "react";

export interface BackendStatus {
  isOnline: boolean;
  isLoading: boolean;
  lastChecked: Date | null;
  error: string | null;
}

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>({
    isOnline: false,
    isLoading: true,
    lastChecked: null,
    error: null,
  });

  const checkBackendStatus = async () => {
    try {
      setStatus((prev) => ({ ...prev, isLoading: true, error: null }));
      await pingBackend();
      setStatus((prev) => ({
        ...prev,
        isOnline: true,
        isLoading: false,
        lastChecked: new Date(),
        error: null,
      }));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        isOnline: false,
        isLoading: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkBackendStatus();

    // Set up periodic checks every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...status,
    refresh: checkBackendStatus,
  };
}
