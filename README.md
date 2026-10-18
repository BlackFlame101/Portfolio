# Badr-Eddine Benouari — Portfolio

A bilingual English/French portfolio built with React, TypeScript, Vite and Tailwind CSS v4.

## Run locally

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env` to configure integrations. The guestbook API URL is optional during development; shared notes stay unavailable until the API is deployed.

## Build and preview

```sh
npm run lint
npm run build
npm run preview
```

Public asset paths use `assetUrl()` from `src/lib/assetUrl.ts`. The Pages workflow builds the project site with `/Portfolio/` as its Vite base.

## Deploy shared notes (Fly.io)

GitHub Pages is static hosting, so it cannot save notes into SQLite by itself. Deploy the API in `server/` to Fly.io with a persistent volume so all visitors read and write the same guestbook.

1. Install `flyctl`, sign in with `fly auth login`, and change to the API directory:

   ```sh
   cd server
   fly launch --no-deploy
   ```

   Choose an app name and region. Keep the generated `fly.toml` in `server/`.

2. In `server/fly.toml`, add this mount (at the top level) and make sure the HTTP service's `internal_port` is `3000`:

   ```toml
   [[mounts]]
     source = "guestbook_data"
     destination = "/data"
   ```

3. Create a 1 GB volume in the same region shown by `primary_region` in `fly.toml`, replacing `<region>` with that value:

   ```sh
   fly volumes create guestbook_data --region <region> --size 1
   ```

4. Configure the persistent database path and the public website origin, then deploy:

   ```sh
   fly secrets set SQLITE_PATH=/data/guestbook.sqlite WEB_ORIGIN=https://blackflame101.github.io
   fly deploy
   ```

5. Check `https://<your-fly-app>.fly.dev/api/health`; a working API returns `{"ok":true}`. Fly volumes have a cost; check Fly.io's current pricing before creating one.

6. In GitHub, open **BlackFlame101/Portfolio → Settings → Secrets and variables → Actions → Variables**. Add `VITE_GUESTBOOK_API_URL` with the value `https://<your-fly-app>.fly.dev` (no trailing slash). Re-run the Pages workflow or push another commit. These `VITE_` values are embedded in the public website, so they must not contain secrets.

The API limits note length and posting rate. Notes are public to every visitor and should not contain private information.

## Enable inbox email

The Direct Inbox form sends mail through Formspree; GitHub Pages cannot send email on its own.

1. Create a form in Formspree, set its recipient to `Benouari94@gmail.com`, and complete any email verification Formspree requests.
2. Copy the form ID from Formspree. In the same GitHub Actions **Variables** page, add `VITE_FORMSPREE_ID` with that ID (not a secret key).
3. Re-run the Pages workflow. The form is enabled when the built site receives this ID. Until then, use the email link shown in the inbox section to open your mail app.

## Pages deployment

The workflow in `.github/workflows/deploy.yml` builds and deploys on pushes to `main`. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
