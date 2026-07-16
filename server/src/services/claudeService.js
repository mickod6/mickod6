const fs = require("fs");
const Anthropic = require("@anthropic-ai/sdk");
const { zodOutputFormat } = require("@anthropic-ai/sdk/helpers/zod");
// The SDK's zodOutputFormat() calls zod/v4's toJSONSchema() internally, which
// requires schemas built with the v4 API (installed zod is 3.25.x, whose
// default export is v3 — import the v4 subpath explicitly for compatibility.
const { z } = require("zod/v4");

const MODEL = "claude-sonnet-5";

const client = new Anthropic();

const FoodAnalysisSchema = z.object({
  description: z.string(),
  calories: z.number(),
  protein_g: z.number(),
  carbs_g: z.number(),
  fat_g: z.number(),
  confidence_note: z.string(),
});

const ANALYZE_SYSTEM_PROMPT = `You are a nutrition estimation assistant. You are shown a photo of a meal or food item and must estimate its nutritional content.

Always give your single best numeric estimate for calories and macros — never refuse to answer or say you can't tell. Base your estimate on visible portion size, typical ingredients, and common preparation methods.

- "description": one concise sentence naming the food and its key components.
- "calories", "protein_g", "carbs_g", "fat_g": your best-guess numeric estimates for the entire visible portion.
- "confidence_note": briefly state your portion-size assumptions and any uncertainty (e.g. "Assumed a 300g bowl; sauce content is hard to judge from the photo").`;

class FoodAnalysisError extends Error {
  constructor(message) {
    super(message);
    this.name = "FoodAnalysisError";
    this.status = 502;
  }
}

function clampRange(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

async function analyzeFoodImage(imagePath, mimeType) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Data = imageBuffer.toString("base64");

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 1024,
    system: ANALYZE_SYSTEM_PROMPT,
    output_config: { format: zodOutputFormat(FoodAnalysisSchema) },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mimeType, data: base64Data },
          },
          { type: "text", text: "Estimate the calories and macros for the food in this photo." },
        ],
      },
    ],
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new FoodAnalysisError("Claude was unable to analyze this image.");
  }

  const result = response.parsed_output;

  return {
    description: result.description,
    calories: Math.round(clampRange(result.calories, 0, 5000)),
    protein_g: clampRange(result.protein_g, 0, 500),
    carbs_g: clampRange(result.carbs_g, 0, 500),
    fat_g: clampRange(result.fat_g, 0, 500),
    confidence_note: result.confidence_note,
  };
}

const ADVICE_SYSTEM_PROMPT = `You are a supportive, practical nutrition coach. You are given a summary of someone's recent food logs (daily calorie and macro totals). Give concise, personalized, actionable advice based on the trends you see — e.g. calorie consistency, protein intake, balance of macros. Be encouraging, not judgmental. Do not give medical advice or diagnose conditions. Keep the response to a few short paragraphs of plain text.`;

async function generateAdvice(summaryText) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: ADVICE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: summaryText }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock) {
    throw new FoodAnalysisError("Claude did not return any advice text.");
  }

  return textBlock.text;
}

module.exports = { analyzeFoodImage, generateAdvice, FoodAnalysisError };
