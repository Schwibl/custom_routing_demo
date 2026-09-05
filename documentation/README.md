# Custom routing demo

Vanilla TypeScript SPA that demonstrates a History API client router — the same pattern used in a production hybrid web/native sports app, without React Router.

## What this proves

- Flat route table with `requireAuth` / `requireGuest` and mock session
- Params (`/items/:id`), query (`/search?q=`), and `destroy` cleanup on leave
- Subdirectory deploy via `VITE_BASE_PATH` + `appPath()`

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. Click **Continue** on login (`demo-session` in localStorage).

```bash
npm run build
npm run preview
```

More: [`dev/local_server.md`](./dev/local_server.md), [`architecture.md`](./architecture.md), [`tech/routing_tech.md`](./tech/routing_tech.md).

## Stack

TypeScript, Vite, SCSS (BEM, vw tokens). No UI framework.

## Origin

Public slice of routing patterns from a private vanilla TS codebase (auth gates, mount/unmount lifecycle). Client names omitted.
