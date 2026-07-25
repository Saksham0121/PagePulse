#  PagePulse — URL Auditor

> A full-stack web tool that audits any URL and returns a detailed report on SEO health, performance, and page structure.

##  Live Demo

| | URL |
|---|---|
| **Frontend** | [https://page-pulse-indol.vercel.app](https://page-pulse-indol.vercel.app) |
| **Backend API** | [https://paglpulse-api.onrender.com](https://paglpulse-api.onrender.com) |
| **Health Check** | [https://paglpulse-api.onrender.com/health](https://paglpulse-api.onrender.com/health) |

---

##  Features

- **HTTP Status** — Check if the page is live and returning correct status codes
- **Response Time** — Measure server response speed in milliseconds
- **Page Title** — Extract and evaluate the `<title>` tag
- **Meta Description** — Check presence and length of meta description
- **H1 Count** — Validate heading structure
- **Images Missing Alt Text** — Accessibility audit for images
- **Word Count** — Approximate page content length
- **SEO Score** — Computed 0–100 score with A/B/C/D/F letter grade
- **Audit History** — Quick access to last 5 audited URLs (localStorage)
- **Export JSON** — Download the full audit report as a JSON file

---

## 📈 SEO Score Calculation & Grading

The overall SEO score (0–100) is determined dynamically on the backend using the following criteria weights:

| SEO Metric | Maximum Weight | Calculation Logic |
| :--- | :---: | :--- |
| **Page Title** | **20 Points** | 20 points if present and has 10–60 characters.<br>10 points if present but length is outside 10–60 range.<br>0 points if completely missing. |
| **Meta Description** | **20 Points** | 20 points if present and has 50–160 characters.<br>10 points if present but length is outside 50–160 range.<br>0 points if completely missing. |
| **H1 Heading Structure** | **20 Points** | 20 points if page contains exactly one `<h1>` tag (SEO best practice).<br>10 points if page contains multiple `<h1>` tags.<br>0 points if page contains no `<h1>` tags. |
| **Alt Text Accessibility** | **20 Points** | 20 points if 0 images are missing `alt` attributes.<br>10 points if only 1 or 2 images are missing `alt` attributes.<br>0 points if 3 or more images are missing `alt` attributes. |
| **HTTP Status Code** | **10 Points** | 10 points if HTTP status code is a successful `2xx` response.<br>0 points for all other status codes (e.g., 404, 500, 403). |
| **Server Response Time** | **10 Points** | 10 points if the response time is fast (< 500ms).<br>5 points if response time is average (500ms–1000ms).<br>0 points if response time is slow (> 1000ms). |

### Letter Grade Scale

The final letter grade is mapped based on the aggregated score:

*   **A Grade**: Score `90` – `100` (Excellent SEO Foundation)
*   **B Grade**: Score `75` – `89` (Good SEO structure, minor fixes needed)
*   **C Grade**: Score `60` – `74` (Needs improvement in page configuration)
*   **D Grade**: Score `40` – `59` (Critical SEO tags missing or bad response)
*   **F Grade**: Score `0` – `39` (Unsatisfactory or failed audits / unreachable server)


---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js + Vite + Tailwind CSS v3 |
| Backend   | Node.js + Express.js              |
| Parsing   | Cheerio                           |
| HTTP      | Axios                             |
| Testing   | Jest + Supertest + Nock           |
| Deploy FE | Vercel                            |
| Deploy BE | Render                            |

---

## Getting Started Locally

### Prerequisites
- Node.js >= 18

### 1. Clone the repo
```bash
git clone https://github.com/Saksham0121/PagePulse.git
cd PagePulse
```

### 2. Start the backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
# Runs on http://localhost:5001
```

### 3. Start the frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

### 4. Run tests
```bash
cd server
npm test
```

---

## API Contract

### `GET /api/audit?url=<encoded-url>`

Fetches the given URL and returns a structured SEO + performance report.

**Query Parameters:**

| Param | Type   | Required | Description |
|-------|--------|----------|-------------|
| `url` | string | ✅ Yes   | A valid `http://` or `https://` URL to audit |

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "httpStatus": 200,
    "responseTime": 342,
    "title": "Example Domain",
    "metaDescription": "An example domain.",
    "h1Count": 1,
    "imagesMissingAlt": 0,
    "wordCount": 312,
    "seoScore": 80,
    "seoGrade": "B",
    "auditedAt": "2026-07-25T06:00:00.000Z"
  }
}
```

**Error response (4xx / 5xx):**
```json
{
  "success": false,
  "error": {
    "code": "TIMEOUT",
    "message": "The request timed out after 10 seconds."
  }
}
```

**Error Codes:**

| Code | HTTP | Cause |
|------|------|-------|
| `INVALID_URL` | 400 | URL is missing, empty, or not a valid http/https URL |
| `TIMEOUT` | 504 | Target server did not respond within 10 seconds |
| `NON_HTML` | 422 | Response Content-Type is not `text/html` (e.g. PDF, image) |
| `FETCH_FAILED` | 502 | Network error, DNS failure, or connection refused |
| `SERVER_ERROR` | 500 | Unexpected internal server error |

### `GET /health`

Returns service health status. Used by Render to confirm the process is running.

```json
{ "status": "ok", "service": "PagePulse API", "env": "production", "timestamp": "..." }
```

---

## Tests

Tests live in `server/src/__tests__/` and are run with Jest.

```bash
cd server && npm test
```

| File | What it tests |
|------|---------------|
| `auditor.test.js` | Unit tests for the HTML parsing service (mocked HTTP via nock) |
| `routes.test.js`  | Integration tests for Express routes via supertest |

**Test coverage:**
- ✅ Happy path — correct data extraction from valid HTML
- ✅ Missing alt text counting accuracy
- ✅ `og:description` fallback when `name="description"` is absent
- ✅ `INVALID_URL` — 5 invalid URL formats rejected
- ✅ `TIMEOUT` — slow server triggers correct error code
- ✅ `NON_HTML` — PDF and image responses rejected cleanly
- ✅ `FETCH_FAILED` — DNS failure handled gracefully
- ✅ Route: missing `url` param returns 400
- ✅ Route: health check returns 200
- ✅ Route: 404 fallback for unknown routes

---

## Design Decisions

### 1. Cheerio over Puppeteer for HTML parsing

**Decision:** Use `cheerio` (server-side jQuery) to parse HTML rather than a headless browser like Puppeteer.

**Reasoning:**
- **Performance** — Cheerio parses static HTML in ~5ms. Puppeteer launches a full Chromium instance which takes 2–5 seconds and ~300MB RAM. For a URL auditor hitting tens of thousands of URLs, this difference is enormous.
- **Simplicity** — Cheerio has zero native dependencies, deploys cleanly on Render's free tier, and requires no additional binary setup.
- **Trade-off accepted** — JavaScript-rendered content (SPAs) won't be fully parsed. Titles from React/Vue apps that render client-side will show the raw HTML template. This is a reasonable trade-off since the tool targets server-rendered and static pages. If SPA support were a hard requirement, a lightweight solution like `linkedom` or a selective `playwright` integration would be the next step.

---

### 2. Structured error codes with HTTP status mapping

**Decision:** Every error thrown by the auditor service carries a `code` string (e.g. `TIMEOUT`, `NON_HTML`) and a mapped HTTP status code, rather than passing raw JavaScript error objects to the route handler.

**Reasoning:**
- **API clarity** — Clients can `switch` on `error.code` and show targeted UI messages (e.g. "The page timed out" vs "This is a PDF, not a webpage") instead of a generic "something went wrong."
- **Separation of concerns** — The `auditor.js` service owns the business-logic of what *kind* of failure occurred. The route handler only reads `err.statusCode` and forwards the payload. The error middleware is a clean catch-all for anything unexpected.
- **If I had another day** — I would add a `retryable: boolean` field to the error payload so the frontend could automatically offer a "Retry" button only for transient failures like `TIMEOUT` and `FETCH_FAILED`, while keeping `INVALID_URL` and `NON_HTML` as permanent user errors.

---

### 3. SEO score computed server-side, not client-side

**Decision:** The SEO score (0–100) and letter grade (A–F) are calculated in `auditor.js` on the server and returned as fields in the JSON response, rather than being derived in the React frontend from the raw metrics.

**Reasoning:**
- **Testability** — Server-side scoring is fully unit-testable with deterministic inputs. Testing a pure function `computeSeoScore({ h1Count: 1, ... })` is straightforward; testing a React component's displayed grade requires a full DOM render.
- **API completeness** — External consumers of the API (scripts, CI pipelines, browser extensions) get the score without needing to re-implement the scoring logic.
- **Consistency** — The scoring rubric is in one place. If weights change (e.g. "H1 count is now worth 30 points"), it propagates to all consumers automatically.
- **If I had another day** — I would expose the scoring rubric itself as a `GET /api/scoring-rubric` endpoint so consumers can show users *why* they got their score — which criteria they passed, which they failed, and by how much.

---

## Project Structure

```
PagePulse/
├── client/                    # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── UrlInput.jsx
│   │   │   ├── AuditReport.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── AuditHistory.jsx
│   │   ├── hooks/
│   │   │   ├── useAudit.js
│   │   │   └── useHistory.js
│   │   ├── constants.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
└── server/                    # Express.js backend
    ├── src/
    │   ├── __tests__/
    │   │   ├── auditor.test.js   # Unit tests (mocked HTTP)
    │   │   └── routes.test.js    # Integration tests (supertest)
    │   ├── routes/audit.js
    │   ├── services/auditor.js
    │   └── middleware/errorHandler.js
    ├── index.js
    └── package.json
```

---
## 📜 License
MIT
---
*Built for Digital Heroes Training Task — [digitalheroesco.com](https://digitalheroesco.com)*