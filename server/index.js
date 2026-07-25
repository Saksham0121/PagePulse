// Placeholder — full implementation in Commit 2
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "PagePulse API" });
});

app.listen(PORT, () => {
  console.log(`PagePulse server running on http://localhost:${PORT}`);
});

module.exports = app;
