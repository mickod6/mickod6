import { format } from "date-fns";
import { imageUrl } from "../api/client.js";

export default function LogEntryCard({ entry }) {
  return (
    <div className="log-entry-card">
      <div className="log-entry-card__thumb">
        <img src={imageUrl(entry.imagePath)} alt={entry.description} loading="lazy" />
      </div>
      <div className="log-entry-card__body">
        <div className="log-entry-card__desc">{entry.description}</div>
        <div className="log-entry-card__macros">
          {Math.round(entry.calories)} kcal · P{Math.round(entry.protein_g)}g · C{Math.round(entry.carbs_g)}g · F
          {Math.round(entry.fat_g)}g
        </div>
      </div>
      <div className="log-entry-card__time">{format(new Date(entry.loggedAt), "h:mm a")}</div>
    </div>
  );
}
