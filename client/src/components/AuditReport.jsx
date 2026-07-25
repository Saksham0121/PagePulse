import MetricCard   from "./MetricCard";
import SkeletonCard from "./SkeletonCard";
import { METRIC_CONFIG, GRADE_COLORS } from "../constants";

const METRIC_KEYS = Object.keys(METRIC_CONFIG);

/**
 * AuditReport — renders the full audit report:
 *   - SEO score ring + grade
 *   - Audited URL + timestamp
 *   - Grid of metric cards
 *   - Export JSON button
 *
 * Props:
 *   data:      Object | null  — audit report from the API
 *   isLoading: boolean        — show skeletons while loading
 *   error:     Object | null  — error object { code, message }
 */
export default function AuditReport({ data, isLoading, error }) {
  if (!isLoading && !data && !error) return null;

  return (
    <section className="w-full animate-fade-in" aria-label="Audit Results">
      {/* ── Error state ──────────────────────────────────────── */}
      {error && !isLoading && (
        <div className="glass-card p-6 border border-red-500/30 bg-red-500/5 flex items-start gap-4">
          <span className="text-3xl shrink-0">⚠️</span>
          <div>
            <p className="font-semibold text-red-400 text-base">{error.code}</p>
            <p className="text-slate-400 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {/* ── Loading skeletons ────────────────────────────────── */}
      {isLoading && (
        <div className="space-y-6">
          {/* Score skeleton */}
          <div className="glass-card p-6 flex items-center gap-6">
            <div className="skeleton w-24 h-24 rounded-full shrink-0" />
            <div className="flex flex-col gap-3 flex-1">
              <div className="skeleton w-48 h-5 rounded" />
              <div className="skeleton w-32 h-3 rounded" />
              <div className="skeleton w-56 h-3 rounded" />
            </div>
          </div>
          {/* Metric skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRIC_KEYS.map((k) => <SkeletonCard key={k} />)}
          </div>
        </div>
      )}

      {/* ── Success state ─────────────────────────────────────── */}
      {data && !isLoading && (
        <div className="space-y-6">
          {/* Score card */}
          <ScoreCard data={data} />

          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRIC_KEYS.map((key) => (
              <MetricCard key={key} metricKey={key} value={data[key]} />
            ))}
          </div>

          {/* Export button */}
          <div className="flex justify-end">
            <ExportButton data={data} />
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function ScoreCard({ data }) {
  const gradeColors = GRADE_COLORS[data.seoGrade] ?? GRADE_COLORS.F;
  const circumference = 2 * Math.PI * 38; // r=38
  const offset = circumference - (data.seoScore / 100) * circumference;

  const auditedDate = new Date(data.auditedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6 border border-surface-500">
      {/* Score ring */}
      <div className="relative shrink-0 w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          {/* Track */}
          <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="44" cy="44" r="38"
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#28a8ff" />
              <stop offset="100%" stopColor="#0e8aff" />
            </linearGradient>
          </defs>
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white leading-none">{data.seoScore}</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">score</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
          <span className={`text-3xl font-black ${gradeColors.text}`}>{data.seoGrade}</span>
          <span
            className={`metric-badge ${gradeColors.bg} ${gradeColors.text} border ${gradeColors.border} text-sm`}
          >
            SEO Grade
          </span>
        </div>

        <p className="mt-2 text-slate-300 text-sm font-mono break-all">
          {data.url}
        </p>
        <p className="mt-1 text-slate-600 text-xs">Audited {auditedDate}</p>
      </div>
    </div>
  );
}

function ExportButton({ data }) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `pagepulse-${new URL(data.url).hostname}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      id="export-btn"
      type="button"
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-500
        text-slate-400 hover:text-white hover:border-brand-600 text-sm font-medium
        transition-all duration-200 hover:bg-brand-600/10"
    >
      <span>⬇</span> Export JSON
    </button>
  );
}
