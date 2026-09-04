# Architecture

## Module diagram

```
frontend/index.html (#app)
        │
        ▼
main.ts ── imports styles, builds shell, route table, guards
        │
        ├── features/app-base.ts     appPath() / BASE_URL
        ├── features/session.ts      demo-session localStorage
        ├── features/router.ts       History API match + navigate
        ├── blocks/app-header.ts     persistent nav
        └── blocks/*-page.ts         getMarkup + init (+ cleanup)
                │
                ▼
           .app__main outlet
```

## Data flow

```
click <a> / navigate() / popstate
        │
        ▼
Router.match(pathname) → t_Route + t_RouteParams
        │
        ├── previous cleanup / route.unmount()
        ├── route.mount(params) → guards → mountPage(block)
        │         ├── block.getMarkup() → .app__main
        │         └── block.init(ctx) → optional destroy fn
        └── onChange → .app--auth + header active / logout
```

**Demo flow:** login (guest) → Continue → `login()` + `/feed` → items → `/items/:id` → search `?q=` → map-demo (timer) → leave route (console: destroy) → Logout.

**History:** in-app links use `pushState`. Guards and root redirect use `replaceState` so failed auth and `/` do not pollute the stack. Browser back from an item returns to the items list.

## Shell

- `.app` — flex column chrome; pages only replace `.app__main`
- `.app-header` — Feed / Items / Search / Login–Logout (`appPath` href + `data-route`)
- `.app--auth` — guest layout; hides `.app-header` (login)

## Router

`Router` matches pathname to a flat table, calls `unmount` then `mount`, fires `onChange` for header state.

Navigation uses `pushState` / `replaceState`. Same-origin `<a>` clicks are intercepted.

## Page blocks

Each page exports `getMarkup()` and `init({ navigate, params })`. Optional cleanup return clears timers or listeners (map-demo destroy proof).

## Session

Demo auth is `localStorage` flag `demo-session=1`. No backend.

## Base path

`appPath()` prefixes routes with `import.meta.env.BASE_URL` for subdirectory deploys.

## Why no React Router

The production app shared one UI bundle between web and Capacitor. A small custom router kept control of mount/unmount and avoided a framework dependency on the client shell.
