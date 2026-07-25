/**
 * Global error handling middleware.
 * Catches any unhandled errors passed via next(err) in Express.
 */
function errorHandler(err, _req, res, _next) {
  console.error("[PagePulse Error]", err.message || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      code:    err.code    || "SERVER_ERROR",
      message: err.message || "An unexpected error occurred.",
    },
  });
}

module.exports = errorHandler;
