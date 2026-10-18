# Portfolio Plan — Badr-Eddine Benouari

A bilingual (EN/FR), single-page, neo-brutalist portfolio hosted on GitHub Pages.
The visual style follows the reference site (thick black borders, hard offset shadows, yellow/pink/teal/purple palette, tilted sticker badges, mono labels). All code, copy, illustrations and assets are original and come from my CVs and projects.

---

## 1. Locked decisions

| Topic | Decision |
|---|---|
| Framework | React + Vite + TypeScript (static build, works on GitHub Pages) |
| Styling | Tailwind CSS (v4 with `@tailwindcss/vite`) + a few custom CSS utilities for the hard shadows |
| Animation | Framer Motion for scroll reveals and entrances, plain CSS keyframes for the marquee and floating badges |
| i18n | `react-i18next`, EN/FR toggle in the navbar, choice saved in `localStorage`, **always starts in English** |
| Sections | Hero, About, Expertise, Projects, Experience, Contact (Blogs dropped) |
| Contact | Two tabs: **Leave a Note** (public guestbook) and **Direct Inbox** (private message) |
| Guestbook backend | Supabase (free tier, anon key + Row Level Security) |
| Direct Inbox backend | Formspree (works on static sites, email forwarded to me) |
| Hosting | GitHub Pages, deployed by GitHub Actions on every push to `main` |
| Theme | Same as the reference: cream background, yellow/black, dark Experience section. No dark mode toggle |
| Not included | SEO/OpenGraph, analytics, dark mode, custom 404 page |
| Privacy | Email only. **Phone number and home address never appear on the site** |

## 2. Assumptions to confirm (change any that are wrong)

1. **Hosting path.** Your already-deployed site probably uses `username.github.io`, so this one is a **project site** at `username.github.io/<repo-name>/`. The Vite `base` is derived from the repo name in the workflow, so nothing is hard-coded. If you later add a custom domain or rename the repo to `username.github.io`, set the base to `/`.
2. **Animation library.** You weren't sure, so I chose Framer Motion. It is lightweight enough and respects `prefers-reduced-motion`.
3. **Socials.** GitHub (`BlackFlame101`), LinkedIn and Email only. The reference's X sticker is replaced by a **CV download** sticker.
4. **Section numbering.** With Blogs gone: 01 About, 02 Expertise, 03 Projects, 04 Experience, 05 Contact.
5. **Delege label.** Your EN CV calls it "Academic project", the FR CV "Projet personnel". On the site it is simply a project, with no label.
6. **Fonts** (similar to the reference, self-hosted via Fontsource): Bebas Neue (display), Space Grotesk (body), Space Mono (labels).
7. **Language of CV button.** The About button downloads the CV in the current site language (`cv-en.pdf` or `cv-fr.pdf`).

## 3. Can GitHub Pages host multiple sites?

Yes. Each account gets **one user site** (`username.github.io`) and **unlimited project sites** (`username.github.io/<repo>/`), each from its own repo. A project site lives under a sub-path, so:

- Vite needs `base: '/<repo>/'`.
- Every asset (images, PDFs, favicon) must be referenced through `import.meta.env.BASE_URL`, never as `/image.png`.
- This is a single-page site with anchor navigation, so no client-side router and no 404 fallback trick are needed.

## 4. Page map

| # | Section | id | EN heading | FR heading |
|---|---|---|---|---|
| — | Hero | `#home` | BADR-EDDINE / BENOUARI | same |
| 01 | About | `#about` | WHO AM I? | QUI SUIS-JE ? |
| 02 | Expertise | `#expertise` | WHAT I DO | CE QUE JE FAIS |
| 03 | Projects | `#projects` | WHAT I BUILT | CE QUE J'AI CRÉÉ |
| 04 | Experience | `#experience` | MY JOURNEY | MON PARCOURS |
| 05 | Contact | `#contact` | LET'S TALK | PARLONS-EN |

Nav: About, Expertise, Projects, Experience, Contact, plus the EN/FR toggle. A yellow back-to-top button sits at the bottom right.

## 5. Repository structure

