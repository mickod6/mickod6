const express = require("express");
const path = require("path");
const { upload } = require("../middleware/upload");
const { analyzeFoodImage } = require("../services/claudeService");

const router = express.Router();

router.post("/", upload.single("photo"), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No photo file was provided (expected field 'photo')." });
  }

  const imagePath = `/uploads/${path.basename(req.file.path)}`;

  try {
    const analysis = await analyzeFoodImage(req.file.path, req.file.mimetype);
    return res.json({ imagePath, ...analysis });
  } catch (err) {
    // The photo is already saved on disk — return its path so the client
    // can fall back to manual entry against the same image.
    res.status(err.status || 502);
    return res.json({ imagePath, error: err.message || "Failed to analyze image." });
  }
});

module.exports = router;
