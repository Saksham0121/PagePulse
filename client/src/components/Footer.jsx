/**
 * Footer — required credit line + branding.
 */
export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-white/5 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7
        flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Credit line — required by assignment */}
        <p className="text-sm text-slate-500">
          Built for{" "}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 font-semibold
              transition-colors underline underline-offset-4 decoration-brand-700
              hover:decoration-brand-400"
          >
            Digital Heroes Training Task
          </a>
        </p>

        {/* Right side */}
        <div className="flex items-center gap-4 text-xs text-slate-600 font-mono">
          <span>PagePulse © {new Date().getFullYear()}</span>
          <span className="w-px h-3 bg-surface-500" />
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400 transition-colors"
          >
            digitalheroesco.com
          </a>
        </div>
      </div>
    </footer>
  );
}
