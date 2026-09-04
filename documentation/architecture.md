# Architecture

## Flow

```
main.ts
  ├── bootstrap shell (.app, .app-header, .app__main, .app__footer)
  ├── Router (features/router.ts)
  └── route table
        ├── guards (session.ts)
        └── page blocks (blocks/*-page.ts)
```

## Shell

- `.app` — flex column chrome; pages only replace `.app__main`
- `.app-header` — Feed / Items / Search / Login–Logout (`href` + `data-route`)
- `.app--auth` — guest layout; hides `.app-header` (login). Toggle in DevTools to verify.

## Router

`Router` matches pathname to a flat table, calls `unmount` then `mount`, fires `onChange` for header state.

Navigation uses `pushState` / `replaceState`. Same-origin `<a>` clicks are intercepted.

## Page blocks

Each page exports `getMarkup()` and `init({ navigate, params })`. Optional cleanup function clears timers or listeners.

## Session

Demo auth is `localStorage` flag `portfolio-routing-session=1`. No backend.

## Base path

`appPath()` prefixes routes with `import.meta.env.BASE_URL` for subdirectory deploys.

## Why no React Router

The production app shared one UI bundle between web and Capacitor. A small custom router kept control of mount/unmount and avoided a framework dependency on the client shell.
