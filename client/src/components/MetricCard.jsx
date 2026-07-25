import { STATUS_COLORS, METRIC_CONFIG } from "../constants";

/**
 * MetricCard — displays one audit metric with color-coded status.
 *
 * Props:
 *   metricKey: string — key from METRIC_CONFIG
 *   value: any        — raw metric value
 */
export default function MetricCard({ metricKey, value }) {
  const config = METRIC_CONFIG[metricKey];
  if (!config) return null;

  const statusKey = config.status(value);
  const colors    = STATUS_COLORS[statusKey];
  const formatted = config.format(value);
  const isTruncated = typeof formatted === "string" && formatted.length > 60;
  const displayValue = isTruncated ? `${formatted.slice(0, 57)}…` : formatted;

  const statusLabel = { good: "Good", warn: "Warning", bad: "Issue" }[statusKey];

  return (
    <article
      className={`glass-card p-5 flex flex-col gap-4 border
        ${colors.border} hover:border-opacity-80
        hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20
        transition-all duration-200 animate-slide-up`}
    >
      {/* Top: icon + label + status badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Icon circle */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
            ${colors.bg} border ${colors.border}`}>
            <span className="text-lg leading-none">{config.icon}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
              {config.label}
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
              {config.description}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`metric-badge shrink-0 ${colors.bg} ${colors.text} border ${colors.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0`} />
          {statusLabel}
        </span>
      </div>

      {/* Value */}
      <p
        className={`font-mono font-bold text-xl break-all leading-snug ${colors.text}`}
        title={isTruncated ? formatted : undefined}
      >
        {displayValue || <span className="text-slate-600 text-base font-normal italic">Not found</span>}
      </p>
    </article>
  );
}
