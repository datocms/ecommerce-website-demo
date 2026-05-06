---
name: ecommerce-demo-layout
description: >-
  Use when changing shared site layout behavior in the DatoCMS ecommerce website
  demo starter, even if the user does not say "layout": header, nav/navigation
  bar, dropdown menus, mobile menu, logo, accent color, notification strip,
  announcement/top banner, popup, cookie notice, footer, footer columns, social
  links, newsletter footer, search bar/placeholder, language selector, currency
  display, cart shell, and Layout or General Interface singleton fields that
  affect those shared surfaces. Trigger on prompts like "change the popup",
  "update the footer links", "add a banner at the top", "change the menu",
  "replace the logo", "hide the newsletter footer", "change the search
  placeholder", "update the cookie notice", or "change the site accent color".
  Do not use for homepage section blocks, product listing filters, product
  detail rendering, product card behavior, new record-backed page routes, draft
  preview links, SEO route mapping, generic content imports, or page content
  that does not affect shared site layout.
---

# Ecommerce Demo Layout

Use this for shared site layout behavior in the ecommerce starter: header, navigation, popup, cookie notice, notification strip, footer, newsletter footer, search, language/currency display, logo, and accent color.

## Prerequisites

Before schema or content operations:

- Expect the DatoCMS skills plugin to be installed. If it is missing, pause and request installation before continuing.
- Strongly recommend the DatoCMS remote MCP from `/Users/marcelofinamorvieira/datoCMS/dev/remote-mcp`. If layout schema or content facts are needed and the MCP is not running, pause and request startup.
- Inspect live schema/content through MCP before assuming singleton field shapes, localized fields, linked records, or block validators.

## Existing layout structure

- Shared shell route query: `app/[lng]/query.graphql`.
- Shared shell renderer: `app/[lng]/Content.tsx`.
- Header components: `components/Header/**`.
- Footer component: `components/Footer/index.tsx`.
- Accent color component: `components/Common/CustomColor.tsx`.
- Shared DatoCMS records: `Layout` and shell-related `General Interface` fields.
- `Layout.menu` drives header navigation, link items, dropdown menus, dropdown columns, and category-style menu links.
- `Layout.footerColumns`, `Layout.socialMediaLinks`, footer logo/title/subtitle, and copyright fields drive the footer.
- `Layout.popup`, `Layout.cookieNotice`, and `Layout.notification` drive site-wide overlays and top messaging.
- `General Interface` drives shared labels such as search placeholder, newsletter footer labels, currency symbol, and header dropdown labels.

## Common workflows

### Change existing layout content

1. Inspect the current `Layout` or `General Interface` singleton content through MCP.
2. Preserve existing fields and localized values unless the user explicitly scopes the change.
3. Update the appropriate DatoCMS singleton field or nested block.
4. If the affected record is published or used in published pages, publish the update when appropriate.
5. Verify the affected shared surface in a localized route such as `/en/home`.

### Add or change layout rendering

1. Confirm the request affects the shared shell, not a homepage section, catalog surface, or page route.
2. Inspect the live field shape through MCP before changing queries or components.
3. Update `app/[lng]/query.graphql` only when the shared query needs more data.
4. Update the relevant shared component under `components/Header/**`, `components/Footer/index.tsx`, or the shared shell renderer.
5. Refresh GraphQL types after query changes.
6. Verify the shared surface on at least one homepage route and one non-homepage route when practical.

### Adjust navigation

1. Inspect `Layout.menu` and its linked records before assuming menu item types.
2. Preserve existing dropdown/link behavior unless the user asks for a structural change.
3. Keep category links in the form `/<locale>/products?<modelApiKey>s=<recordId>` unless changing product listing parsing too.
4. Verify desktop and mobile menus.

### Adjust footer

1. Inspect `Layout.footerColumns`, `Layout.socialMediaLinks`, footer logo, title, subtitle, and copyright fields.
2. Preserve existing footer column order unless the user requests a reorder.
3. Keep footer item links locale-aware.
4. Verify newsletter footer behavior through `General Interface.displayNewsletterFooter` when relevant.

### Adjust popup, cookie notice, or notification strip

1. Inspect the relevant `Layout` field and nested block shape.
2. Preserve dismiss button, image, and button-link behavior unless the user asks otherwise.
3. Confirm whether the user wants to update content, rendering, or both.
4. Verify the component still handles an absent block or empty notification safely.

## Guardrails

- Homepage sections belong to `ecommerce-demo-sections`.
- Product listings, filters, product detail rendering, product card behavior, sale pricing, and product-page labels belong to `ecommerce-demo-catalog`.
- New record-backed routes, draft preview links, route metadata, and SEO route mapping belong to `ecommerce-demo-pages-preview`.
- Generic schema design decisions belong to `datocms-content-modeling` first.
- Bulk content operations belong to `datocms-cma`, `datocms-cli`, or MCP unless shared layout wiring is also requested.
- Use `General Interface` here only when the field affects the shared shell. Product listing labels and product detail labels belong to catalog work.
- Do not treat one-off page body content as layout work unless it appears in the shared shell across routes.

## Acceptance criteria

- Shared layout queries remain typed after query changes.
- Header, footer, popup, cookie notice, notification strip, newsletter footer, search, language selector, and accent color still render safely when their DatoCMS fields are absent or empty.
- Desktop and mobile navigation still work after menu changes.
- Footer links remain locale-aware.
- GraphQL type generation passes after query changes.
- Build passes after code changes.
