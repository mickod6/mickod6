import { useState } from "react";
import { fetchAdvice } from "../api/client.js";

export function useAdvice() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState(null);

  async function getAdvice(days) {
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchAdvice(days);
      setAdvice(data.advice);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return { status, advice, error, getAdvice };
}
