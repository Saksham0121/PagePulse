/**
 * Header — branding bar at the top of the page.
 */
export default function Header() {
  return (
    <header className="w-full border-b border-surface-500/50 bg-surface-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-700/30">
              <span className="text-lg">🔍</span>
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-surface-900 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              Page<span className="text-brand-400">Pulse</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase leading-none mt-0.5">
              URL Auditor
            </p>
          </div>
        </div>

        {/* Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-700 border border-surface-500 text-xs text-slate-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
          API Live
        </div>
      </div>
    </header>
  );
}
