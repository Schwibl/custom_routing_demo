# portfolio-custom-routing

Custom History API routing demo (vanilla TypeScript + Vite).

[![PR checks](https://github.com/Schwibl/custom_routing_demo/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/Schwibl/custom_routing_demo/actions/workflows/pr-checks.yml)

A single-page app with its own client router on the History API, no React Router. It has a flat route table with auth and guest guards on a mock session, route params (`/items/:id`), query strings (`/search?q=`) and cleanup when you leave a page.

**Live:** https://custom-routing-demo.vercel.app

## Stack
TypeScript 5.6, Vite 6, SCSS (BEM), Playwright 1.64 for e2e. No UI framework.

## Run
```bash
npm install
npm run dev        # http://localhost:5173, click Continue on login
```
Optional env: `VITE_BASE_PATH` for a subdirectory deploy (default `/`). See `.env.example`.

```bash
npm run typecheck
npm run build      # typecheck + bundle to dist/
npm run preview
npm run e2e        # Playwright
```

More in [documentation/](documentation/README.md).
