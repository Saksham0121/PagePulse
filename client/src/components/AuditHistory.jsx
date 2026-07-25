/**
 * AuditHistory — shows the last 5 audited URLs from localStorage.
 *
 * Props:
 *   history:      Array<{ url, seoScore, seoGrade, auditedAt }>
 *   onSelect(url) — called when user clicks a history item
 *   onClear()     — called when user clears history
 */
export default function AuditHistory({ history, onSelect, onClear }) {
  if (!history.length) return null;

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Recent Audits
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-600 hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {history.map((item) => (
          <button
            key={`${item.url}-${item.auditedAt}`}
            type="button"
            onClick={() => onSelect(item.url)}
            className="glass-card px-4 py-3 flex items-center gap-3 w-full text-left
              hover:border-brand-600/40 hover:bg-brand-600/5 transition-all duration-150 group"
          >
            {/* Grade badge */}
            <span className="text-sm font-black text-brand-400 w-5 shrink-0 group-hover:scale-110 transition-transform">
              {item.seoGrade}
            </span>

            {/* URL */}
            <span className="flex-1 text-sm text-slate-400 font-mono truncate group-hover:text-slate-200 transition-colors">
              {item.url}
            </span>

            {/* Score */}
            <span className="text-xs text-slate-600 shrink-0">
              {item.seoScore}/100
            </span>

            <span className="text-slate-700 group-hover:text-brand-400 transition-colors shrink-0 text-xs">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
