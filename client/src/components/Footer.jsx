/**
 * Footer — credit line required by the assignment.
 */
export default function Footer() {
  return (
    <footer className="w-full border-t border-surface-500/40 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <p>
          Built for{" "}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors underline underline-offset-2"
          >
            Digital Heroes Training Task
          </a>
        </p>
        <p className="text-slate-600 text-xs font-mono">
          PagePulse © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
