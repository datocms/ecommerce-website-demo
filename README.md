<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# Ecommerce Visual Editing Demo (Next.js 16 + DatoCMS)

This repository is a reference storefront that demonstrates how to deliver DatoCMS visual editing with the Next.js App Router (Next.js 16 at the time of writing). The focus of this README is the visual editing experience: how it is wired, how the toggle behaves, and what you need to keep overlays working after local changes.

The data model, real-time subscription layer, and UI come from the standard ecommerce starter. All visual-editing-specific logic lives in the `app`, `components/preview`, `components/WithRealTimeUpdates`, and `proxy.ts` folders referenced below.

## Demo

Live deployment: [https://ecommerce-website-demo-livid.vercel.app/](https://ecommerce-website-demo-livid.vercel.app/)

## Getting Started

1. **Clone the project** (or deploy it via the “Deploy with DatoCMS” button on the starter page).
2. **Install dependencies** using the same package manager declared in `package.json`:

   ```bash
   pnpm install
   ```

3. **Copy environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   Required values:

   - `DATOCMS_READONLY_API_TOKEN` – read-only Content Delivery token.
   - `NEXT_PUBLIC_DATO_BASE_EDITING_URL` – your project dashboard URL (`https://<project>.admin.datocms.com`). Mandatory whenever a query requests `_editingUrl`.
   - `NEXT_PUBLIC_DATO_ENVIRONMENT` – optional, only if you preview a non-default environment.
   - Preview secrets (`DRAFT_SECRET_TOKEN`, `SEO_SECRET_TOKEN`, `CACHE_INVALIDATION_SECRET_TOKEN`) can be any random string in local development.
   - `URL` defaults to `http://localhost:3000`; adjust if you run the dev server on another port.

4. **Ensure Node.js 20.9+ (or 22.x) is used**:

   This project now targets Next.js 16 which requires modern Node.js. Use the included `.nvmrc` (set to `22`) or any runtime ≥ 20.9.

5. **Run the development server**:

   ```bash
   pnpm dev
   ```

   The site listens on [http://localhost:3000](http://localhost:3000) by default.

## Visual Editing Workflow

Architecture at a glance:

- Server (data + headers)
  - `components/WithRealTimeUpdates/generateWrapper.tsx` detects `draftMode()` and always requests visual‑editing metadata while preview is on.
  - `utils/queryDatoCMS.ts` attaches `X-Visual-Editing` and `X-Base-Editing-Url` (via `withContentLinkHeaders`) whenever visual editing metadata is requested so `_editingUrl` is present in responses.
- Client (single global controller)
  - `components/preview/DatoVisualEditingBridge.tsx` creates one controller for the whole app. It mounts in `app/layout.tsx` before `{children}` so realtime listeners find it on first render. Activation is deferred by two `requestAnimationFrame`s + a short timeout to avoid hydration races.
- Client (realtime streaming)
  - `components/WithRealTimeUpdates/index.tsx` subscribes to DatoCMS Listen. On each update it reuses the server DOM (same view component) and calls `controller.refresh(scope)` to rescan stega markers. It reuses the global controller — it never creates its own.
- UI (toggle)
  - `components/ScrollToTop/index.tsx` exposes an “Enable/Disable Visual Editing” button that talks to the global controller only. No cookies/URL params are changed; overlay state persists in `localStorage` (`datocms.visual-editing.enabled`).

Visual editing activates when:

1. **Draft mode** (preview cookies `__prerender_bypass` and `__next_preview_data`) is set. Visit `/api/draft?secret=<DRAFT_SECRET_TOKEN>&path=/<locale>/home` to enable it.
2. A **base editing URL** is configured – `NEXT_PUBLIC_DATO_BASE_EDITING_URL` must point to your project dashboard so overlays can deep-link back to DatoCMS.
3. GraphQL requests are issued with visual-editing headers. In draft mode we always request stega payloads, and the client-side controller decides whether overlays render.

The toggle state is stored in `localStorage` (`datocms.visual-editing.enabled`). It defaults to “disabled” the first time you enter draft mode in a browser session and persists across navigations until you turn it on.

### Enabling overlays locally

1. Start the dev server and open `/en/home` (or another locale).
2. Hit `/api/draft?secret=<your-secret>&path=/en/home` in the same browser session.
3. You’ll land back on the storefront with the floating control exposed (bottom-right). Visual editing stays off until you enable it manually; click **Enable Visual Editing** when you’re ready to see overlays.

Disabling the overlay keeps draft mode active while hiding the overlays. Re-enabling restores them instantly without a full remount.

### How the toggle works (single‑controller pattern)

- The toggle is a thin UI that talks to the global controller (`components/preview/DatoVisualEditingBridge.tsx`). No URL params or cookies are used; state is kept in `localStorage` so it persists across navigations.
- The server always fetches `_editingUrl` when in draft; enabling/disabling the overlay never remounts the page — it only turns the controller on/off.
- The bridge defers `enable()` until hydration settles. Enabling too early can produce the dev warning “no editable elements were detected after enable()”. The defer avoids this.
- When disabled, the controller stays mounted and the `<html>` element reflects state via `data-datocms-visual-editing`. Re‑enabling is instant.

### Realtime + overlays: keeping both working

- Realtime updates render the exact same view the server used (see `app/[lng]/**/LiveContent.tsx`). React patches content in place; it does not replace the DOM nodes that carry stega markers.
- After each Listen update, the realtime wrapper calls `controller.refresh(scope)` so overlays re‑mark the updated subtree.
- There is only one controller in the app. The realtime wrapper imports it with `getVisualEditingController()` and never passes `controllerOptions` (so it cannot create a second controller by mistake).

### Proxy responsibilities

`proxy.ts` only handles locale routing.

- Normalises locales and redirects bare paths to the correct locale.
- Leaves visual editing to server routes/query helpers and the client bridge — no custom headers or query params are added by middleware.

### Key files to inspect

- `components/preview/DatoVisualEditingBridge.tsx` — single global controller; enable/disable/toggle/refresh and hydration delay.
- `app/layout.tsx` — mounts the bridge before `{children}` so listeners find the controller on first render.
- `components/WithRealTimeUpdates/index.tsx` — Listen subscription; reuses the global controller and calls `refresh(scope)` after each update.
- `components/WithRealTimeUpdates/generateWrapper.tsx` — server wrapper that injects `visualEditing: true` during draft and chooses realtime vs server render.
- `utils/queryDatoCMS.ts` — attaches `withContentLinkHeaders` when visual editing is on; disables caching for preview traffic.
- `components/ScrollToTop/index.tsx` — floating toggle that controls the controller only (persisted in `localStorage`).
- `app/[lng]/**/LiveContent.tsx` — client renderers that reuse their server views; crucial for DOM reuse.

### Responsive images & stega data

DatoCMS stores stega payloads on the original upload fields (`Upload.alt`, structured text, etc.). To keep overlays working on responsive images:

- Request both the upload `alt` and the `responsiveImage` fragment.
- Render the decoded string directly (do not call `stripStega`).
- Ensure editors populate alt text for every asset that should be editable.

## Realtime Updates + Visual Editing (App Router)

DatoCMS’ realtime Listen API can run alongside Visual Editing overlays as long as the initial markup still comes from the server. The pattern used in this demo keeps the server in charge of fetching stega-rich data, and adds a thin client “island” that streams updates without triggering page refreshes.

### Why a server-first render?

- `queryDatoCMS` (and `withContentLinkHeaders`) already attach the `X-Base-Editing-Url` header and return `_editingUrl` metadata; Visual Editing breaks if those headers are missing even once.
- Server components stay free to call `draftMode()`, `notFound()`, and locale helpers.
- The Visual Editing bridge expects the DOM it hydrates to contain stega attributes. Replaying the same React view on the client ensures overlays stay aligned as data changes.

### Implementation checklist

1. **Keep the page layout as a Server Component**  
   - Example: `app/[lng]/home/Content.tsx` calls `notFound()` and renders `HomeContentView`.  
   - This component receives GraphQL data from `generateWrapper` and runs exactly once per request.

2. **Extract a pure “view” function**  
   - Share the JSX that renders the page (`HomeContentView`, `ProductContentView`, etc.) so the server and client paths use identical markup and keep stega attributes intact.

3. **Create a lightweight client wrapper**  
   - Example: `app/[lng]/home/LiveContent.tsx` simply re-exports the shared view with `'use client'`.  
   - These files never fetch data; they just render the payload received from the realtime stream.

4. **Wrap the route with `generateWrapper` and `generateRealtimeComponent`**  
   - `generateWrapper` (server) fetches preview data, ensures `_editingUrl` is requested, and passes it to the realtime component whenever draft mode is enabled.  
   - `generateRealtimeComponent` returns a small client component that renders once with the server payload and then calls `useDatoVisualEditingListen` to keep the DOM in sync with Dato’s SSE stream.  
   - Because the same DOM node is reused, the visual-editing controller can simply refresh the tree—no duplicate “fallback” markup is needed.

5. **Provide draft-only realtime bridges**  
   - Each route exports a `RealTime.tsx` client component (e.g. `app/[lng]/home/RealTime.tsx`) that passes the client view to `generateRealtimeComponent`.

6. **Ensure the Listen subscription sends `X-Base-Editing-Url` and reuse the global controller**
   - `components/WithRealTimeUpdates/index.tsx` wraps the Listen fetcher so the preview stream includes `_editingUrl` on every payload.
   - It imports the shared controller via `getVisualEditingController()` and passes it to `useDatoVisualEditingListen` (no `controllerOptions`).
   - On each update, it merges new data into React state, re-renders the same view, and calls `refresh(scope)` so overlays re‑mark the subtree.

7. **Expose the preview token only in draft mode**  
   - `generateWrapper` guards the client listener with `isDraft && DATOCMS_READONLY_API_TOKEN` so production bundles never ship secrets.

### Files to study

- `components/preview/DatoVisualEditingBridge.tsx` — controller lifecycle and hydration delay.
- `components/WithRealTimeUpdates/index.tsx` — Listen + overlay refresh using the shared controller.
- `components/WithRealTimeUpdates/generateWrapper.tsx` — server wrapper for draft/deterministic variables.
- `app/[lng]/**/LiveContent.tsx` — client renderers that reuse the server view.
- `app/[lng]/**/RealTime.tsx` — route-scoped client shell created by `generateRealtimeComponent`.

### Common pitfalls

- Two controllers racing (bridge + realtime) → overlays “disappear” after ~1s. Fix: do not pass `controllerOptions` in the realtime hook; reuse the global controller.
- DOM replacement after hydration (e.g. keyed remounts, `dynamic(..., { ssr: false })`) → “no editables” warning. Fix: reuse the exact server view in the client and avoid keyed wrapper swaps.
- Missing `X-Base-Editing-Url` on any request while in draft → `_editingUrl` absent and overlays won’t mark. Fix: keep `withContentLinkHeaders` on both server and client fetchers.
- Stripping stega strings before rendering — overlays can’t find targets. Fix: don’t call `stripStega` on fields you want to edit visually.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Overlay never enables | Missing `NEXT_PUBLIC_DATO_BASE_EDITING_URL` or draft cookies | Verify `.env.local`, restart dev server, re-run `/api/draft?...` |
| Overlays vanish ~1s after enabling | Two controllers racing or DOM got replaced | Reuse the global controller only; ensure client renders the same view the server used |
| “no editable elements were detected after enable()” | Enabled too early, before hydration/stream settled | Keep the bridge delay; avoid keyed remounts or `ssr: false` wrappers; mount the bridge before `{children}` |
| Live updates apply but overlays don’t move | Not calling `refresh(scope)` after SSE update | Realtime wrapper already does this; ensure it receives the global controller |
| Overlays flip off when re-entering draft | `localStorage` persisted disabled state | Re-enable once or clear `datocms.visual-editing.enabled` |

## Contributing

Pull requests that improve the visual editing UX are welcome. Please run `pnpm lint` before committing and include reproduction steps for any visual editing changes so we can verify overlay behaviour across locales and devices.

## Editor Tooling

For a better authoring experience install the [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) extension. It provides schema-aware completions for the generated `.graphql` documents used throughout this repo.

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is the REST & GraphQL Headless CMS for the modern web.

Trusted by over 25,000 enterprise businesses, agencies, and individuals across the world, DatoCMS users create online content at scale from a central hub and distribute it via API. We ❤️ our [developers](https://www.datocms.com/team/best-cms-for-developers), [content editors](https://www.datocms.com/team/content-creators) and [marketers](https://www.datocms.com/team/cms-digital-marketing)!

**Why DatoCMS?**

- **API-First Architecture**: Built for both REST and GraphQL, enabling flexible content delivery
- **Just Enough Features**: We believe in keeping things simple, and giving you [the right feature-set tools](https://www.datocms.com/features) to get the job done
- **Developer Experience**: First-class TypeScript support with powerful developer tools

**Getting Started:**

- ⚡️ [Create Free Account](https://dashboard.datocms.com/signup) - Get started with DatoCMS in minutes
- 🔖 [Documentation](https://www.datocms.com/docs) - Comprehensive guides and API references
- ⚙️ [Community Support](https://community.datocms.com/) - Get help from our team and community
- 🆕 [Changelog](https://www.datocms.com/product-updates) - Latest features and improvements

**Official Libraries:**

- [**Content Delivery Client**](https://github.com/datocms/cda-client) - TypeScript GraphQL client for content fetching
- [**REST API Clients**](https://github.com/datocms/js-rest-api-clients) - Node.js/Browser clients for content management
- [**CLI Tools**](https://github.com/datocms/cli) - Command-line utilities for schema migrations (includes [Contentful](https://github.com/datocms/cli/tree/main/packages/cli-plugin-contentful) and [WordPress](https://github.com/datocms/cli/tree/main/packages/cli-plugin-wordpress) importers)

**Official Framework Integrations**

Helpers to manage SEO, images, video and Structured Text coming from your DatoCMS projects:

- [**React Components**](https://github.com/datocms/react-datocms)
- [**Vue Components**](https://github.com/datocms/vue-datocms)
- [**Svelte Components**](https://github.com/datocms/datocms-svelte)
- [**Astro Components**](https://github.com/datocms/astro-datocms)

**Additional Resources:**

- [**Plugin Examples**](https://github.com/datocms/plugins) - Example plugins we've made that extend the editor/admin dashboard
- [**Starter Projects**](https://www.datocms.com/marketplace/starters) - Example website implementations for popular frameworks
- [**All Public Repositories**](https://github.com/orgs/datocms/repositories?q=&type=public&language=&sort=stargazers)

<!--datocms-autoinclude-footer end-->
