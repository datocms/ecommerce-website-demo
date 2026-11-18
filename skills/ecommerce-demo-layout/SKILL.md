---
name: ecommerce-demo-layout
description: >-
  Use when changing shared site layout behavior in the DatoCMS ecommerce website
  demo starter, even if the user does not say "layout": header, nav/navigation
  bar, dropdown menus, mobile menu, logo, accent color, notification strip,
  announcement/top banner, footer, footer columns, social links, newsletter footer, search bar/placeholder, language selector, currency
  display, cart shell, and Layout or General Interface singleton fields that
  affect those shared surfaces. Trigger on prompts like
  "update the footer links", "add a banner at the top", "change the menu",
  "replace the logo", "hide the newsletter footer", "change the search
  placeholder", or "change the site accent color".
  Do not use for homepage section blocks, product listing filters, product
  detail rendering, product card behavior, new record-backed page routes, draft
  preview links, SEO route mapping, generic content imports, or page content
  that does not affect shared site layout.
---

# Ecommerce Demo Layout

Use this for shared site layout behavior in the ecommerce starter: header, navigation, notification strip, footer, newsletter footer, search, language/currency display, logo, and accent color.

## Prerequisites

Before schema or content operations:

- Expect the DatoCMS skills plugin to be installed. If it is missing, pause and request installation before continuing.
- Recommend a DatoCMS MCP server connected to this project. If layout schema or content facts are needed and none is available, pause and ask for one.
- Inspect live schema/content through MCP before assuming singleton field shapes, localized fields, linked records, or block validators.

## Existing layout structure

- Shared shell route query: `query` in `app/[lng]/(site)/meta.ts`.
- Shared shell renderer: `app/[lng]/(site)/Content.tsx`. The root layout, `app/[lng]/layout.tsx`, renders `<html lang>`, the font, the draft-mode toggle and the Content Link overlay around the shell.
- Header components: `components/Layout/Header/**` (NavBar, SiteLogo, DropdownNavItem, MegaMenuPanel, FeatureTiles, MobileMenu, MobileCategory, MobileSearchForm, SearchDialog, Cart, NotificationStrip; menu hrefs in `menu.ts`, search submit in `useProductSearch.ts`).
- Footer component: `components/Layout/Footer/index.tsx` (newsletter row in `NewsletterSignup.tsx`, logo and socials in `FooterBrand.tsx`, link columns in `FooterColumns.tsx`, copyright and language switch in `LegalBar.tsx`).
- Shared by header and footer: `components/Layout/LanguageSelector/` (trigger in `index.tsx`, list in `LocaleList.tsx`).
- Announcement strip dismissal: the strip remembers a dismissal in localStorage by a fingerprint of the message in all locales (`announcementId()` in `components/Layout/Header/announcement.ts`, key and pre-paint rules in `lib/dismissedAnnouncement.ts`). `ServerOnlyScript` (`components/Common/ServerOnlyScript.tsx`), mounted in the root layout, hides a dismissed strip before first paint.
- Accent color component: `components/Layout/CustomColor.tsx`, fed by `Layout.accentColor`.
- Shared DatoCMS records: `Layout` and shell-related `General Interface` fields.
- `Layout.menu` drives header navigation, link items, dropdown menus, dropdown columns, and category-style menu links.
- `Layout.footerColumns`, `Layout.socialMediaLinks`, footer logo/title/subtitle, and copyright fields drive the footer.
- `Layout.notification` drives the top announcement strip.
- CMS links share one shape: Link Item (menu), Footer Item, and Simple Button blocks carry `label`, `record` (a collection, brand, material, product, or legal page), and `page` (`home`, `products`, `sale`, `showcase`, or `stores`, used only without a record). Queries select `page` and `record { ...LinkRecordFragment }`; `linkHref()` in `lib/datocms/linkHref.ts` builds the locale-prefixed href and returns null when neither is set, which `OptionalLink` (`components/Common/OptionalLink.tsx`) renders as plain text.
- `Layout.notification` is Structured Text that can link records (`itemLink` nodes): its query selects `links { ...LinkRecordFragment }`, and `NotificationStrip.tsx` renders them with `recordHref()` from the same file.
- `General Interface` drives shared labels such as the skip link, menu, search, bag and cart texts, pause and play, newsletter footer labels, currency symbol, and header dropdown labels. A new visible string in the shell goes into General Interface, not into the code. Still English on purpose: the demo notice (`components/Common/DemoActionButton.tsx`) and the draft-mode UI (`components/DraftMode/`).
- Shell elements that stay on screen across pages (the strip, header, mega-menu scrim, sheets and draft dock) carry `data-chrome`, and `styles/view-transitions.css` names each one, so pages pass under them during navigation. A new fixed or sticky shell element needs both the attribute and a name in `styles/view-transitions.css`.

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
3. Update the `query` in `app/[lng]/(site)/meta.ts` only when the shared query needs more data.
4. Update the relevant shared component under `components/Layout/Header/**`, `components/Layout/Footer/**`, or the shared shell renderer.
5. After query changes, run `npm run generate-schema` if the DatoCMS schema changed, then validate with `npx gql.tada check` and `npm run typecheck`.
6. Verify the shared surface on at least one homepage route and one non-homepage route when practical.

### Adjust navigation

1. Inspect `Layout.menu` and its linked records before assuming menu item types.
2. Preserve existing dropdown/link behavior unless the user asks for a structural change.
3. Keep category links in the form `/<locale>/products?<modelApiKey>s=<recordId>` unless changing product listing parsing too.
4. Build link item hrefs with `linkHref()`; a new `page` option needs a case in `lib/datocms/linkHref.ts`.
5. Verify desktop and mobile menus.

### Adjust footer

1. Inspect `Layout.footerColumns`, `Layout.socialMediaLinks`, footer logo, title, subtitle, and copyright fields.
2. Preserve existing footer column order unless the user requests a reorder.
3. Keep footer item links locale-aware: build them with `linkHref()`.
4. Verify newsletter footer behavior through `General Interface.displayNewsletterFooter` when relevant. Submitting the form opens a demo notice (`DemoNotice` from `components/Common/DemoActionButton.tsx`); no email tool is wired up.

### Adjust the notification strip

1. Inspect the `Layout.notification` field.
2. Preserve the dismiss button and its remembered dismissal unless the user asks otherwise. Keep `links` in the notification query, or its record links fail to render.
3. Confirm whether the user wants to update content, rendering, or both.
4. Verify the component still handles an empty notification safely.

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
- Header, footer, notification strip, newsletter footer, search, language selector, and accent color still render safely when their DatoCMS fields are absent or empty.
- Desktop and mobile navigation still work after menu changes.
- Footer links remain locale-aware.
- `npx gql.tada check` and `npm run typecheck` pass after query changes.
- Build passes after code changes.
