import { useState, useId } from "react";

/**
 * UrlInput — URL form with inline validation, glow ring, and loading spinner.
 *
 * Props:
 *   onSubmit(url: string) — called with a valid URL on form submit
 *   isLoading: boolean    — disables controls while auditing
 */
export default function UrlInput({ onSubmit, isLoading }) {
  const [value,   setValue]   = useState("");
  const [touched, setTouched] = useState(false);
  const inputId = useId();

  const isValid = (() => {
    try {
      const p = new URL(value.trim());
      return p.protocol === "http:" || p.protocol === "https:";
    } catch {
      return false;
    }
  })();

  const showError = touched && value.trim() !== "" && !isValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isValid && !isLoading) onSubmit(value.trim());
  };

  const handleClear = () => {
    setValue("");
    setTouched(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="URL audit form">
      <div className="relative group">
        {/* Animated glow border on focus */}
        <div className="absolute -inset-[1.5px] rounded-2xl pointer-events-none
          bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600
          opacity-0 group-focus-within:opacity-100
          transition-opacity duration-300 blur-[1px]" />

        {/* Input card */}
        <div className="relative flex items-center bg-surface-800/90 border
          border-surface-500/70 rounded-2xl overflow-hidden
          group-focus-within:border-transparent transition-colors duration-300">

          {/* Globe icon */}
          <label htmlFor={inputId} className="pl-5 pr-3 text-slate-500 shrink-0 cursor-text">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10
                       15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </label>

          {/* Text input */}
          <input
            id={inputId}
            type="url"
            value={value}
            onChange={(e) => { setValue(e.target.value); setTouched(false); }}
            onBlur={() => value && setTouched(true)}
            placeholder="https://example.com"
            autoComplete="url"
            spellCheck={false}
            disabled={isLoading}
            className="flex-1 bg-transparent py-4 pr-3 text-base text-white
              placeholder-slate-600 font-mono outline-none
              disabled:opacity-50 transition-colors"
          />

          {/* Clear × */}
          {value && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear URL"
              className="p-2 mr-1 text-slate-600 hover:text-slate-400
                rounded-lg hover:bg-surface-600/50 transition-all duration-150 shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2.5}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Submit */}
          <button
            id="audit-btn"
            type="submit"
            disabled={isLoading || !value.trim()}
            className="btn-primary m-2 shrink-0 flex items-center gap-2
              min-w-[108px] justify-center text-sm"
          >
            {isLoading ? (
              <>
                <Spinner /> Auditing…
              </>
            ) : (
              <>
                Audit{" "}
                <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {showError && (
        <p role="alert" className="mt-2.5 ml-1 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          Please enter a valid URL starting with <code className="font-mono bg-surface-700 px-1 rounded text-xs">http://</code> or <code className="font-mono bg-surface-700 px-1 rounded text-xs">https://</code>
        </p>
      )}
    </form>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4" />
      <path className="opacity-80" fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
