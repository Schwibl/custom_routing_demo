# Folder structure

```
portfolio_custom_routing/
  package.json          # scripts: dev, build, preview
  package-lock.json
  vite.config.ts        # root: frontend/, outDir: dist/
  tsconfig.json
  .env.example          # VITE_BASE_PATH=/
  frontend/             # Vite root
    index.html          # #app mount
    source/
      scripts/
        main.ts         # entry; builds .app shell; imports ../styles/main.scss
        features/       # router, session, app-base (later steps)
        blocks/         # app-header.ts + page UI blocks
        types/          # .d.ts (t_ prefix)
      styles/
        main.scss       # style entry
        base/           # variables.scss, normalise.scss
        blocks/         # app.scss, app-header.scss, *-page.scss (one file per BEM block)
  documentation/        # tracked human docs
  dist/                 # build output (gitignored)
```

Vite treats `frontend/` as the app root. Production assets land in repo-root `dist/`.

Shell blocks: `.app` / `.app-header` styles under `styles/blocks/`; header markup helpers under `scripts/blocks/app-header.ts`. Guest routes use `.app--auth` to hide the header.
