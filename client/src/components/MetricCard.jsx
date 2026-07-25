import { STATUS_COLORS, METRIC_CONFIG } from "../constants";

/**
 * MetricCard — displays a single audit metric with
 * color-coded status indicator, icon, label and value.
 *
 * Props:
 *   metricKey: string  — key from METRIC_CONFIG
 *   value: any         — raw metric value from the audit report
 */
export default function MetricCard({ metricKey, value }) {
  const config = METRIC_CONFIG[metricKey];
  if (!config) return null;

  const statusKey = config.status(value);
  const colors    = STATUS_COLORS[statusKey];
  const formatted = config.format(value);
  const isTruncated = typeof formatted === "string" && formatted.length > 60;

  return (
    <div
      className={`glass-card p-5 flex flex-col gap-3 border
        ${colors.border} hover:border-opacity-60
        hover:-translate-y-0.5 transition-all duration-200 animate-slide-up`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider leading-none">
              {config.label}
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">{config.description}</p>
          </div>
        </div>

        {/* Status dot */}
        <span
          className={`metric-badge ${colors.bg} ${colors.text} border ${colors.border} capitalize`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {statusKey}
        </span>
      </div>

      {/* Value */}
      <p
        className={`font-mono font-semibold text-lg break-all leading-snug ${colors.text}`}
        title={isTruncated ? formatted : undefined}
      >
        {isTruncated ? `${formatted.slice(0, 58)}…` : formatted}
      </p>
    </div>
  );
}