```
portfolio/
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ cv/cv-en.pdf
│  ├─ cv/cv-fr.pdf
│  ├─ favicon.svg
│  └─ images/
│     ├─ photo.webp
│     └─ projects/{delege,airwriter,socra}.webp
├─ reference/                  (my screenshots of the reference site, style only, not shipped)
├─ src/
│  ├─ components/ui/           Button, Chip, Card, SectionLabel, SectionHeading, Sticker, Marquee
│  ├─ components/layout/       Navbar, LanguageToggle, BackToTop, Footer
│  ├─ sections/                Hero, About, Expertise, Projects, Experience, Contact
│  ├─ content/                 projects.ts, experience.ts, expertise.ts, socials.ts
│  ├─ i18n/                    index.ts, locales/en.json, locales/fr.json
│  ├─ lib/                     supabase.ts, formspree.ts, assetUrl.ts
│  ├─ App.tsx, main.tsx, index.css
├─ .env.example
├─ AGENTS.md
├─ PLAN.md
└─ README.md
```

---

## 6. Phases

Every phase ends with `npm run lint` and `npm run build` passing, a commit, and a push that deploys successfully.

### Phase 0 — Preparation (me, before Codex starts)

Collect everything so no one has to guess.

- [ ] Decide the repo name (suggestion: `portfolio`) and create the empty GitHub repo.
- [ ] Save the reference screenshots into `reference/` (hero, about, expertise, projects, experience, contact).
- [ ] Export the two CVs as `cv-en.pdf` and `cv-fr.pdf`.
- [ ] Prepare my photo: square-ish crop, at least 800 px, exported as `photo.webp` (under 200 KB).
- [ ] For **Delege, AirWriter, Socra**, gather: GitHub repo URL, live URL, one screenshot of the main page (16:9, 1600×900, `.webp`, under 250 KB), a 2–3 sentence description and the tech stack (EN and FR).
  - Delege live URL is already known: `https://delege.vercel.app/`.
- [ ] Get my LinkedIn profile URL.
- [ ] Create a Supabase project (free) and a Formspree form; note the URL, anon key and form ID.
- [ ] Review and approve the two About paragraphs (drafted in Phase 5).

**Done when:** all files and values above exist, so no placeholders block later phases.

### Phase 1 — Repo, tooling and deploy pipeline

Deploy an empty page first, so every later push is already live.

- [ ] Scaffold Vite + React + TypeScript (`strict: true`), ESLint, Prettier.
- [ ] Install and configure Tailwind CSS with the Vite plugin.
- [ ] Configure `vite.config.ts` with `base` read from `VITE_BASE` (default `/`).
- [ ] Write `.github/workflows/deploy.yml`: on push to `main` run `npm ci`, `npm run build` with `VITE_BASE=/${{ github.event.repository.name }}/`, upload the Pages artifact, deploy with `actions/deploy-pages`.
- [ ] In repo Settings → Pages, set Source to **GitHub Actions**.
- [ ] Add the env vars and `.env.example` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_FORMSPREE_ID`). Add them as GitHub repository variables/secrets for the build.
- [ ] Add `lib/assetUrl.ts` that prefixes `import.meta.env.BASE_URL`.
- [ ] Write `README.md` (run, build, deploy) and `AGENTS.md` (project rules).

**Done when:** the "hello" page is live at `username.github.io/<repo>/` with no 404s in the console, and my existing user site is unaffected.

### Phase 2 — Design system and layout shell

- [ ] Define design tokens in Tailwind (`@theme`): cream, ink, yellow, pink, teal, purple, green, blue, orange (sample the hex values from the screenshots), 2–3 px borders, hard offset shadows (4–8 px), radii.
- [ ] Self-host fonts with Fontsource and wire the three font roles.
- [ ] Background grid pattern (subtle lines on cream; darker grid for the Experience section).
- [ ] UI primitives: `Button` (dark and yellow variants, shadow shrinks on press), `Chip`, `Card`, `SectionLabel` (`[ 01 — ABOUT ]`), `SectionHeading` (big condensed caps + small teal dot), `Sticker` (rotated, bordered, shadowed), `Marquee`.
- [ ] `Navbar`: sticky, yellow boxed "PORTFOLIO" logo on the left, bordered nav buttons on the right, scroll-spy highlight, hamburger menu on mobile, EN/FR toggle.
- [ ] `BackToTop` yellow square button, appears after scrolling.
- [ ] Layout container (about 1200 px max width) and empty section stubs with the correct ids.
- [ ] Smooth scroll with offset for the sticky navbar.

**Done when:** a styleguide-like page shows every primitive, and the navbar scrolls to each stub section.

### Phase 3 — i18n and content layer

Do this before the sections so no string is ever hard-coded.

- [ ] Set up `react-i18next` with `en.json` and `fr.json`; default language `en` (do **not** detect the browser language).
- [ ] Persist the choice in `localStorage` (`lang`), update `<html lang>` on change.
- [ ] Add the toggle (EN | FR) in the navbar and mobile menu.
- [ ] Create typed content files (`projects.ts`, `experience.ts`, `expertise.ts`, `socials.ts`) holding non-text data (URLs, stack chips, dates) with translation keys for text.
- [ ] Translate nav, headings and all copy to FR, using the wording of my French CV for experience.
- [ ] Add a small script or test that fails if a key exists in one locale but not the other.

**Done when:** toggling language changes every visible string with no missing-key output, and a reload keeps the choice.

### Phase 4 — Hero

- [ ] "HELLO WORLD 👋" pill with a small green dot above the name.
- [ ] Name: **BADR-EDDINE** in large dark condensed caps, **BENOUARI** inside a slightly tilted yellow box with a hard shadow. Use `clamp()` sizing so the long first name fits at 360 px.
- [ ] Tagline in a terminal-style bordered box: `> AI & Data Science Engineer` (FR: `> Ingénieur IA & Data Science`).
- [ ] Two buttons: **View Projects** (scrolls to `#projects`, dark) and **Let's Talk** (scrolls to `#contact`, yellow).
- [ ] Floating tilted stickers: GitHub, LinkedIn, Email and CV icon stickers, plus label stickers **2026**, **OPEN TO WORK**, **ML Systems**, **RAG**, **LLMs**. Slow floating animation, small wobble on hover, icon stickers are real links.
- [ ] "SCROLL" indicator with an animated mouse icon.
- [ ] Mobile: keep 2–3 stickers, hide the rest, and make sure none overlap the name.

