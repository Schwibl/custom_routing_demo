# Routing

## Router API

Class: `features/router.ts`. Types: `types/router.d.ts`.

| Piece | Role |
|-------|------|
| `t_Route` | `path`, `name`, `mount(params)`, optional `unmount()` |
| `t_RouteParams` | Named params from patterns like `/items/:id` |
| `t_RouterOptions` | `routes`, `fallbackPath`, optional `onChange` |
| `start()` | Bind `popstate` + click listener; render current URL |
| `navigate(to, replace?)` | `pushState` / `replaceState`, then mount match |
| `match(pathname)` | First table hit via `matchPattern` |

### Behaviour

- **History API** only (not hash). Same-origin left-clicks on `<a>` are intercepted; modifier keys, `target`, `download`, hash-only, and cross-origin links keep the browser default.
- On match change: call previous route `unmount` (if any), then `mount`, then `onChange`.
- Unknown path → `fallbackPath`. Boot uses `replaceState` so `/nope` does not leave a history entry.

Wire-up lives in `main.ts`: build the shell, pass the route table into `new Router({…})`, call `router.start()`.

## Session

Mock auth in `features/session.ts`:

| Helper | Effect |
|--------|--------|
| `isAuthenticated()` | `localStorage.getItem('demo-session') === '1'` |
| `login()` | sets `demo-session=1` |
| `logout()` | removes the key |

No backend.

## Guards

Defined in `main.ts`, called at the start of each route `mount`:

| Helper | When allowed | Otherwise |
|--------|--------------|-----------|
| `requireAuth()` | session present | `navigate('/login', true)` |
| `requireGuest()` | no session | `navigate('/feed', true)` |

Return early from `mount` when the guard redirects.

## Routes

| Path | Name | Guard |
|------|------|-------|
| `/` | root | redirect to `/feed` or `/login` by session |
| `/login` | login | guest |
| `/feed` | feed | auth |
| `/items` | items | auth |
| `/items/:id` | item | auth, numeric id |
| `/search` | search | auth, reads `?q=` |
| `/map-demo` | map-demo | auth, destroy demo |

`onChange` toggles `.app--auth` when `name === 'login'` (hides header) and updates header active/auth controls.

## Params and route order

- Patterns may include `:name` segments. Matched values land in `t_RouteParams` and are passed to `mount(params)`.
- For `/items/:id`, the id must be **numeric** (`/^\d+$/`). `/items/abc` does not match and falls through to `fallbackPath`.
- Register **more specific** patterns before less specific ones when lengths can collide (e.g. `/items/new` before `/items/:id`). This demo’s `/items` and `/items/:id` differ by segment count, so either order is safe; keep `/items/:id` after static siblings if you add any.

## Query string

Path matching ignores `?query`. Pages that need it read `window.location.search` in `init` (example: `/search?q=hello` → search page shows the query). `navigate('/search?q=…')` preserves search via the History API URL.

## appPath / subdirectory deploy

`initAppBase()` reads Vite’s `import.meta.env.BASE_URL` (from `VITE_BASE_PATH` in `vite.config.ts`). `appPath('/feed')` returns `/feed` at host root, or `/demo/feed` when base is `/demo/`.

**Rules**

- Every route `path`, `fallbackPath`, `navigate(...)`, and in-app `<a href>` must use `appPath(...)`.
- Page `ctx.navigate('/…')` is already wrapped with `appPath` in `main.ts`.
- New top-level segments belong in `SPA_ROUTE_SEGMENTS` inside `app-base.ts` if you rely on pathname derivation helpers.

**How to test**

```bash
VITE_BASE_PATH=/demo/ npm run build
npm run preview
```

Open the preview URL under `/demo/` (e.g. `http://127.0.0.1:4173/demo/`). Refresh on a deep link such as `/demo/items/1` — the SPA should still load.

## Adding a page

1. Create `blocks/foo-page.ts` with `t_PageBlock`
2. Add SCSS `blocks/foo-page.scss`, import in `main.scss`
3. Register route in `main.ts` with guard as needed
4. Add a nav link with `href` from `appPath('…')` in `app-header.ts` if surfaced in header
