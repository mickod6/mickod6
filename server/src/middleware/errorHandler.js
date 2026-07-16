const multer = require("multer");
const { ZodError } = require("zod");
const Anthropic = require("@anthropic-ai/sdk");

function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError || err.status === 400) {
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Invalid request data", details: err.issues });
  }

  if (err instanceof Anthropic.RateLimitError) {
    return res.status(429).json({ error: "Rate limited by Claude API, please try again shortly." });
  }

  if (err instanceof Anthropic.APIConnectionError || err instanceof Anthropic.InternalServerError || err instanceof Anthropic.APIError) {
    return res.status(502).json({ error: "Failed to reach Claude API." });
  }

  console.error(err);
  return res.status(err.status || 500).json({ error: err.message || "Internal server error" });
}

module.exports = errorHandler;
