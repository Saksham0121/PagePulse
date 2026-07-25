import { useState, useEffect } from "react";

const STORAGE_KEY = "pagepulse_history";
const MAX_HISTORY = 5;

/**
 * Custom hook to persist and retrieve the last N audited URLs
 * using localStorage.
 */
export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = (entry) => {
    setHistory((prev) => {
      // Remove duplicate if same URL already exists
      const filtered = prev.filter((h) => h.url !== entry.url);
      return [entry, ...filtered].slice(0, MAX_HISTORY);
    });
  };

  const clearHistory = () => setHistory([]);

  return { history, addEntry, clearHistory };
}
