# Custom routing demo

Small vanilla TypeScript SPA that shows how I built client routing on a production Capacitor-scale app without React Router.

## What it demonstrates

- History API router with link interception and popstate
- Auth guards (guest vs authenticated routes)
- Param route `/items/:id` with numeric validation
- Query-aware `/search?q=`
- `destroy()` cleanup on route leave (map demo ticks)
- Subdirectory deploy via `VITE_BASE_PATH` + `appPath()`

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. Click **Continue** on login (mock session in localStorage).

```bash
npm run build
npm run preview
```

## Stack

TypeScript, Vite, SCSS (BEM, vw tokens). No UI framework.

## Related work

Portfolio extract of patterns from a vanilla TS sports SPA (auth gates, flat route table, mount/unmount lifecycle). Production codebase is private; this repo is the public slice.
