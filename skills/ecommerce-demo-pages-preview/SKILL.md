---
name: ecommerce-demo-pages-preview
description: >-
  Use for route-level page and preview work in the DatoCMS ecommerce website
  demo starter, especially adding or troubleshooting a new record-backed page
  route, static params, Next.js metadata, draft preview-links mapping, Web
  Previews URLs, or SEO analysis route mapping. Trigger on prompts like "add a
  new lookbook page", "create /[lng]/campaign/[slug]", "map this model in
  preview-links", or "SEO analysis does not know this page route". Covers the
  starter's meta.ts, query.graphql, page.tsx, Content.tsx, RealTime.tsx,
  app/api/draft/preview-links/route.tsx, and app/api/seoAnalysis/route.tsx
  when the request is about a page route. Do not use for homepage sections,
  product listing filters, product detail rendering, product sale price or card
  UI changes, generic DatoCMS frontend setup, or generic Next.js routing outside
  this starter.
---

# Ecommerce Demo Pages and Preview

Use this for record-backed page routes in the ecommerce starter, including preview-links and SEO analysis route mappings.

## Prerequisites

Before schema or content operations:

- Expect the DatoCMS skills plugin to be installed. If it is missing, pause and request installation before continuing.
- Strongly recommend the DatoCMS remote MCP from `/Users/marcelofinamorvieira/datoCMS/dev/remote-mcp`. If page model or record facts are needed and the MCP is not running, pause and request startup.
- Inspect live schema/content through MCP before assuming model API keys, slug fields, singleton status, or localized fields.

## Existing page pattern

Record-backed pages use this route folder shape under `app/[lng]/...`:

- `query.graphql` for the route data query.
- `meta.ts` for generated document/type exports and page prop types.
- `page.tsx` for variables, metadata, static params when needed, and `generateWrapper`.
- `Content.tsx` for published rendering.
- `RealTime.tsx` for draft/live preview rendering.
- Optional `staticParams.graphql` for slug-backed collection routes.

Existing examples:

- singleton route: `app/[lng]/showcase/`.
- collection route: `app/[lng]/legal/[slug]/`.
- product route: `app/[lng]/product/[slug]/`.

## Workflow for a new record-backed page route

1. Confirm this is a page route, not a homepage section or catalog filter.
2. Inspect the target DatoCMS model through MCP.
3. Reuse an existing model when appropriate. If a new model or fields are needed, route modeling to `datocms-content-modeling` and implementation to `datocms-cli`, `datocms-cma`, or MCP.
4. Add a route folder under `app/[lng]/...` following the closest existing route pattern.
5. Add `query.graphql` with SEO fields when the model supports SEO metadata.
6. Add `meta.ts` exporting the generated document, query type, variables type, and page props.
7. Add `page.tsx` using `generateWrapper`; add `generateMetadataFn` when SEO tags are available.
8. Add `staticParams.graphql` and `generateStaticParams` for slug-backed collection routes.
9. Add `Content.tsx` and `RealTime.tsx` using the existing wrapper/realtime pattern.
10. Refresh GraphQL types.
11. Update `app/api/draft/preview-links/route.tsx` so the model API key maps to the route URL.
12. Update `app/api/seoAnalysis/route.tsx` when the model should support SEO/readability analysis.
13. Verify published route, draft preview link, metadata, and localized static params.

## Preview mapping rules

- Return no preview link for unknown model API keys instead of throwing.
- Use the record slug only after confirming the field exists.
- Keep draft and published preview link behavior aligned with the existing route handler.
- Preserve locale in generated preview URLs.

## Guardrails

- Homepage section creation belongs to `ecommerce-demo-sections`.
- Product listing filters belong to `ecommerce-demo-catalog`.
- Do not re-explain general draft mode setup unless this starter's preview infrastructure is absent.
- Do not provide a generic Next.js App Router tutorial.

## Acceptance criteria

- Published route works.
- Draft preview link opens the correct localized URL.
- Metadata uses DatoCMS SEO tags when available.
- Static params include all locales when needed.
- Unknown model API keys return no preview link instead of failing.
