# Folder structure

```
portfolio_custom_routing/
  vite.config.ts
  package.json
  frontend/
    index.html
    source/
      scripts/
        main.ts
        features/     router, session, app-base
        blocks/       page UI + header
        types/        .d.ts
      styles/
        main.scss
        base/
        blocks/
  documentation/      tracked human docs
  dist/                 build output (gitignored)
```

Vite root is `frontend/`. Entry imports SCSS from `main.ts`.
