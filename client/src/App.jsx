import { useEffect, useRef } from "react";
import Header       from "./components/Header";
import Footer       from "./components/Footer";
import UrlInput     from "./components/UrlInput";
import AuditReport  from "./components/AuditReport";
import AuditHistory from "./components/AuditHistory";
import { useAudit }   from "./hooks/useAudit";
import { useHistory } from "./hooks/useHistory";

export default function App() {
  const { status, data, error, audit } = useAudit();
  const { history, addEntry, clearHistory } = useHistory();

  const isLoading = status === "loading";

  // Persist successful audits to history (deduplicated by URL)
  const prevDataRef = useRef(null);
  useEffect(() => {
    if (data && data !== prevDataRef.current) {
      prevDataRef.current = data;
      addEntry({
        url:       data.url,
        seoScore:  data.seoScore,
        seoGrade:  data.seoGrade,
        auditedAt: data.auditedAt,
      });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasResults = isLoading || data || error;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* ── Ambient background glows ───────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {/* Top-center blue glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]
          bg-brand-700/20 rounded-full blur-[120px]" />
        {/* Bottom-right accent */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px]
          bg-brand-900/30 rounded-full blur-[100px]" />
        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 opacity-100" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* ── Hero section ───────────────────────────── */}
        <div className="text-center space-y-4 animate-fade-in">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-brand-600/10 border border-brand-600/25 text-brand-300 text-xs font-semibold
            tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Free URL Auditing Tool
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Audit any{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-600
                bg-clip-text text-transparent">
                webpage
              </span>
              {/* Underline accent */}
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full
                bg-gradient-to-r from-brand-500 to-brand-700 opacity-60" />
            </span>{" "}
            instantly
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Paste any URL to get HTTP status, SEO score, meta tags, heading structure,
            accessibility issues, and page performance — all in one clean report.
          </p>
        </div>

        {/* ── URL Input ──────────────────────────────── */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <UrlInput onSubmit={audit} isLoading={isLoading} />
        </div>

        {/* ── Feature chips (shown only before first audit) ── */}
        {!hasResults && (
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in"
            style={{ animationDelay: "0.2s" }}>
            {[
              "🌐 HTTP Status",
              "⚡ Response Time",
              "📝 Page Title",
              "📄 Meta Description",
              "🔠 H1 Structure",
              "🖼️ Alt Text Audit",
              "📊 Word Count",
              "🏆 SEO Score",
            ].map((chip) => (
              <span key={chip}
                className="px-3 py-1.5 rounded-full bg-surface-700/60 border border-surface-500/50
                  text-slate-400 text-xs font-medium hover:border-brand-600/40
                  hover:text-slate-300 transition-all duration-200 cursor-default">
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* ── Recent Audit History ───────────────────── */}
        {!hasResults && (
          <AuditHistory
            history={history}
            onSelect={audit}
            onClear={clearHistory}
          />
        )}

        {/* ── Audit Report ───────────────────────────── */}
        <AuditReport data={data} isLoading={isLoading} error={error} />

        {/* Show history below report too when results are visible */}
        {hasResults && history.length > 0 && (
          <AuditHistory
            history={history}
            onSelect={audit}
            onClear={clearHistory}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
