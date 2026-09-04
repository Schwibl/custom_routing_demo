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

## Routes

| Path | Name | Guard |
|------|------|-------|
| `/` | root | redirect |
| `/login` | login | guest |
| `/feed` | feed | auth |
| `/items` | items | auth |
| `/items/:id` | item | auth, numeric id |
| `/search` | search | auth, reads `?q=` |
| `/map-demo` | map-demo | auth, destroy demo |

## Guards

- `requireAuth` → `/login` replace
- `requireGuest` → `/feed` replace

## appPath

All router paths and links go through `appPath()` from `features/app-base.ts`.

## Adding a page

1. Create `blocks/foo-page.ts` with `t_PageBlock`
2. Add SCSS `blocks/foo-page.scss`, import in `main.scss`
3. Register route in `main.ts` with guard as needed
4. Add nav link in `app-header.ts` if surfaced in header
