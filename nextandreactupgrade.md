# Next.js & React Upgrade Plan

## Objectives
- Upgrade `next` from 14.2.x to the latest stable 15.x release and align framework configs with the new async request APIs.
- Upgrade `react`/`react-dom` to 19.x and refresh related type packages.
- Ensure compatibility for supporting libraries (DatoCMS tooling, Tailwind, Headless UI, etc.) and keep build/deploy pipelines green.
- Preserve current app behaviour for draft mode, visual editing, and localized storefront flows while improving overall developer experience.

## Owners & Timeline
- **Tech lead:** TBD
- **Hands on deck:** 1–2 engineers familiar with App Router + DatoCMS integration
- **Estimated effort:** ~1 working day for implementation + testing buffer
- **Target window:** Coordinate with content team; avoid active marketing campaigns.

## Pre-Work Checklist
- [ ] Confirm we have a reproducible local environment (`pnpm`, Node version in `.nvmrc`, env vars for DatoCMS tokens).
- [ ] Audit outstanding PRs/branches to avoid merge conflicts during the dependency bump.
- [ ] Review release notes:
  - [ ] Next.js 15 upgrade guide & async request API changes
  - [ ] React 19 release notes (breaking changes, new hooks)
  - [ ] Key third-party libraries (DatoCMS clients, Headless UI, Framer Motion, Tailwind, next-themes)
- [ ] Notify stakeholders about potential downtime for preview builds.

## Implementation Plan

### 1. Dependency Refresh
- [ ] Update `package.json` dependencies:
  - `next` → ^15.x
  - `react`, `react-dom` → ^19.x
  - `eslint-config-next`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`
  - Refresh any peer deps flagged by `pnpm install`
- [ ] Regenerate lockfile (`pnpm install`) and ensure no unexpected dependency downgrades.

### 2. Framework API Updates
- [ ] Run codemod: `npx @vercel/next-codemod async-request-api .`
- [ ] Review touched files and adjust manually where needed:
  - `app/layout.tsx`
  - `utils/queryDatoCMS.ts`
  - `components/WithRealTimeUpdates/generateWrapper.tsx`
  - `app/[lng]/products/page.tsx`
  - `app/api/draft/**/*.ts`
- [ ] Ensure all `draftMode()`, `headers()`, and `cookies()` usages are properly awaited.
- [ ] Verify any other Next.js API usage (e.g., middleware, `redirect`, `revalidateTag`) aligns with v15 conventions.

### 3. Third-Party Compatibility
- [ ] Bump `react-datocms`, `datocms-visual-editing`, and related GraphQL packages to their latest versions supporting React 19.
- [ ] Update UI libraries (`@headlessui/react`, `@heroicons/react`, `lucide-react`, `framer-motion`) to releases tested against React 19.
- [ ] Re-run GraphQL code generation (`pnpm generate-ts-types`) and check for type breakages.
- [ ] Confirm `next-themes`, Tailwind, and other theming utilities still work with no warnings.

### 4. Tooling & Config
- [ ] Update ESLint config and rerun `pnpm lint`; fix any new rules or deprecations.
- [ ] Ensure TypeScript config compiles with the upgraded `tsc` (`pnpm tsc --noEmit`).
- [ ] Review `next.config.js` for deprecated options (changes expected to be minimal).
- [ ] Reapply any required polyfills or fetch caching tweaks (React 19 defaults to `cache: 'no-store'` but our GraphQL client overrides to `force-cache`).

### 5. Validation
- [ ] `pnpm dev`: smoke-test core flows (home, product detail, legal pages) in local draft/preview mode.
- [ ] Validate draft enable/disable routes and the controller-based visual editing toggle; confirm localStorage persistence works in iframe/use-embed scenarios.
- [ ] `pnpm build && pnpm start`: verify production build success.
- [ ] Run existing automated tests (if added) or add targeted tests for critical paths.
- [ ] Confirm Netlify (or other CI) build succeeds with upgraded dependencies.

### 6. Regression Checks
- [ ] Compare Lighthouse scores before/after (optional but recommended).
- [ ] Monitor error boundaries and console warnings for hydration or Suspense changes introduced by React 19.
- [ ] Validate localization middleware redirects for multiple language headers.
- [ ] Ensure real-time updates (if enabled) still render using DatoCMS tokens.

## Rollout & Communication
- [ ] Land PR with detailed upgrade notes, dependency diff, and test evidence.
- [ ] Coordinate QA/approval with content or marketing teams relying on preview URLs.
- [ ] Schedule deploy window; monitor logs post-deploy for the first 24 hours.
- [ ] Share a short upgrade summary and follow-up actions in the team channel/documentation.

## Post-Upgrade Follow-Up
- [ ] Track upstream issues: React 19 ecosystem packages, Next.js 15 patches.
- [ ] Evaluate enabling new features (React Compiler, Partial Prerendering) once stable.
- [ ] Set calendar reminder to revisit dependencies every quarter.

---
**Success Criteria**
- Dependency upgrades merged with zero regressions in storefront, draft mode, and visual editing flows.
- CI/CD pipelines pass without additional manual steps.
- Team understands new async request API conventions and React 19 capabilities.
