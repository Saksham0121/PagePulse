const request = require("supertest");
const nock = require("nock");
const app = require("../../index");

// Ensure network is open for this suite (unit tests may have called disableNetConnect)
beforeAll(() => nock.enableNetConnect("127.0.0.1"));

// ─── GET /health ──────────────────────────────────────────────────────────────

describe("GET /health", () => {
  test("returns 200 with service info", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      status: "ok",
      service: "PagePulse API",
    });
    expect(res.body.timestamp).toBeDefined();
  });
});

// ─── GET /api/audit — input validation ───────────────────────────────────────

describe("GET /api/audit — input validation", () => {
  test("returns 400 when url param is missing", async () => {
    const res = await request(app).get("/api/audit");

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      error: {
        code: "INVALID_URL",
        message: expect.stringContaining("url"),
      },
    });
  });

  test("returns 400 when url param is empty string", async () => {
    const res = await request(app).get("/api/audit?url=");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_URL");
  });

  test("returns 400 for a non-http URL like ftp://", async () => {
    const res = await request(app)
      .get("/api/audit")
      .query({ url: "ftp://example.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe("INVALID_URL");
  });
});

// ─── GET /api/audit — success shape ──────────────────────────────────────────

describe("GET /api/audit — success response shape", () => {
  beforeEach(() => {
    nock.cleanAll();
    // Allow localhost (supertest) but intercept external calls
    nock.enableNetConnect("127.0.0.1");
    // Mock a valid HTML response from example.com
    nock("https://example.com")
      .get("/")
      .reply(
        200,
        `<!DOCTYPE html><html><head>
          <title>Example Domain</title>
          <meta name="description" content="Example description that is long enough." />
        </head><body><h1>Example</h1><p>Some body text here.</p></body></html>`,
        { "content-type": "text/html" }
      );
  });
  afterEach(() => nock.cleanAll());

  test("returns a well-shaped audit report for https://example.com", async () => {
    const res = await request(app)
      .get("/api/audit")
      .query({ url: "https://example.com" })
      .timeout(15_000);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const d = res.body.data;
    expect(d).toHaveProperty("url", "https://example.com");
    expect(d).toHaveProperty("httpStatus", 200);
    expect(d).toHaveProperty("title", "Example Domain");
    expect(d).toHaveProperty("h1Count", 1);
    expect(d).toHaveProperty("imagesMissingAlt", expect.any(Number));
    expect(d).toHaveProperty("wordCount", expect.any(Number));
    expect(d).toHaveProperty("seoScore", expect.any(Number));
    expect(d).toHaveProperty("seoGrade", expect.stringMatching(/^[ABCDF]$/));
    expect(d).toHaveProperty("responseTime", expect.any(Number));
    expect(d).toHaveProperty("auditedAt", expect.stringMatching(/^\d{4}/));
  });
});

