import { useState } from "react";
import { analyzePhoto } from "../api/client.js";

export function useAnalyzeImage() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function analyze(file) {
    setStatus("loading");
    setError(null);
    setResult(null);
    try {
      const data = await analyzePhoto(file);
      setResult(data);
      setStatus("success");
      return data;
    } catch (err) {
      setError(err.message);
      // The server still returns imagePath even on a Claude failure, so the
      // caller can fall back to manual entry against the saved photo.
      setResult(err.body?.imagePath ? { imagePath: err.body.imagePath } : null);
      setStatus("error");
      return null;
    }
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setError(null);
  }

  return { status, result, error, analyze, reset };
}
