const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const auditRouter  = require("./src/routes/audit");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
/** Health-check — confirms the service is running */
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "PagePulse API", timestamp: new Date().toISOString() });
});

/** Main audit endpoint */
app.use("/api/audit", auditRouter);

/** 404 fallback */
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Route not found." } });
});

// ── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 PagePulse server running on http://localhost:${PORT}`);
});

module.exports = app;
