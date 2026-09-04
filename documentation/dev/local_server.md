# Local dev

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve `dist/` locally |

## Env

Copy `.env.example` to `.env` if needed.

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_BASE_PATH` | `/` | Asset and route base for subdirectory deploy |

Test subdirectory: `VITE_BASE_PATH=/demo/ npm run build` then `npm run preview`.

## SPA fallback

Vite dev and preview serve `index.html` for unknown paths — deep links work on refresh.
