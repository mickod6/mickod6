const db = require("../db");

const insertStmt = db.prepare(`
  INSERT INTO log_entries (logged_at, image_path, description, calories, protein_g, carbs_g, fat_g, confidence_note)
  VALUES (@logged_at, @image_path, @description, @calories, @protein_g, @carbs_g, @fat_g, @confidence_note)
`);

const selectByIdStmt = db.prepare(`SELECT * FROM log_entries WHERE id = ?`);

const selectRangeStmt = db.prepare(`
  SELECT * FROM log_entries
  WHERE logged_at >= @from AND logged_at <= @to
  ORDER BY logged_at DESC
`);

const deleteStmt = db.prepare(`DELETE FROM log_entries WHERE id = ?`);

function createEntry(entry) {
  const payload = {
    logged_at: entry.loggedAt || new Date().toISOString(),
    image_path: entry.imagePath,
    description: entry.description,
    calories: entry.calories,
    protein_g: entry.protein_g,
    carbs_g: entry.carbs_g,
    fat_g: entry.fat_g,
    confidence_note: entry.confidence_note || null,
  };
  const info = insertStmt.run(payload);
  return getEntryById(info.lastInsertRowid);
}

function getEntryById(id) {
  return selectByIdStmt.get(id);
}

function listEntries(fromIso, toIso) {
  return selectRangeStmt.all({ from: fromIso, to: toIso });
}

function deleteEntry(id) {
  return deleteStmt.run(id);
}

function buildDailySummaryText(fromIso, toIso) {
  const entries = listEntries(fromIso, toIso);
  if (entries.length === 0) {
    return null;
  }

  const byDay = new Map();
  for (const entry of entries) {
    const day = entry.logged_at.slice(0, 10);
    if (!byDay.has(day)) {
      byDay.set(day, { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, count: 0 });
    }
    const totals = byDay.get(day);
    totals.calories += entry.calories;
    totals.protein_g += entry.protein_g;
    totals.carbs_g += entry.carbs_g;
    totals.fat_g += entry.fat_g;
    totals.count += 1;
  }

  const days = [...byDay.entries()].sort(([a], [b]) => (a < b ? -1 : 1));

  return days
    .map(([day, totals]) => {
      return `${day}: ${Math.round(totals.calories)} kcal, ${Math.round(totals.protein_g)}g protein, ${Math.round(totals.carbs_g)}g carbs, ${Math.round(totals.fat_g)}g fat (${totals.count} ${totals.count === 1 ? "entry" : "entries"})`;
    })
    .join("\n");
}

module.exports = {
  createEntry,
  getEntryById,
  listEntries,
  deleteEntry,
  buildDailySummaryText,
};
