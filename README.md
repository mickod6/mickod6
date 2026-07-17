# Food Tracker

Take a photo of your food, get an AI-estimated calorie/macro breakdown, log it, and track trends over time. Ask for personalised nutrition advice based on your logs.

## Stack

- **Client**: React + Vite (mobile-first UI)
- **Server**: Node.js + Express + SQLite (`better-sqlite3`)
- **AI**: Claude (`claude-sonnet-5`) via the Anthropic SDK — vision analysis of food photos, and text-based personalised advice

## Setup

1. Install dependencies (root workspace installs both client and server):

   ```sh
   npm install
   ```

2. Configure the server environment:

   ```sh
   cp server/.env.example server/.env
   ```

   Edit `server/.env` and set `ANTHROPIC_API_KEY` to your Anthropic API key.

3. Configure the client environment:

   ```sh
   cp client/.env.example client/.env
   ```

   The default `VITE_API_BASE_URL=http://localhost:4000` works for local dev.

## Run

```sh
npm run dev
```

This starts the API server on `http://localhost:4000` and the Vite dev server on `http://localhost:5173`. Open the client URL in your browser (or on your phone, on the same network, using your machine's LAN IP instead of `localhost`) — the "Take Photo" button uses the device camera automatically over a secure context.

On first run, `server/data/food.db` is created automatically and the schema is applied.

## Notes

- Uploaded food photos are stored in `server/uploads/` and referenced by log entries so you can see them in your history.
- No login/auth — this is built for single-user personal use.
- The database is plain SQLite so this can later be pointed at a hosted disk (e.g. Render) via the `DB_PATH` env var, and the client/server can be deployed as separate services (e.g. Render + Vercel) using `VITE_API_BASE_URL` / `CORS_ORIGIN`.
