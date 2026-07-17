import { format, startOfDay, subDays } from "date-fns";

export function rangeForLastNDays(days) {
  const to = new Date();
  const from = subDays(to, days);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function groupByDay(entries) {
  const groups = new Map();

  for (const entry of entries) {
    const dayKey = format(new Date(entry.loggedAt), "yyyy-MM-dd");
    if (!groups.has(dayKey)) {
      groups.set(dayKey, []);
    }
    groups.get(dayKey).push(entry);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([dayKey, dayEntries]) => ({
      dayKey,
      label: format(new Date(dayKey), "EEEE, MMM d"),
      entries: dayEntries,
      totals: dayEntries.reduce(
        (acc, e) => ({
          calories: acc.calories + e.calories,
          protein_g: acc.protein_g + e.protein_g,
          carbs_g: acc.carbs_g + e.carbs_g,
          fat_g: acc.fat_g + e.fat_g,
        }),
        { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
      ),
    }));
}

export function buildTrendSeries(entries, days) {
  const byDay = new Map();
  const today = startOfDay(new Date());

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = subDays(today, i);
    const key = format(day, "yyyy-MM-dd");
    byDay.set(key, { date: format(day, "MMM d"), calories: 0 });
  }

  for (const entry of entries) {
    const key = format(new Date(entry.loggedAt), "yyyy-MM-dd");
    if (byDay.has(key)) {
      byDay.get(key).calories += entry.calories;
    }
  }

  return [...byDay.values()];
}
