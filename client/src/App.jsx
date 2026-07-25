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

  // Persist to history whenever a new audit succeeds
  const prevData = useRef(null);
  useEffect(() => {
    if (data && data !== prevData.current) {
      prevData.current = data;
      addEntry({
        url:        data.url,
        seoScore:   data.seoScore,
        seoGrade:   data.seoGrade,
        auditedAt:  data.auditedAt,
      });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Audit any{" "}
            <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              webpage
            </span>{" "}
            instantly
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Get HTTP status, SEO metrics, accessibility issues, and a full
            performance report — in seconds.
          </p>
        </div>

        {/* URL Input */}
        <UrlInput onSubmit={audit} isLoading={isLoading} />

        {/* Recent History */}
        <AuditHistory
          history={history}
          onSelect={audit}
          onClear={clearHistory}
        />

        {/* Audit Report */}
        <AuditReport data={data} isLoading={isLoading} error={error} />
      </main>

      <Footer />
    </div>
  );
}
