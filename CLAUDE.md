# Food Tracker — project notes for Claude Code

Photo-based calorie/macro tracker. Take a photo of food, Claude estimates calories and macros, entries are logged to SQLite, history is browsable over time, and Claude can generate personalized advice from the logs. Single-user, no auth, built as a short-term learning/deployment exercise (not a production app).

## Stack

- **Client**: React + Vite, plain CSS (mobile-first, no framework) — `client/`
- **Server**: Node.js + Express + `better-sqlite3` (WAL mode) — `server/`
- **AI**: Anthropic Claude, model `claude-sonnet-5`, via `@anthropic-ai/sdk` — `server/src/services/claudeService.js`
  - Food photo analysis uses structured outputs: `client.messages.parse()` + `zodOutputFormat()` from `@anthropic-ai/sdk/helpers/zod`
  - Advice generation is a plain `client.messages.create()` text call
- Root `npm run dev` uses npm workspaces + `concurrently` to run server (`:4000`) and client (`:5173`) together

## Known gotchas (already solved once — don't re-debug these)

- **Zod v4, not v3**: `zodOutputFormat()` requires v4-shaped schemas. Must `require("zod/v4")`, not plain `require("zod")` (the installed package's default export is v3). See the comment in `claudeService.js`.
- **Anthropic error classes**: the installed SDK exports `Anthropic.APIError` as the base error class — there is no `APIStatusError`. Check `err instanceof Anthropic.APIError` etc. in `server/src/middleware/errorHandler.js`.
- **multer**: pinned to `^2.0.0` (1.x has known CVEs).
- **SQLite WAL files**: `better-sqlite3` runs in WAL mode, which creates `*.db-shm` / `*.db-wal` alongside `*.db` — all three are gitignored.

## Deployment

- **Frontend**: Vercel, monorepo Root Directory set to `client`, env var `VITE_API_BASE_URL` pointed at the Render backend. Use the stable production domain (not the random per-deployment preview URLs) when testing — `CORS_ORIGIN` on the server only allows the stable domain.
- **Backend**: Render Web Service, Root Directory `server`, env vars `ANTHROPIC_API_KEY` and `CORS_ORIGIN` (set to the Vercel production domain). Free tier has no persistent disk and spins down after ~15 min idle — this was set up as a short-term/learning deployment, not for long-term data retention.
- Full step-by-step rebuild instructions live in the `deploy-fullstack-app` Claude Code skill (`~/.claude/skills/deploy-fullstack-app/SKILL.md` on the user's machine).

## Data model

Single table, `server/src/db/schema.sql`: `log_entries` (id, logged_at, image_path, description, calories, protein_g, carbs_g, fat_g, confidence_note, created_at).

## API

- `POST /api/analyze` — multipart `photo` → saves image, calls Claude, returns estimate
- `POST /api/logs`, `GET /api/logs?from=&to=`, `GET /api/logs/:id`, `DELETE /api/logs/:id`
- `POST /api/advice` — `{ days }` → builds a daily-totals text summary, asks Claude for personalized advice

## Local folder

This repo lives at `Claude Code Projects\food-calorie-tracker` on the user's Windows PC (moved there from a flat clone location; folder itself was later renamed from `Projects` to `Claude Code Projects`).
