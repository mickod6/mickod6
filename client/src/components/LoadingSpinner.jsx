export default function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="loading-spinner">
      <div className="spinner" role="status" aria-label={label} />
      <p>{label}</p>
    </div>
  );
}
