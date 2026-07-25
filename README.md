# 🔍 PagePulse — URL Auditor

> A full-stack web tool that audits any URL and returns a detailed report on SEO health, performance, and page structure.

---

## ✨ Features

- **HTTP Status** — Check if the page is live and returning correct status codes
- **Response Time** — Measure server response speed in milliseconds
- **Page Title** — Extract and evaluate the `<title>` tag
- **Meta Description** — Check presence and length of meta description
- **H1 Count** — Validate heading structure
- **Images Missing Alt Text** — Accessibility audit for images
- **Word Count** — Approximate page content length
- **SEO Score** — Computed 0–100 score with letter grade
- **Audit History** — Quick access to last 5 audited URLs

---

## 🛠️ Tech Stack

| Layer     | Technology                   |
|-----------|------------------------------|
| Frontend  | React.js + Vite + Tailwind CSS v3 |
| Backend   | Node.js + Express.js         |
| Parsing   | Cheerio                      |
| HTTP      | Axios                        |

---

## 🚀 Getting Started

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
```

### 3. Start the frontend
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 API

### `GET /api/audit?url=<encoded-url>`

**Success response:**
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
    "seoScore": 85,
    "auditedAt": "2026-07-25T06:00:00.000Z"
  }
}
```

**Error response:**
```json
{
  "success": false,
  "error": {
    "code": "TIMEOUT",
    "message": "The request timed out after 10 seconds."
  }
}
```

---

## 📜 License
MIT

---

*Built for Digital Heroes Training Task — [digitalheroesco.com](https://digitalheroesco.com)*
