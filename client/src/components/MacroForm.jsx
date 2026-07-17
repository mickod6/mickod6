import { useState, useEffect } from "react";

const EMPTY_FORM = {
  description: "",
  calories: "",
  protein_g: "",
  carbs_g: "",
  fat_g: "",
};

export default function MacroForm({ initialValues, confidenceNote, onSave, saving }) {
  const [values, setValues] = useState({ ...EMPTY_FORM, ...initialValues });

  useEffect(() => {
    setValues({ ...EMPTY_FORM, ...initialValues });
  }, [initialValues]);

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      description: values.description,
      calories: Number(values.calories) || 0,
      protein_g: Number(values.protein_g) || 0,
      carbs_g: Number(values.carbs_g) || 0,
      fat_g: Number(values.fat_g) || 0,
    });
  }

  return (
    <form className="macro-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="e.g. Grilled chicken salad"
          required
        />
      </div>

      <div className="macro-grid">
        <div className="field">
          <label htmlFor="calories">Calories</label>
          <input
            id="calories"
            type="number"
            inputMode="decimal"
            min="0"
            value={values.calories}
            onChange={(e) => update("calories", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="protein">Protein (g)</label>
          <input
            id="protein"
            type="number"
            inputMode="decimal"
            min="0"
            value={values.protein_g}
            onChange={(e) => update("protein_g", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="carbs">Carbs (g)</label>
          <input
            id="carbs"
            type="number"
            inputMode="decimal"
            min="0"
            value={values.carbs_g}
            onChange={(e) => update("carbs_g", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="fat">Fat (g)</label>
          <input
            id="fat"
            type="number"
            inputMode="decimal"
            min="0"
            value={values.fat_g}
            onChange={(e) => update("fat_g", e.target.value)}
            required
          />
        </div>
      </div>

      {confidenceNote && <p className="confidence-note">🤖 {confidenceNote}</p>}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}
