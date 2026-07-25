import MetricCard   from "./MetricCard";
import SkeletonCard from "./SkeletonCard";
import { METRIC_CONFIG, GRADE_COLORS } from "../constants";

const METRIC_KEYS = Object.keys(METRIC_CONFIG);

/**
 * AuditReport — full report panel with score, metrics, error, and export.
 *
 * Props:
 *   data:      Object | null  — audit data from API
 *   isLoading: boolean        — show skeletons
 *   error:     Object | null  — { code, message }
 */
export default function AuditReport({ data, isLoading, error }) {
  if (!isLoading && !data && !error) return null;

  return (
    <section aria-label="Audit Results" className="w-full space-y-6 animate-fade-in">
      {/* ── Error ─────────────────────────────────── */}
      {error && !isLoading && <ErrorBanner error={error} />}

      {/* ── Loading ───────────────────────────────── */}
      {isLoading && (
        <div className="space-y-6">
          <ScoreCardSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRIC_KEYS.map((k) => <SkeletonCard key={k} />)}
          </div>
        </div>
      )}

      {/* ── Success ───────────────────────────────── */}
      {data && !isLoading && (
        <div className="space-y-6">
          <ScoreCard data={data} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRIC_KEYS.map((key) => (
              <MetricCard key={key} metricKey={key} value={data[key]} />
            ))}
          </div>
          <div className="flex justify-end">
            <ExportButton data={data} />
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Error Banner ──────────────────────────────────────────────────────────── */
function ErrorBanner({ error }) {
  const errorMeta = {
    INVALID_URL:   { icon: "🔗", label: "Invalid URL" },
    TIMEOUT:       { icon: "⏱️", label: "Request Timed Out" },
    NON_HTML:      { icon: "📄", label: "Not an HTML Page" },
    FETCH_FAILED:  { icon: "🌐", label: "Fetch Failed" },
    NETWORK_ERROR: { icon: "📡", label: "Network Error" },
  };
  const meta = errorMeta[error.code] ?? { icon: "⚠️", label: "Error" };

  return (
    <div className="glass-card p-5 border border-red-500/30 bg-red-500/5
      flex items-start gap-4 animate-slide-up">
      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20
        flex items-center justify-center shrink-0 text-xl">
        {meta.icon}
      </div>
      <div>
        <p className="font-bold text-red-400 text-sm">{meta.label}</p>
        <p className="text-slate-400 text-sm mt-0.5">{error.message}</p>
        <p className="text-slate-600 text-xs mt-1.5 font-mono">
          code: {error.code}
        </p>
      </div>
    </div>
  );
}

/* ── Score Card ────────────────────────────────────────────────────────────── */
function ScoreCard({ data }) {
  const gradeColors = GRADE_COLORS[data.seoGrade] ?? GRADE_COLORS.F;

  // SVG ring math
  const radius       = 38;
  const circumference = 2 * Math.PI * radius;
  const offset        = circumference - (data.seoScore / 100) * circumference;

  const auditedDate = new Date(data.auditedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Score ring color by grade
  const ringColors = {
    A: ["#34d399", "#10b981"],
    B: ["#60a5fa", "#3b82f6"],
    C: ["#fbbf24", "#f59e0b"],
    D: ["#fb923c", "#f97316"],
    F: ["#f87171", "#ef4444"],
  };
  const [c1, c2] = ringColors[data.seoGrade] ?? ringColors.F;

  return (
    <div className="glass-card p-6 border border-surface-500/60
      flex flex-col sm:flex-row items-center gap-6 animate-slide-up">

      {/* Score ring */}
      <div className="relative shrink-0 w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          {/* Track */}
          <circle cx="44" cy="44" r={radius} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          {/* Progress arc */}
          <circle cx="44" cy="44" r={radius} fill="none"
            stroke="url(#gradeGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
          <defs>
            <linearGradient id="gradeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c1} />
              <stop offset="100%" stopColor={c2} />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white leading-none">
            {data.seoScore}
          </span>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">
            / 100
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
          <span className={`text-4xl font-black tracking-tight ${gradeColors.text}`}>
            {data.seoGrade}
          </span>
          <span className={`metric-badge text-sm px-3 py-1.5
            ${gradeColors.bg} ${gradeColors.text} border ${gradeColors.border}`}>
            SEO Grade
          </span>
        </div>

        <p className="mt-3 text-slate-300 text-sm font-mono truncate max-w-full"
          title={data.url}>
          {data.url}
        </p>
        <p className="mt-1 text-slate-600 text-xs">
          Audited {auditedDate} · {data.responseTime}ms response
        </p>
      </div>
    </div>
  );
}

/* ── Score Skeleton ────────────────────────────────────────────────────────── */
function ScoreCardSkeleton() {
  return (
    <div className="glass-card p-6 flex items-center gap-6">
      <div className="skeleton w-24 h-24 rounded-full shrink-0" />
      <div className="flex flex-col gap-3 flex-1">
        <div className="skeleton w-40 h-7 rounded-lg" />
        <div className="skeleton w-64 h-4 rounded" />
        <div className="skeleton w-36 h-3 rounded" />
      </div>
    </div>
  );
}

/* ── Export Button ─────────────────────────────────────────────────────────── */
function ExportButton({ data }) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a   = Object.assign(document.createElement("a"), {
      href:     url,
      download: `pagepulse-${new URL(data.url).hostname}-${Date.now()}.json`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      id="export-btn"
      type="button"
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-500/60
        text-slate-400 hover:text-white hover:border-brand-600/60 text-sm font-medium
        transition-all duration-200 hover:bg-brand-600/10 hover:shadow-md
        hover:shadow-brand-900/30 active:scale-95"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={2}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export JSON
    </button>
  );
}
