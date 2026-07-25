/**
 * AuditHistory — last 5 audited URLs from localStorage.
 *
 * Props:
 *   history:  Array<{ url, seoScore, seoGrade, auditedAt }>
 *   onSelect(url) — re-run an audit for a past URL
 *   onClear()     — wipe history
 */
export default function AuditHistory({ history, onSelect, onClear }) {
  if (!history.length) return null;

  return (
    <div className="w-full animate-fade-in space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Recent Audits
          </span>
          <span className="px-1.5 py-0.5 rounded bg-surface-600 text-slate-500 text-[10px] font-mono">
            {history.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-600 hover:text-red-400 transition-colors
            flex items-center gap-1"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Clear
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {history.map((item, idx) => (
          <HistoryItem key={`${item.url}-${idx}`} item={item} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function HistoryItem({ item, onSelect }) {
  const gradeColors = {
    A: "text-emerald-400", B: "text-blue-400",
    C: "text-yellow-400",  D: "text-orange-400", F: "text-red-400",
  };

  const timeAgo = (() => {
    const diff = Date.now() - new Date(item.auditedAt).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1)  return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  return (
    <button
      type="button"
      onClick={() => onSelect(item.url)}
      className="glass-card px-4 py-3 flex items-center gap-3 w-full text-left
        hover:border-brand-600/40 hover:bg-brand-600/5
        transition-all duration-150 group"
    >
      {/* Grade */}
      <span className={`text-sm font-black w-5 shrink-0 transition-transform
        group-hover:scale-125 ${gradeColors[item.seoGrade] ?? "text-slate-400"}`}>
        {item.seoGrade}
      </span>

      {/* URL */}
      <span className="flex-1 text-sm text-slate-500 font-mono truncate
        group-hover:text-slate-200 transition-colors">
        {item.url}
      </span>

      {/* Score + time */}
      <span className="text-xs text-slate-600 shrink-0 tabular-nums">
        {item.seoScore}/100
      </span>
      <span className="text-xs text-slate-700 shrink-0 hidden sm:block">{timeAgo}</span>

      {/* Arrow */}
      <svg className="w-3.5 h-3.5 text-slate-700 group-hover:text-brand-400
        transition-all duration-150 group-hover:translate-x-0.5 shrink-0"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}
