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
        main.ts         # entry; shell + route table; imports styles
        features/       # router.ts, session.ts, app-base.ts
        blocks/         # app-header.ts + *-page.ts
        types/          # .d.ts (t_ prefix)
      styles/
        main.scss       # imports base/ then blocks/
        base/           # variables.scss, normalise.scss
        blocks/         # one SCSS file per BEM block
          button.scss   # shared .button (+ modifiers)
          input.scss    # shared .input (+ modifiers)
          # feature pages / shell: app, app-header, *-page
  documentation/        # tracked human docs
  dist/                 # build output (gitignored)
```

Vite treats `frontend/` as the app root. Production assets land in repo-root `dist/`.

Shared control chrome: `button.scss` and `input.scss`. Feature blocks compose those classes; they do not own control padding/border/fill. Style rules: `.prompts/base/how_to_visualise.md` (Controls).

Guest routes use `.app--auth` to hide the header. All in-app paths go through `appPath()`.