**Done when:** the hero matches the reference's feel at 1440, 1024 and 390 px, and every sticker link works.

### Phase 5 — About

- [ ] Yellow marquee ticker: `ABOUT ME ★ WHO AM I ★ BADR-EDDINE BENOUARI ★` scrolling infinitely (pauses for reduced motion).
- [ ] Section label `[ 01 — ABOUT ]` and heading **WHO AM I?**
- [ ] White card with a thick yellow left border, hard shadow, and two short paragraphs.
  - Draft from the CV summary: AI & Data Science engineering student building intelligent, deployable systems (RAG, LLM workflows, full-stack products); I get hands-on with real internships and shipped projects. Write EN and FR, then I approve.
- [ ] **My photo** inside the card (thick border, hard shadow, slight tilt, descriptive `alt`, `loading="eager"` is not needed).
- [ ] Optional quick facts row: languages (Arabic, French, English, Amazigh), location (Morocco).
- [ ] **CV** dark button with a document icon; downloads `cv-en.pdf` or `cv-fr.pdf` depending on the current language (use the `download` attribute and `assetUrl`).

**Done when:** the photo and CV button work on the deployed base path in both languages.

### Phase 6 — Expertise

- [ ] Label `[ 02 — EXPERTISE ]`, heading **WHAT I DO**, yellow tilted sticker "Building the future ✦" on the right.
- [ ] Grid of 6 cards (3 columns desktop, 2 tablet, 1 mobile). Each card: coloured border and hard shadow, an illustration, a coloured pill title, a short description.
  - Illustrations are original (inline SVG or CSS mini-mockups: terminal, workflow nodes, retrieval diagram, chart, server stack, pipeline). Do not recreate the reference's images.
- [ ] Cards (copy drafted from my CV, EN then FR):
  1. **RAG & LLM Systems** (pink): assistants grounded in a custom knowledge base with pgvector, with human review where it matters.
  2. **AI Workflows & Automation** (blue): n8n workflows, multi-step pipelines, Android security audit automation (ADB, MobSF).
  3. **Full-Stack AI Applications** (green): Next.js, TypeScript, Node.js and FastAPI products with Supabase/PostgreSQL.
  4. **Machine Learning & Data Science** (yellow): Python, scikit-learn, Pandas, NumPy, deep learning, NLP.
  5. **Backend & Data Engineering** (orange): REST APIs, Pydantic, ETL, data modelling, PostgreSQL, MongoDB.
  6. **MLOps & Deployment** (purple): Docker, Git/GitHub, CI/CD, automated tests, Linux, cloud deployment.
