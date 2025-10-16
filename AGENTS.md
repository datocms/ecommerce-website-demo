# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts all Next.js App Router routes, locale-aware layouts, and middleware; `app/api/` exposes draft-mode helpers.
- `components/` contains reusable UI, the visual-editing bridge, and real-time wrappers within folders like `components/Sections/` and `components/preview/`.
- `graphql/` holds query documents and generated TypeScript under `graphql/types/`; regenerate whenever the remote schema changes.
- Shared styles live in `styles/`, static assets in `public/`, and helpers in `utils/`. Configuration lives in `*config*.ts`, `biome.json`, and `datocms.json`.

## Build, Test, and Development Commands
- `pnpm dev` — run the Next.js dev server on port 3000.
- `pnpm build` — compile production assets; fails fast on type or lint errors.
- `pnpm start` — serve the production build locally.
- `pnpm lint` — run `next lint` plus Biome checks; required before opening PRs.
- `pnpm format` — apply Biome formatting and autofix validated diagnostics.
- `pnpm generate-ts-types` — run GraphQL Codegen defined in `graphql.config.ts`.

## Coding Style & Naming Conventions
- TypeScript + React 19 are mandatory; favor functional components and hooks.
- Indent with two spaces and default Biome rules; do not override formatter output.
- Use the `@/` path alias for internal imports (configured via `jsconfig.json`).
- Component, fragment, and hook filenames stay in PascalCase; shared utilities use camelCase.
- Prefer Tailwind utility classes; add scoped CSS only for gaps utilities cannot cover.

## Testing Guidelines
- Automated tests are not yet wired in; rely on `pnpm lint` plus manual visual QA.
- Colocate future Playwright or Vitest suites near the feature directory and prefix files with `.test.ts[x]`.
- For visual editing updates, confirm overlays in draft mode via `/api/draft?secret=<token>&path=/en/home` before submitting.

## Commit & Pull Request Guidelines
- Follow the existing short, imperative, lower-case subject style (e.g., `add checkout locale redirect`).
- Group commits by functional change; include schema or generated artifacts in the same commit that requires them.
- Pull requests must describe scope, note schema migrations, list environment variables touched, and mention manual QA (browser + locale).
- Attach screenshots or recordings when UI or visual-editing surfaces change.

## Environment & Visual Editing Setup
- Copy `.env.example` to `.env.local` and fill `DATOCMS_READONLY_API_TOKEN`, `NEXT_PUBLIC_DATO_BASE_EDITING_URL`, and draft secrets before running `pnpm dev`.
- Keep tokens out of commits; use Netlify or Vercel dashboards for production secrets.
- After syncing schema changes from DatoCMS, rerun `pnpm generate-ts-types` and commit the refreshed files in `graphql/types/`.
