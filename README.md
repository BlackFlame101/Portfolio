# Badr-Eddine Benouari — Portfolio

A bilingual English/French portfolio built with React, TypeScript, Vite and Tailwind CSS v4.

## Run locally

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env`. The Giscus widget stays in setup mode until its repository and category IDs are configured. The inbox uses Formspree when `VITE_FORMSPREE_ID` is set; otherwise its email link remains available.

## Build and preview

```sh
npm run lint
npm run build
npm run preview
```

Public asset paths use `assetUrl()` from `src/lib/assetUrl.ts`. The Pages workflow builds the project site with `/Portfolio/` as its Vite base.

## Enable the public guestbook with Giscus

Giscus embeds comments backed by GitHub Discussions; this portfolio does not run a notes server or database. Giscus is free and does not bill per note. Visitors must sign in with GitHub to post. Discussions and comments are public, so do not post private information. You can moderate or delete comments from the repository's Discussions page. The repository must be public and have Discussions enabled.

1. In **BlackFlame101/Portfolio → Settings → General → Features**, enable **Discussions**. Ensure the **General** category exists.
2. Open [giscus.app](https://giscus.app/), enter `BlackFlame101/Portfolio`, choose the **General** category, and use the generated configuration values. If prompted, install/authorize the Giscus GitHub App for the repository.
3. In GitHub, open **BlackFlame101/Portfolio → Settings → Secrets and variables → Actions → Variables**. Add these variables using the values generated at giscus.app:
   - `VITE_GISCUS_REPO` — `BlackFlame101/Portfolio`
   - `VITE_GISCUS_REPO_ID` — generated `data-repo-id`
   - `VITE_GISCUS_CATEGORY` — generated category name (normally `General`)
   - `VITE_GISCUS_CATEGORY_ID` — generated `data-category-id`
4. Re-run the Pages workflow or push a commit. The widget associates the guestbook with the discussion titled **Portfolio guestbook**.

These `VITE_` settings are public website configuration, not secrets. Once enabled, Giscus creates/links the discussion when the first comment is posted.

## Enable inbox email

The Direct Inbox form sends email through Formspree; GitHub Pages cannot send mail by itself.

1. Create a form in Formspree, set its recipient to `Benouari94@gmail.com`, and complete any email verification Formspree requests.
2. Add `VITE_FORMSPREE_ID` with the form ID in the same GitHub Actions **Variables** page.
3. Re-run the Pages workflow. Until then, visitors can use the email link in the inbox section.

## Pages deployment

The workflow in `.github/workflows/deploy.yml` builds and deploys on pushes to `main`. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
