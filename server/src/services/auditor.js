const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Error codes for structured error responses.
 */
const ERROR_CODES = {
  INVALID_URL:  "INVALID_URL",
  TIMEOUT:      "TIMEOUT",
  NON_HTML:     "NON_HTML",
  FETCH_FAILED: "FETCH_FAILED",
  SERVER_ERROR: "SERVER_ERROR",
};

/**
 * Validates that a string is a well-formed HTTP/HTTPS URL.
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Computes an SEO score (0–100) based on audit metrics.
 * Scoring breakdown:
 *  - Title present & 10–60 chars          : 20pts
 *  - Meta description present & 50–160 chars: 20pts
 *  - Exactly one H1                        : 20pts
 *  - No images missing alt                 : 20pts
 *  - HTTP 200                              : 10pts
 *  - Response time < 1000ms               : 10pts
 *
 * @param {Object} metrics
 * @returns {{ score: number, grade: string }}
 */
function computeSeoScore(metrics) {
  let score = 0;

  // Title (20pts)
  if (metrics.title) {
    const len = metrics.title.length;
    score += len >= 10 && len <= 60 ? 20 : 10;
  }

  // Meta description (20pts)
  if (metrics.metaDescription) {
    const len = metrics.metaDescription.length;
    score += len >= 50 && len <= 160 ? 20 : 10;
  }

  // H1 count (20pts)
  if (metrics.h1Count === 1) score += 20;
  else if (metrics.h1Count > 1) score += 10;

  // Images missing alt (20pts)
  if (metrics.imagesMissingAlt === 0) score += 20;
  else if (metrics.imagesMissingAlt <= 2) score += 10;

  // HTTP status (10pts)
  if (metrics.httpStatus >= 200 && metrics.httpStatus < 300) score += 10;

  // Response time (10pts)
  if (metrics.responseTime < 500) score += 10;
  else if (metrics.responseTime < 1000) score += 5;

  const grade =
    score >= 90 ? "A" :
    score >= 75 ? "B" :
    score >= 60 ? "C" :
    score >= 40 ? "D" : "F";

  return { score, grade };
}

/**
 * Audits a URL and returns a structured report.
 * @param {string} url - The URL to audit
 * @returns {Promise<Object>} Audit report data
 * @throws {Object} Structured error with { code, message }
 */
async function auditUrl(url) {
  // 1. Validate URL format
  if (!isValidUrl(url)) {
    const err = new Error("Invalid URL format. Must start with http:// or https://.");
    err.code = ERROR_CODES.INVALID_URL;
    err.statusCode = 400;
    throw err;
  }

  let response;
  const startTime = Date.now();

  // 2. Fetch the page
  try {
    response = await axios.get(url, {
      timeout: 10_000, // 10 second timeout
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PagePulse/1.0; +https://pagepulse.dev)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      // Accept all status codes so we can report them
      validateStatus: () => true,
    });
  } catch (fetchError) {
    if (fetchError.code === "ECONNABORTED" || fetchError.message?.includes("timeout")) {
      const err = new Error("The request timed out after 10 seconds.");
      err.code = ERROR_CODES.TIMEOUT;
      err.statusCode = 504;
      throw err;
    }
    const err = new Error(
      `Failed to reach the URL: ${fetchError.message || "Network error"}`
    );
    err.code = ERROR_CODES.FETCH_FAILED;
    err.statusCode = 502;
    throw err;
  }

  const responseTime = Date.now() - startTime;

  // 3. Validate Content-Type is HTML
  const contentType = response.headers["content-type"] || "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    const err = new Error(
      `Expected HTML but received: ${contentType.split(";")[0].trim()}`
    );
    err.code = ERROR_CODES.NON_HTML;
    err.statusCode = 422;
    throw err;
  }

  // 4. Parse HTML with cheerio
  const $ = cheerio.load(response.data);

  const title = $("title").first().text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    null;

  const h1Count = $("h1").length;

  // Count images missing meaningful alt text
  let imagesMissingAlt = 0;
  $("img").each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined || alt === null || alt.trim() === "") {
      imagesMissingAlt++;
    }
  });

  // Approximate word count from visible text
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText
    ? bodyText.split(" ").filter((w) => w.length > 0).length
    : 0;

  const metrics = {
    httpStatus: response.status,
    responseTime,
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    wordCount,
  };

  const { score: seoScore, grade: seoGrade } = computeSeoScore(metrics);

  return {
    url,
    ...metrics,
    seoScore,
    seoGrade,
    auditedAt: new Date().toISOString(),
  };
}

module.exports = { auditUrl, ERROR_CODES };
