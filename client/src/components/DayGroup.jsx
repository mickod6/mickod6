import LogEntryCard from "./LogEntryCard.jsx";

export default function DayGroup({ group }) {
  return (
    <div className="day-group">
      <div className="day-group__header">
        <span className="day-group__date">{group.label}</span>
        <span className="day-group__totals">
          {Math.round(group.totals.calories)} kcal · P{Math.round(group.totals.protein_g)}g · C
          {Math.round(group.totals.carbs_g)}g · F{Math.round(group.totals.fat_g)}g
        </span>
      </div>
      <div className="log-entry-list">
        {group.entries.map((entry) => (
          <LogEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
