import { useState, useCallback } from "react";

// In production use the env var; in dev the Vite proxy handles /api/* → localhost:5001
const API_BASE =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api";

/**
 * Custom hook that manages the URL audit lifecycle:
 * fetching, loading state, result, and error.
 *
 * @returns {{ status, data, error, audit, reset }}
 */
export function useAudit() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [data,   setData]   = useState(null);
  const [error,  setError]  = useState(null);

  const audit = useCallback(async (url) => {
    setStatus("loading");
    setData(null);
    setError(null);

    try {
      const res  = await fetch(`${API_BASE}/audit?url=${encodeURIComponent(url)}`);
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
        message: "Could not reach the PagePulse server. Make sure the backend is running on port 5001.",
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
