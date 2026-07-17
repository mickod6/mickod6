const express = require("express");
const { z } = require("zod");
const logsService = require("../services/logsService");
const { generateAdvice } = require("../services/claudeService");

const router = express.Router();

const AdviceRequestSchema = z.object({
  days: z.union([z.literal(7), z.literal(14), z.literal(21), z.literal(28)]).default(7),
});

router.post("/", async (req, res, next) => {
  try {
    const { days } = AdviceRequestSchema.parse(req.body ?? {});

    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    const summaryText = logsService.buildDailySummaryText(from.toISOString(), to.toISOString());

    if (!summaryText) {
      return res.status(200).json({
        advice: "You don't have any logged meals in this date range yet. Log a few meals and check back for personalised advice.",
      });
    }

    const prompt = `Here are my daily food log totals for the last ${days} days:\n\n${summaryText}\n\nGive me personalised advice based on these logs.`;
    const advice = await generateAdvice(prompt);
    res.json({ advice });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
