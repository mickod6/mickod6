import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import ErrorBanner from "./ErrorBanner.jsx";
import { useAdvice } from "../hooks/useAdvice.js";

const DAY_OPTIONS = [7, 14, 21, 28];

export default function AdviceModal({ onClose }) {
  const { status, advice, error, getAdvice } = useAdvice();

  useEffect(() => {
    getAdvice(7);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Personalised advice</h2>
          <button type="button" className="btn-text" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="advice-days-toggle">
          {DAY_OPTIONS.map((days) => (
            <button
              key={days}
              type="button"
              className="btn btn-secondary"
              style={{ width: "auto", padding: "8px 12px" }}
              onClick={() => getAdvice(days)}
              disabled={status === "loading"}
            >
              {days}d
            </button>
          ))}
        </div>

        {status === "loading" && <LoadingSpinner label="Thinking about your logs…" />}
        {status === "error" && <ErrorBanner message={error} />}
        {status === "success" && <p className="advice-text">{advice}</p>}
      </div>
    </div>
  );
}
