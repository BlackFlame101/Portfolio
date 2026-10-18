# Project rules

- Implement only the phase requested in `PLAN.md` for a given task.
- Treat `PLAN.md` and `src/content/` as the source of truth. Never invent personal or project facts; mark missing values with `TODO(user)`.
- Keep TypeScript strict and avoid `any`. Use only dependencies listed in `PLAN.md` unless a deviation is explained.
- Route every public asset URL through `assetUrl()` in `src/lib/assetUrl.ts` so GitHub Pages project paths work.
- Never include a phone number, home address, or secret in source, content, or build output. Keep local environment files untracked; use `.env.example` for names only.
- Send all user-visible interface copy through the English and French locale files when implementing the i18n phase and later UI.
- Preserve semantic HTML, keyboard access, visible focus styles, labelled controls, meaningful image alt text, and reduced-motion preferences.
- Run `npm run lint` and `npm run build` for each completed phase. Commit each phase with a conventional commit message when Git is initialized.
