# Architecture

## Module diagram

```
frontend/index.html (#app)
        │
        ▼
main.ts ── styles, shell, flat route table, guards
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

## Session guard flow

```
mount(route)
  ├── requireGuest?  → if session → replace /feed
  ├── requireAuth?   → if no session → replace /login
  └── mountPage(block) → getMarkup + init
```

Root `/` redirects to `/feed` or `/login` by session. Login page uses `.app--auth` (header hidden).

## Data flow

```
click <a> / navigate() / popstate
        │
        ▼
Router.match(pathname) → t_Route + t_RouteParams
        │
        ├── previous cleanup / route.unmount()
        ├── route.mount(params) → guards → mountPage(block)
        └── onChange → .app--auth + header active / logout
```

In-app links use `pushState`. Guards and `/` use `replaceState` so failed auth does not pollute history. Back from `/items/:id` returns to `/items`.

## Why vanilla over React Router

The production app shared one UI bundle between web and a native shell. A small custom router kept mount/unmount explicit and avoided a framework dependency on the client shell.

## Related

- Routes and API: [`tech/routing_tech.md`](./tech/routing_tech.md)
- Paths: [`tech/folder_structure.md`](./tech/folder_structure.md)
