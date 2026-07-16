const express = require("express");
const fs = require("fs");
const path = require("path");
const { z } = require("zod");
const logsService = require("../services/logsService");
const { parseDateRange } = require("../utils/dateRange");
const { uploadDir } = require("../middleware/upload");

const router = express.Router();

const CreateLogSchema = z.object({
  imagePath: z.string().min(1),
  description: z.string().min(1),
  calories: z.number(),
  protein_g: z.number(),
  carbs_g: z.number(),
  fat_g: z.number(),
  confidence_note: z.string().optional(),
  loggedAt: z.string().optional(),
});

function serializeEntry(row) {
  return {
    id: row.id,
    loggedAt: row.logged_at,
    imagePath: row.image_path,
    description: row.description,
    calories: row.calories,
    protein_g: row.protein_g,
    carbs_g: row.carbs_g,
    fat_g: row.fat_g,
    confidence_note: row.confidence_note,
    createdAt: row.created_at,
  };
}

router.post("/", (req, res, next) => {
  try {
    const data = CreateLogSchema.parse(req.body);
    const row = logsService.createEntry({
      imagePath: data.imagePath,
      description: data.description,
      calories: data.calories,
      protein_g: data.protein_g,
      carbs_g: data.carbs_g,
      fat_g: data.fat_g,
      confidence_note: data.confidence_note,
      loggedAt: data.loggedAt,
    });
    res.status(201).json(serializeEntry(row));
  } catch (err) {
    next(err);
  }
});

router.get("/", (req, res, next) => {
  try {
    const { fromIso, toIso } = parseDateRange(req.query);
    const rows = logsService.listEntries(fromIso, toIso);
    res.json({ entries: rows.map(serializeEntry) });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const row = logsService.getEntryById(Number(req.params.id));
    if (!row) {
      return res.status(404).json({ error: "Log entry not found." });
    }
    res.json(serializeEntry(row));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const row = logsService.getEntryById(Number(req.params.id));
    if (!row) {
      return res.status(404).json({ error: "Log entry not found." });
    }
    logsService.deleteEntry(row.id);

    const filePath = path.join(uploadDir, path.basename(row.image_path));
    fs.unlink(filePath, () => {});

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
