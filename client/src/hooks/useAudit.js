import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/**
 * Custom hook that manages the URL audit lifecycle:
 * fetching, loading state, result, and error.
 */
export function useAudit() {
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [data,   setData]     = useState(null);
  const [error,  setError]    = useState(null);

  const audit = useCallback(async (url) => {
    setStatus("loading");
    setData(null);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/api/audit?url=${encodeURIComponent(url)}`
      );
      const json = await res.json();

      if (json.success) {
        setData(json.data);
        setStatus("success");
      } else {
        setError(json.error);
        setStatus("error");
      }
    } catch {
      setError({
        code:    "NETWORK_ERROR",
        message: "Could not reach the PagePulse server. Is it running?",
      });
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, audit, reset };
}
