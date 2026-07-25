const express = require("express");
const { auditUrl, ERROR_CODES } = require("../services/auditor");

const router = express.Router();

/**
 * GET /api/audit?url=<encoded-url>
 *
 * Audits the provided URL and returns a structured JSON report.
 *
 * Query params:
 *   url {string} — The URL to audit (must be a valid http/https URL)
 *
 * Success (200):
 *   { success: true, data: { ...auditReport } }
 *
 * Error (400/422/502/504/500):
 *   { success: false, error: { code, message } }
 */
router.get("/", async (req, res) => {
  const { url } = req.query;

  // Guard: url param must be present
  if (!url || typeof url !== "string" || url.trim() === "") {
    return res.status(400).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_URL,
        message: "Missing required query parameter: url",
      },
    });
  }

  try {
    const data = await auditUrl(url.trim());
    return res.status(200).json({ success: true, data });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const code = err.code || ERROR_CODES.SERVER_ERROR;
    const message = err.message || "An unexpected error occurred.";

    return res.status(statusCode).json({
      success: false,
      error: { code, message },
    });
  }
});

module.exports = router;
