# Badr-Eddine Benouari — Portfolio

A bilingual English/French portfolio built with React, TypeScript, Vite and Tailwind CSS v4.

## Run locally

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env` to configure integrations. The guestbook API URL is optional during development, but the guestbook stays disabled until a shared API is deployed.

## Build and preview

```sh
npm run lint
npm run build
npm run preview
```

Set `VITE_BASE` to the deployment path when building a project site, for example `VITE_BASE=/portfolio/ npm run build`. Public asset paths should use `assetUrl()` from `src/lib/assetUrl.ts`. GitHub Pages workflow builds with `/` to preserve root-relative generated HTML assets; dynamic public assets use Vite's `BASE_URL`.

## Shared guestbook (SQLite API)

GitHub Pages only serves static files. It cannot update a JSON file or SQLite database when a visitor posts a note. For shared notes without Supabase, deploy the small API in `server/` to a host with a persistent disk (for example a VPS or an always-on container host), and point the site to it with `VITE_GUESTBOOK_API_URL`.

To run the API locally:

```sh
cd server
npm install
npm run db:init
npm start
```

The API creates `guestbook.sqlite` automatically. Set `SQLITE_PATH` to a mounted persistent disk path in production, and `ALLOWED_ORIGINS` to the portfolio's exact origin (comma-separated if needed). Configure `VITE_GUESTBOOK_API_URL` as a GitHub Actions repository variable to enable shared reads and posts in the static site. Without it, the posting button stays disabled and explains that shared storage is not configured. The API enforces note lengths and rate limits writes.

## Deploy

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys on pushes to `main`. In repository **Settings → Pages**, choose **GitHub Actions** as the source. Add `VITE_GUESTBOOK_API_URL` and `VITE_FORMSPREE_ID` as repository variables when those integrations are configured.
