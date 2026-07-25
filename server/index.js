const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const auditRouter = require("./src/routes/audit");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ── CORS ────────────────────────────────────────────────────────────────────
// In production: allow only the ALLOWED_ORIGIN env var (set to Vercel URL).
// In development: allow all origins.
const allowedOrigin = process.env.ALLOWED_ORIGIN;

app.use(
  cors({
    origin: allowedOrigin
      ? [allowedOrigin, /\.vercel\.app$/]   // prod: explicit domain + all Vercel previews
      : "*",                                 // dev: open
    methods: ["GET"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
/** Health-check — Render uses this to verify the service is up */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "PagePulse API",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/** Main audit endpoint */
app.use("/api/audit", auditRouter);

/** 404 fallback */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found." },
  });
});

// ── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ── Start (skip when imported by tests) ─────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 PagePulse server running on http://localhost:${PORT}`);
    if (allowedOrigin) {
      console.log(`   CORS allowed origin: ${allowedOrigin}`);
    }
  });
}

module.exports = app;