- [ ] Hover: card lifts, shadow grows.

**Done when:** six cards render in both languages with no layout shift.

### Phase 7 — Projects

- [ ] Label `[ 03 — PROJECTS ]`, heading **WHAT I BUILT**, with a large faint "PROJECTS" background word.
- [ ] Three project cards: **Delege**, **AirWriter**, **Socra**. Each has: a browser-window frame around the screenshot (fixed 16:9, `loading="lazy"`, width/height set), title, 2–3 line description, stack chips, and two buttons: **GitHub** (repo) and **Live** (website).
- [ ] Delege description from the CV: SaaS that lets Moroccan businesses connect an AI agent to their WhatsApp number via QR code; answers 24/7 in Arabic, French and Darija using RAG with pgvector; includes subscriptions, a dashboard, knowledge-file management and manual human takeover. Stack: Next.js, Node.js, Supabase, PostgreSQL/pgvector, RAG, LLMs.
- [ ] AirWriter and Socra: use the descriptions and stacks from Phase 0. If something is missing, use a clearly marked `TODO(user)` placeholder, never invented facts.
- [ ] Buttons are real `<a target="_blank" rel="noopener noreferrer">` links.
- [ ] Small "More shipping soon" sticker below the grid (optional).

**Done when:** each card's GitHub and Live links go to the right place and screenshots load on the deployed base path.

### Phase 8 — Experience

- [ ] Dark section (ink background with a faint grid). Label `[ 04 — EXPERIENCE ]` in yellow, heading **MY JOURNEY** in white.
- [ ] Vertical yellow timeline line; each entry is a dark card with a green border: role title, role badge + company, date range (right-aligned, yellow mono), description, tech chips with small icons (use an icon package such as `react-icons`/Simple Icons).
- [ ] Entries (newest first), content from the CVs:

  | Role | Company | Dates | Stack |
  |---|---|---|---|
  | End-of-Studies Intern | Mobiconnect Technologies, Casablanca | Jul 2026 – Aug 2026 | Python, FastAPI, PostgreSQL, pgvector, Docker, ADB, MobSF, n8n, RAG, LLMs, HTML/CSS/JS, Git, GitHub |
  | End-of-Year Project Intern | Netopia Solutions, Rabat | Jul 2025 – Sep 2025 | Spring Boot, Java, Python, LLMs, FastAPI, PostgreSQL, Next.js, Figma, Azure, Git |
  | Next.js Developer | Digital Consulting Team, Remote | Oct 2023 – Sep 2024 | Next.js, Figma, Node.js, Supabase, PostgreSQL, MAUI |

- [ ] Descriptions: Mobiconnect (Android security audit automation platform: ADB device control, MobSF static analysis, deterministic risk scoring, HTML/PDF reports, human-reviewed AI/RAG remediation, Docker, n8n), Netopia (TalentMindHub, an AI recruitment SaaS, UI design and development), Digital Consulting Team (Xamarin → MAUI migration, Next.js SaaS apps for clients).
- [ ] Localised dates (`Jul 2025` / `juil. 2025`).
- [ ] Education sub-block under the timeline: Engineering diploma in AI & Data Science, EMSI Rabat (2024–2026); Professional Bachelor in Mobile Applications Engineering, EST Salé (2021–2022); DUT Software Engineering, EST Salé (2019–2021).
- [ ] Scroll-reveal animation for each card.

**Done when:** the section is readable on mobile (chips wrap, dates stack under the title) and all text switches language.

### Phase 9 — Contact (Guestbook + Direct Inbox)

