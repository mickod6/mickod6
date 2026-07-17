import { useState } from "react";
import PhotoInput from "../components/PhotoInput.jsx";
import MacroForm from "../components/MacroForm.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { useAnalyzeImage } from "../hooks/useAnalyzeImage.js";
import { createLogEntry, imageUrl } from "../api/client.js";

export default function CapturePage() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);
  const { status, result, error, analyze, reset } = useAnalyzeImage();

  async function handleSelect(file) {
    setSaved(false);
    setSaveError(null);
    setPreviewUrl(URL.createObjectURL(file));
    await analyze(file);
  }

  async function handleSave(values) {
    setSaving(true);
    setSaveError(null);
    try {
      await createLogEntry({ imagePath: result.imagePath, ...values });
      setSaved(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleRetake() {
    setPreviewUrl(null);
    setSaved(false);
    setSaveError(null);
    reset();
  }

  const showForm = result?.imagePath && status !== "loading";

  return (
    <div>
      <div className="page-header">
        <h1>Log a meal</h1>
      </div>

      {!previewUrl && <PhotoInput onSelect={handleSelect} />}

      {previewUrl && (
        <div className="photo-preview" style={{ marginBottom: "var(--space-4)" }}>
          <img src={result?.imagePath ? imageUrl(result.imagePath) : previewUrl} alt="Selected food" />
        </div>
      )}

      {status === "loading" && <LoadingSpinner label="Analyzing your food photo…" />}

      {status === "error" && <ErrorBanner message={`${error} You can still enter values manually below.`} />}

      {saved && (
        <div className="card" style={{ marginBottom: "var(--space-4)" }}>
          <p>✅ Saved! View it on the History tab, or log another meal.</p>
        </div>
      )}

      {showForm && !saved && (
        <>
          <MacroForm
            initialValues={{
              description: result.description || "",
              calories: result.calories ?? "",
              protein_g: result.protein_g ?? "",
              carbs_g: result.carbs_g ?? "",
              fat_g: result.fat_g ?? "",
            }}
            confidenceNote={result.confidence_note}
            onSave={handleSave}
            saving={saving}
          />
          <ErrorBanner message={saveError} />
        </>
      )}

      {previewUrl && (
        <button type="button" className="btn btn-text" onClick={handleRetake}>
          {saved ? "Log another meal" : "Retake / choose a different photo"}
        </button>
      )}
    </div>
  );
}
