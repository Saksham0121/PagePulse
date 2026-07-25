/**
 * Application-wide constants shared across components.
 */

/** Maps audit metric keys to human-readable display config */
export const METRIC_CONFIG = {
  httpStatus: {
    label: "HTTP Status",
    icon: "🌐",
    description: "Server response code",
    format: (v) => String(v),
    status: (v) =>
      v >= 200 && v < 300 ? "good" : v >= 300 && v < 400 ? "warn" : "bad",
  },
  responseTime: {
    label: "Response Time",
    icon: "⚡",
    description: "Time to first byte",
    format: (v) => `${v} ms`,
    status: (v) => (v < 500 ? "good" : v < 1500 ? "warn" : "bad"),
  },
  title: {
    label: "Page Title",
    icon: "📝",
    description: "10–60 characters recommended",
    format: (v) => v ?? "—",
    status: (v) => {
      if (!v) return "bad";
      const l = v.length;
      return l >= 10 && l <= 60 ? "good" : "warn";
    },
  },
  metaDescription: {
    label: "Meta Description",
    icon: "📄",
    description: "50–160 characters recommended",
    format: (v) => v ?? "—",
    status: (v) => {
      if (!v) return "bad";
      const l = v.length;
      return l >= 50 && l <= 160 ? "good" : "warn";
    },
  },
  h1Count: {
    label: "H1 Count",
    icon: "🔠",
    description: "Exactly 1 H1 is best practice",
    format: (v) => String(v),
    status: (v) => (v === 1 ? "good" : v === 0 ? "bad" : "warn"),
  },
  imagesMissingAlt: {
    label: "Images Missing Alt",
    icon: "🖼️",
    description: "All images should have alt text",
    format: (v) => String(v),
    status: (v) => (v === 0 ? "good" : v <= 2 ? "warn" : "bad"),
  },
  wordCount: {
    label: "Word Count",
    icon: "📊",
    description: "Approximate page content length",
    format: (v) => v.toLocaleString(),
    status: (v) => (v > 300 ? "good" : v > 100 ? "warn" : "bad"),
  },
};

/** SEO grade colors */
export const GRADE_COLORS = {
  A: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
  B: { text: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/30"    },
  C: { text: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/30"  },
  D: { text: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/30"  },
  F: { text: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/30"     },
};

/** Status indicator colors */
export const STATUS_COLORS = {
  good: {
    dot:  "bg-emerald-400",
    text: "text-emerald-400",
    bg:   "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  warn: {
    dot:  "bg-yellow-400",
    text: "text-yellow-400",
    bg:   "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  bad: {
    dot:  "bg-red-400",
    text: "text-red-400",
    bg:   "bg-red-400/10",
    border: "border-red-400/20",
  },
};
