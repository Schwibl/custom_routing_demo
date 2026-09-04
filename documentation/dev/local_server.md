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
| `VITE_BASE_PATH` | `/` | Vite `base` + `import.meta.env.BASE_URL` for subdirectory deploy |

## Subdirectory deploy

1. Build with a trailing-slash base:

```bash
VITE_BASE_PATH=/demo/ npm run build
npm run preview
```

2. Open the app under that prefix (preview serves assets from `/demo/`).
3. Confirm header links and refresh on `/demo/feed` or `/demo/items/1` stay in the SPA.

Dev with a base: `VITE_BASE_PATH=/demo/ npm run dev`, then visit `http://localhost:5173/demo/`.

Route helpers: `appPath()` in `features/app-base.ts` — see [`routing_tech.md`](../tech/routing_tech.md).

## SPA fallback

Vite dev and preview serve `index.html` for unknown paths — deep links work on refresh. Static hosts (nginx, GitHub Pages) need an equivalent rewrite; a Pages deploy script is not in this repo yet.
