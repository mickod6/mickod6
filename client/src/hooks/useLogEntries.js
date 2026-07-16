import { useCallback, useEffect, useState } from "react";
import { fetchLogEntries } from "../api/client.js";
import { rangeForLastNDays } from "../utils/dateHelpers.js";

export function useLogEntries(days) {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const { from, to } = rangeForLastNDays(days);
      const data = await fetchLogEntries({ from, to });
      setEntries(data.entries);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  return { entries, status, error, reload: load };
}
