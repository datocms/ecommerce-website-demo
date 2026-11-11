<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# An Ecommerce Website Demo using Next.js 16 and DatoCMS

This example showcases a TypeScript Next.js 16 website with App Router (app) — using [DatoCMS](https://www.datocms.com/) as the data source.

It uses the official [@datocms/cda-client](https://github.com/datocms/cda-client) for content fetching, which provides TypeScript support, auto-retry on rate limits, and better error handling.

It also uses [gql.tada](https://gql-tada.0no.co/), so every GraphQL query is fully typed and your IDE will help you complete the GraphQL queries.

## Demo

Have a look at the end result live:

### [https://ecommerce-website-demo-livid.vercel.app/](https://ecommerce-website-demo-livid.vercel.app/)

## How to use

### Quick start

1. [Create an account on DatoCMS](https://datocms.com).

2. Make sure that you have set up the [Github integration on Vercel](https://vercel.com/docs/git/vercel-for-github).

3. Let DatoCMS set everything up for you clicking this button below:

[![Deploy with DatoCMS](https://dashboard.datocms.com/deploy/button.svg)](https://dashboard.datocms.com/deploy?repo=marcelofinamorvieira%2Fecommerce-website-demo%3Amain)

### Local setup

Once the setup of the project and repo is done, clone the repo locally.

#### Set up environment variables

In your DatoCMS' project, go to the **Settings** menu at the top and click **API tokens**.

Create three DatoCMS API tokens: `CDA Only (Published)`, `CDA Only (Draft)`, and `CMA Only (Read)`.

Next, copy the `.env.example` file in this directory to `.env` (which will be ignored by Git):

```bash
cp .env.example .env
```

and set `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN`, `DATOCMS_DRAFT_CONTENT_CDA_TOKEN`, and `DATOCMS_CMA_TOKEN` with the matching token values.

Set `DATOCMS_BASE_EDITING_URL` to your project's admin URL (`https://<project>.admin.datocms.com`) so Visual Editing can open records.

Then set the three secret tokens that guard the endpoints used for Web Previews, SEO Previews and cache invalidation. Generate a different, cryptographically-secure random string for each of them (`openssl rand -hex 32` is a good way to do it) — never reuse the same value across projects:

```
URL=http://localhost:3000
SEO_SECRET_TOKEN=<random string>
DRAFT_SECRET_TOKEN=<random string>
CACHE_INVALIDATION_SECRET_TOKEN=<random string>
```

> If you deployed this demo with the "Deploy with DatoCMS" button, these three secrets were generated randomly for you and shown on the last step of the setup wizard. If you no longer have them, set new ones from your hosting provider's environment variable settings.

#### Run your project locally

```bash
npm install
npm run dev
```

Your store should be up and running on [http://localhost:3000](http://localhost:3000)!

## Project structure

```
app/
  layout.tsx                root <html>, font, draft-mode toggle and visual-editing overlay
  not-found.tsx             404 page
  [lng]/                    every page lives under its locale (/en/..., /it/...)
    layout.tsx, meta.ts,    the site shell (header and footer), built from the Layout record
    Content.tsx, RealTime.tsx
    home/                   home page, served at /<locale>/home (proxy.ts redirects / and
                            /<locale> there): CMS sections plus the newest products
    products/               catalog with filters, sorting, search and pagination
    product/[slug]/         product page
    showcase/               lookbook: photos, collections, new products and materials
    stores/                 store list with a pager
    legal/[slug]/           legal pages with a section index
  api/                      draft mode, Web Previews links, cache revalidation,
                            SEO analysis, post-install setup, product slug map
components/
  Common/                   generic building blocks: demo action button, drawer, section
                            title, social link, optional link (a CMS link that may have no
                            target), SVG icon, shared class recipes (styles.ts)
  DatoImage/                DatoCMS responsive image and its ResponsiveImageFragment
  DatoStructuredText/       Structured Text renderer with visual-editing boundaries
  DraftMode/                draft-mode toggle, token form, success toast and the Content Link
                            overlay
  Layout/                   site shell: Header/, Footer/, cookie notice, language selector,
                            accent color, <html lang> sync
    Header/                 nav bar, mega menu (MegaMenuPanel, category links from
                            Layout.menu via menu.ts), mobile menu, search, cart, notification
                            strip and the CMS popup
  Motion/                   PageTransition (page fades), Rise (word-by-word titles) and
                            LinkPending (marks a link whose page is loading)
  ProductCard/              the product card shared by every product list, and Price.tsx
                            (the price block, also used by the buy box)
  ProductDetail/            product page: gallery, buy box, description blocks, reviews,
                            related products
  ProductListing/           catalog page: FilterDetail header, toolbar, filters, sort, search
                            chip, empty results, pagination
  Rail/                     controls, keyboard focus and progress bar for horizontal scrollers
  Sections/                 home page sections, one folder per CMS block,
                            plus NewArrivals (the newest products)
  WithRealTimeUpdates/      generateWrapper() and ContentOrRealTime, which render a route from
                            published content or live draft content
lib/
  datocms/                  gql.tada setup, generated schema types and queryDatoCMS();
                            linkHref() (the href of a CMS link); for CMA records,
                            localizedString() (field values) and recordToWebsiteRoute() (a
                            record's page, for Web Previews, SEO analysis and linkHref())
  i18n.ts                   site locales, read from DatoCMS
  ...                       small helpers: route prop types, product slugs and paths, price
                            formatting, color contrast, redirect checks, site URL
styles/
  global.css                the entry file: Tailwind and its @source folders, then the files
                            below in this order
  tokens.css                Tailwind @theme tokens and the :root layout and motion variables
  base.css                  element defaults
  layout.css                shell, rails, black bands, logo
  typography.css            display type (title-*, giant)
  actions.css               buttons and text links
  labels.css                eyebrow, tags, chips
  forms.css                 form fields
  prose.css                 prose-dato, for Structured Text output
  overrides.css             unlayered rules, including the Content Link stega reset
  motion.css                animation utilities
  view-transitions.css      page, results and product-photo view transitions
proxy.ts                    sends locale-less URLs to the visitor's language
schema.graphql              DatoCMS schema, regenerated by `npm run generate-schema`
datocms.json                "Deploy with DatoCMS" settings (env vars, post-install URL)
skills/                     agent skills that describe how to extend this starter
```

### How a page is rendered

Most route folders under `app/[lng]/` contain the same four files:

- `meta.ts` holds the page's GraphQL `query`, written with `graphql()` from `lib/datocms/graphql.ts`, and the `Query` and `Variables` types that gql.tada infers from it.
- `page.tsx` builds the query variables and passes everything to `generateWrapper()`. It also exports `generateMetadata` for the SEO tags, which override the site-wide defaults from `app/[lng]/layout.tsx`: the favicons and the fallback title and description from the DatoCMS global SEO settings.
- `Content.tsx` renders the query result.
- `RealTime.tsx` wraps `Content.tsx` in a live subscription.

`generateWrapper()` runs the query through `queryDatoCMS()` and passes the result to `ContentOrRealTime`, both in `components/WithRealTimeUpdates/`. Visitors get `Content.tsx` rendered from published content, cached under the `datocms` tag that the `/api/revalidateCache` webhook clears. In draft mode `ContentOrRealTime` renders `RealTime.tsx` instead, which subscribes to the same query and re-renders `Content.tsx` every time an editor saves. Either way it wraps the page in `PageTransition`, so a route change fades but a draft toggle or a live update does not.

Two routes differ from this pattern:

- `products/` depends on search params, so its `page.tsx` runs the queries from `meta.ts` on every request and wraps its output in `PageTransition` itself. There is no `RealTime.tsx`.
- `product/[slug]/page.tsx` runs its query itself so it can first redirect to the product's slug in the current language, then renders through `ContentOrRealTime`.

### Draft mode and Visual Editing

Editors reach draft mode in two ways. The Web Previews plugin, which `/api/post-install` installs, asks `/api/draft/preview-links` for a record's links (`recordToWebsiteRoute()` in `lib/datocms/` maps the record to its page) and opens `/api/draft/enable?token=…`. The toggle at the bottom right of every page (`components/DraftMode/DraftModeToggle.tsx`, mounted in `app/layout.tsx`) asks for `DRAFT_SECRET_TOKEN` and calls the same route. `/api/draft/enable` and `/api/draft/disable` switch Next.js draft mode on and off.

In draft mode `queryDatoCMS()` uses the draft token, skips the cache and asks for Content Link metadata. `ContentOrRealTime` renders `RealTime.tsx`, and `app/layout.tsx` mounts the `ContentLink` overlay, so clicking a piece of text opens its record in DatoCMS. Draft strings carry invisible stega characters for that overlay, so the code calls `stripStega()` before it uses a text value as a URL, a comparison key or an attribute; `linkHref()` (`lib/datocms/linkHref.ts`) does it for a link's `page`. Slug fields never carry stega, so product links (`productPath()` in `lib/productPath.ts`) use the slug as is.

### Locales

The locales come from the DatoCMS project settings (`lib/i18n.ts`), and the first one is the fallback that route queries pass as `fallbackLocales`. Every page sits under `app/[lng]/`, and `proxy.ts` sends a URL without a locale to the visitor's best `Accept-Language` match, and a bare `/<locale>` to its home page. Content is localized in DatoCMS, and UI labels such as button text, filter names and the currency symbol come from the localized General Interface singleton. A few strings are still hard-coded in English: the skip link, the catalog's empty state and result count, "Clear all", the draft-mode UI and some screen-reader labels (in `Price.tsx` and `Pagination.tsx`, for example). Product slugs differ per locale: the product page redirects a slug from another locale to the current one (`lib/productSlugs.ts`), and the language selector asks `/api/product-slug-map` for the slug in the locale it switches to.

### Where data and components live

Reusable CMS blocks keep their GraphQL fragment in a `fragments.ts` next to the component: the home sections in `components/Sections/`, the product-description blocks in `components/ProductDetail/Blocks/`, and `DatoImage`. The route's `meta.ts` spreads the fragment into its query, and the component reads its data back with `readFragment()`. For example, `app/[lng]/home/meta.ts` spreads every section fragment inside `sections`, and `app/[lng]/home/Content.tsx` picks the component by `__typename`.

Labels from the General Interface record that a whole feature folder uses sit in that folder's `fragments.ts`, next to the type of the components' `labels` prop (`ProductListingLabels` in `ProductListing/fragments.ts`, `ProductPageLabels` in `ProductDetail/fragments.ts`).

Route-specific UI, such as the site shell in `components/Layout/` and the product page in `components/ProductDetail/`, types its props from the route's `Query` instead. `ProductCard` takes plain props, so any query can feed it. Four queries select its fields today, and each has a call site that maps them to props: `productsQuery` in `app/[lng]/products/meta.ts` (`products/page.tsx`), `ProductRailFragment` in `components/Sections/NewArrivals/fragments.ts` (`NewArrivals/ProductRail.tsx`), `showcase.newProducts` in `app/[lng]/showcase/meta.ts` (`showcase/NewProducts.tsx`) and `product.relatedProducts` in `app/[lng]/product/[slug]/meta.ts` (`ProductDetail/RelatedProducts.tsx`). A new card field goes into all four.

Every link an editor sets in the CMS has the same shape. The Simple Button, Link Item and Footer Item blocks carry a `label`, a `record` (a collection, brand, material, product or legal page) and a `page` (`products`, `sale`, `showcase` or `stores`), which counts only when there is no record. Their queries select `page` and `record { ...LinkRecordFragment }`, and `linkHref()` in `lib/datocms/linkHref.ts` builds the href, always under the current locale:

| Link | Href |
| --- | --- |
| collection, brand or material | `/<locale>/products?collections=<id>` (or `brands=`, `materials=`) |
| product | `/<locale>/product/<slug>` |
| legal page | `/<locale>/legal/<slug>` |
| page `products`, `showcase`, `stores` | `/<locale>/products`, `/<locale>/showcase`, `/<locale>/stores` |
| page `sale` | `/<locale>/products?orderBy=onSale_DESC` (products on sale first) |

A link with neither a record nor a page has no href, and `OptionalLink` (`components/Common/`) renders its label as plain text. Record links inside the notification strip's Structured Text go through the same mapping (`recordHref()`), which is `recordToWebsiteRoute()` applied to a queried record.

Feature areas with several components get a folder in `components/` (`ProductDetail/`, `ProductListing/`), even when one route uses them. Pieces split out of a single route's `Content.tsx`, and small helpers for one route, sit next to that route, like `legal/[slug]/SectionIndex.tsx`, the `showcase/` sections or `home/showcaseGroups.ts`.

Tailwind only scans `app/` and `components/` for class names, so keep class strings in those two folders.

Motion lives in two places, `styles/` and `components/Motion/`:

- The utilities (`enter`, `reveal-stagger`, `press`…) sit in `styles/motion.css`, and the page, results and product-photo view transitions in `styles/view-transitions.css`. The durations and curves they use are tokens in `styles/tokens.css`.
- `components/Motion/` holds three components: `PageTransition` (page fades), `Rise` (page titles, word by word) and `LinkPending` (marks a link whose page is loading).
- To add an animation, add its `@keyframes` and an `@utility` to `styles/motion.css`, inside a `prefers-reduced-motion: no-preference` media query like the others, then put the class on the element.
- A fixed or sticky shell element that stays on screen across pages needs a `data-chrome` attribute and a name in `styles/view-transitions.css`, so pages pass under it during navigation.

## Updating the GraphQL schema

The types of every query come from the DatoCMS schema saved in `schema.graphql`. When you change models or fields in your DatoCMS project, make sure `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN` is set in your `.env` file and run:

```bash
npm run generate-schema
```

Executing this task will automatically update the `schema.graphql` and `lib/datocms/graphql-env.d.ts` files for you.

## VS Code

It is highly recommended to follow [these instructions](https://gql-tada.0no.co/get-started/installation#vscode-setup) for an optimal experience with Visual Studio Code, including features like diagnostics, auto-completions, and type hovers for GraphQL.

Biome formats and lints the code (`npm run format`, `npm run lint`). The workspace settings make the Biome extension the default formatter.

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**
- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.


<!--datocms-autoinclude-footer end-->
