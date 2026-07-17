import { useState } from "react";
import DayGroup from "../components/DayGroup.jsx";
import CalorieTrendChart from "../components/CalorieTrendChart.jsx";
import AdviceModal from "../components/AdviceModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { useLogEntries } from "../hooks/useLogEntries.js";
import { groupByDay, buildTrendSeries } from "../utils/dateHelpers.js";

const RANGE_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
];

export default function HistoryPage() {
  const [days, setDays] = useState(7);
  const [showAdvice, setShowAdvice] = useState(false);
  const { entries, status, error } = useLogEntries(days);

  const groups = groupByDay(entries);
  const trendData = buildTrendSeries(entries, days);

  return (
    <div>
      <div className="page-header">
        <h1>History</h1>
      </div>

      <div className="range-toggle">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={days === opt.value ? "active" : ""}
            onClick={() => setDays(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="card chart-card">
        <h2>Calories per day</h2>
        <CalorieTrendChart data={trendData} />
      </div>

      <button type="button" className="btn btn-primary advice-trigger" onClick={() => setShowAdvice(true)}>
        ✨ Get personalised advice
      </button>

      {status === "loading" && <LoadingSpinner label="Loading your logs…" />}
      {status === "error" && <ErrorBanner message={error} />}

      {status === "success" && groups.length === 0 && (
        <p className="empty-state">No meals logged in this range yet. Head to the Log tab to add one.</p>
      )}

      {status === "success" && groups.map((group) => <DayGroup key={group.dayKey} group={group} />)}

      {showAdvice && <AdviceModal onClose={() => setShowAdvice(false)} />}
    </div>
  );
}
