CREATE TABLE IF NOT EXISTS log_entries (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  logged_at       TEXT    NOT NULL,
  image_path      TEXT    NOT NULL,
  description     TEXT    NOT NULL,
  calories        INTEGER NOT NULL,
  protein_g       REAL    NOT NULL,
  carbs_g         REAL    NOT NULL,
  fat_g           REAL    NOT NULL,
  confidence_note TEXT,
  created_at      TEXT    NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_log_entries_logged_at ON log_entries(logged_at);
