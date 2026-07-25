/**
 * Header — sticky branded navigation bar.
 */
export default function Header() {
  return (
    <header className="w-full border-b border-white/5 bg-surface-900/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700
              flex items-center justify-center shadow-lg shadow-brand-700/40
              ring-1 ring-brand-500/30">
              <span className="text-lg leading-none">🔍</span>
            </div>
            {/* Live indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400
              rounded-full border-2 border-surface-900 animate-pulse-slow" />
          </div>

          <div>
            <p className="text-xl font-bold tracking-tight text-white leading-none">
              Page<span className="text-brand-400">Pulse</span>
            </p>
            <p className="text-[9px] text-slate-600 font-semibold tracking-[0.2em] uppercase leading-none mt-0.5">
              URL Auditor
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Saksham0121/PagePulse"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg
              border border-surface-500/60 text-slate-500 hover:text-slate-300
              hover:border-surface-400 text-xs font-medium transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
            bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            <span className="hidden sm:inline">API Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