- [ ] Label `[ 05 — CONTACT ]`, heading **LET'S TALK**, subtitle "Leave a note, say hi, or drop a thought — I read every single one! 👋" (EN/FR).
- [ ] **Left panel, guestbook:** dark header "GUESTBOOK — N NOTES" with a live green dot, scrollable list of chat-style bubbles in rotating palette colours (yellow, teal, pink, purple), each with an initials avatar, name, text and timestamp; alternate left/right.
- [ ] **Right panel, tabs:** `Leave a Note` and `Direct Inbox` (accessible tabs with `role="tablist"`).
  - Leave a Note: name (required, max 40) + note (required, max 280), **Post Note** button, loading/success/error states.
  - Direct Inbox: name, email, message, **Send** button posting to Formspree, success/error states.
- [ ] Supabase table and policies (run once in the SQL editor):

  ```sql
  create table public.guestbook_notes (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(name) between 1 and 40),
    note text not null check (char_length(note) between 1 and 280),
    visible boolean not null default true,
    created_at timestamptz not null default now()
  );
  alter table public.guestbook_notes enable row level security;
  create policy "read visible notes" on public.guestbook_notes
    for select to anon using (visible = true);
  create policy "insert notes" on public.guestbook_notes
    for insert to anon with check (visible = true);
  ```

  No update or delete policies exist for visitors. I can hide a note from the dashboard by setting `visible = false`.
- [ ] Spam and abuse protection: hidden honeypot field, client-side cooldown (one note per 30 s via `localStorage`), trimmed input, rely on React's escaping (never `dangerouslySetInnerHTML`).
- [ ] Optimistic UI: a posted note appears immediately; failures roll back with a clear message.
- [ ] Graceful failure: if Supabase is unreachable (free projects can pause when idle), show "Guestbook is resting, try the Direct Inbox" instead of breaking the page.
- [ ] Optional: a weekly GitHub Actions cron that pings the table so the free project does not pause.
- [ ] Footer with GitHub, LinkedIn and email links, and copyright.

**Done when:** posting a note shows it for other visitors after reload, the Direct Inbox email reaches me, and both work from the deployed URL.

### Phase 10 — Polish, responsiveness and accessibility

- [ ] Framer Motion scroll reveals, hero entrance, hover and press states; every animation disabled under `prefers-reduced-motion`.
- [ ] Responsive pass at 360, 390, 768, 1024, 1440 px; no horizontal scroll anywhere.
- [ ] Accessibility: visible focus rings, semantic landmarks, skip link, label for every input, `aria-selected` on tabs, enough contrast on yellow/pink/purple, meaningful `alt` text, `lang` switching.
- [ ] Performance: WebP images, lazy-loading below the fold, font subsets, no unused dependencies. Target Lighthouse ≥ 90 for Performance, Accessibility and Best Practices.
- [ ] Basic `<title>`, favicon and meta description only (no SEO/OG/analytics).

**Done when:** keyboard-only navigation reaches every control and Lighthouse targets are met.

### Phase 11 — QA and launch

- [ ] Click through every link on the deployed site (nav, stickers, CV buttons in both languages, project links).
- [ ] Verify there are no broken asset URLs under the project base path.
- [ ] Test EN → FR → reload → still FR; first visit in a French-language browser still starts in English.
- [ ] Test both contact flows from a phone.
- [ ] Confirm no phone number, address or secrets are in the repo, the build output or the page source.
- [ ] Test in Chrome, Firefox, Safari (or WebKit) and on a real phone.
- [ ] Update `README.md`, add the live URL to my CV, LinkedIn and GitHub profile.

**Done when:** the checklist above is fully ticked and the live URL is shared.

---

## 7. Working with Codex

1. Put `PLAN.md`, `AGENTS.md` and the `reference/` screenshots in the repo before starting.
2. Run **one phase per Codex task** using `CODEX_PROMPT.md`; change only the phase number.
3. Review the diff and the deployed result, then move on. Fix problems in a follow-up task instead of stacking phases.
4. Commit after each phase so any phase can be reverted.

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Assets 404 on the project sub-path | All asset URLs go through `assetUrl()`; verified in Phases 1 and 11 |
| Guestbook spam | Length constraints, RLS, honeypot, cooldown, `visible` flag for takedown |
| Free Supabase project pauses | Graceful error state, optional keep-alive cron |
| Looking too close to the reference | Use the style only; original copy, illustrations, layout details and code |
| Missing project info for AirWriter/Socra | Collected in Phase 0; placeholders marked `TODO(user)`, never invented |
| French copy quality | I review all FR text at the end of Phase 3 and again in Phase 11 |