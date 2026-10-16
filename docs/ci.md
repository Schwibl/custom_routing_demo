# CI

Pull requests, and pushes to `main`, run [`.github/workflows/pr-checks.yml`](../.github/workflows/pr-checks.yml). Nothing here needs an API key or a secret. The demo signs in with a `localStorage` flag.

Branch protection matches checks **by job name**. These two names are the contract:

- `Install, typecheck, build`
- `Playwright smoke`

Rename a job only together with the branch-protection rule that requires it.

## Install, typecheck, build

1. Check out the branch.
2. Install the Node version in [`.nvmrc`](../.nvmrc) (24) and reuse the npm cache keyed by `package-lock.json`.
3. `npm ci` installs the lockfile exactly. If `package.json` and the lockfile disagree, the job fails.
4. `npm run typecheck` runs `tsc --noEmit`.
5. `npm run build` typechecks again and writes the site to `dist/`.

Lint is not a step. This repo has no ESLint config. Unit tests are not a step. There is no unit-test suite. If either shows up later, add the step and rename this job to `Install, lint, typecheck, test, build`.

## Playwright smoke

This job installs dependencies the same way, installs Chromium, then `npm run e2e`. That command builds `dist/` and serves it on `127.0.0.1:4173` with `vite preview` (Vite falls back to `index.html` for unknown paths). Three tests then run against that local server:

1. `/` loads with no console errors and no uncaught exception. The sign-in heading is on the page.
2. The main UI renders: the sign-in form, then the feed and the nav after **Continue**.
3. The nav goes to the items list, a link opens `/items/1`, and a reload of that URL still shows the item. That is the deep-link check.

A new push to the same branch cancels the run that is still going.

If the smoke job fails, the HTML report is uploaded as the `playwright-report` artifact.

## Run the same checks locally

```bash
npm ci
npm run typecheck
npm run build
npx playwright install chromium
npm run e2e
```

`npm run e2e` builds again, then serves `dist/`. You do not start a dev server first.

## Deploy

Build command: `npm run build` (`tsc --noEmit && vite build`).

Output directory: `dist/`.

The app is a client-side router. [`vercel.json`](../vercel.json) rewrites every path to `/index.html` so a refresh on `/items/1` loads the SPA. Vercel detects Vite, the build command, and `dist/` on its own, so the file has no other settings. The README live-demo URL is a placeholder until the first deploy fills it in.
