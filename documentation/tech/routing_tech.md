# Routing

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
