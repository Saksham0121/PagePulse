import { useState } from "react";

/**
 * UrlInput — URL input form with inline validation feedback.
 *
 * Props:
 *   onSubmit(url: string) — called when the form is submitted with a valid URL
 *   isLoading: boolean    — disables the form while an audit is running
 */
export default function UrlInput({ onSubmit, isLoading }) {
  const [value,   setValue]   = useState("");
  const [touched, setTouched] = useState(false);

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

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="relative group">
        {/* Glow ring on focus */}
        <div
          className={`absolute -inset-px rounded-2xl transition-opacity duration-300 pointer-events-none
            bg-gradient-to-r from-brand-600/60 to-brand-400/60 opacity-0
            group-focus-within:opacity-100`}
        />

        <div className="relative flex items-center glass-card overflow-hidden">
          {/* URL icon */}
          <span className="pl-5 pr-3 text-slate-500 text-lg shrink-0">🔗</span>

          {/* Input */}
          <input
            id="url-input"
            type="url"
            value={value}
            onChange={(e) => { setValue(e.target.value); setTouched(false); }}
            onBlur={() => setTouched(true)}
            placeholder="https://example.com"
            autoComplete="url"
            spellCheck={false}
            disabled={isLoading}
            className={`flex-1 bg-transparent py-4 pr-4 text-base text-white placeholder-slate-600
              font-mono outline-none disabled:opacity-50 transition-colors
              ${showError ? "text-red-400" : ""}`}
          />

          {/* Clear button */}
          {value && !isLoading && (
            <button
              type="button"
              onClick={() => { setValue(""); setTouched(false); }}
              className="px-3 text-slate-600 hover:text-slate-400 transition-colors shrink-0"
              aria-label="Clear input"
            >
              ✕
            </button>
          )}

          {/* Submit button */}
          <button
            id="audit-btn"
            type="submit"
            disabled={isLoading || !value.trim()}
            className="btn-primary m-2 shrink-0 flex items-center gap-2 min-w-[110px] justify-center"
          >
            {isLoading ? (
              <>
                <Spinner />
                Auditing…
              </>
            ) : (
              <>
                <span>Audit</span>
                <span className="text-sm opacity-80">→</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation error */}
      {showError && (
        <p className="mt-2 ml-1 text-sm text-red-400 animate-fade-in flex items-center gap-1.5">
          <span>⚠</span> Please enter a valid URL starting with http:// or https://
        </p>
      )}
    </form>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
