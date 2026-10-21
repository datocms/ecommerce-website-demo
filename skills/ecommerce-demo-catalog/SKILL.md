---
name: ecommerce-demo-catalog
description: >-
  Use when changing product catalog behavior in the DatoCMS ecommerce website
  demo starter, including products, brands, materials, collections, product
  variations, sizes, colors, sale pricing, reviews, related products, the
  `/[lng]/products` listing page, sidebar filters, search query parameters,
  product detail rendering, and header category links built from layout menu
  records. Do not use for homepage section blocks, new record-backed page
  routes, generic ecommerce strategy, generic DatoCMS imports, or generic CMA
  scripts unless the task is tied to this starter's catalog files and schema.
---

# Ecommerce Demo Catalog

Use this for storefront catalog behavior in the ecommerce starter: products, filters, sorting, product detail rendering, and category navigation.

## Prerequisites

Before schema or content operations:

- Expect the DatoCMS skills plugin to be installed. If it is missing, pause and request installation before continuing.
- Recommend a DatoCMS MCP server connected to this project. If catalog schema or content facts are needed and none is available, pause and ask for one.
- Inspect live schema/content through MCP before assuming product, taxonomy, variant, or menu field shapes.

## Existing catalog structure

- Listing route: `app/[lng]/products/page.tsx`.
- Listing queries: `productsQuery` and `filterOptionsQuery` in `app/[lng]/products/meta.ts` (page.tsx runs them per request).
- Product detail route: `app/[lng]/product/[slug]/`.
- Product detail query: `query` in `app/[lng]/product/[slug]/meta.ts`.
- Listing filters use collections, brands, and materials.
- URL query params include `page`, `orderBy`, `productName`, `collections`, `brands`, and `materials`.
- Pagination is listing behavior: preserve active query params and reset or clamp stale `page` values after filter/sort changes.
- Header category links are built from layout menu records and use `_modelApiKey` plus record ids.
- Product variants provide colors and available sizes for the product detail UI.
- Listing UI: `components/ProductListing/`
- Product card and price: `components/ProductCard/`
- Product page UI: `components/ProductDetail/` (labels fragment in `fragments.ts`, description blocks in `Blocks/<Block>/`)

## Common workflows

### Add or change a product field on listing cards

1. Confirm the field exists through MCP or route schema work to the shared DatoCMS skills.
2. Add the field to all four queries that feed `ProductCard`: `productsQuery` in `app/[lng]/products/meta.ts`, `ProductRailFragment` in `components/Sections/NewArrivals/fragments.ts`, `showcase.newProducts` in `app/[lng]/showcase/meta.ts` and `product.relatedProducts` in `app/[lng]/product/[slug]/meta.ts`.
3. Add an optional prop to `ProductCard` (`components/ProductCard/index.tsx`) and pass it from each call site (`app/[lng]/products/page.tsx`, `components/Sections/NewArrivals/ProductRail.tsx`, `app/[lng]/showcase/Content.tsx`, `components/ProductDetail/RelatedProducts.tsx`), preserving the existing sale-price logic and links.
4. Run `npm run generate-schema` if the DatoCMS schema changed, then validate with `npx gql.tada check` and `npx tsc --noEmit`.
5. Verify pagination, filters, and search still work.

### Add or change a product field on product detail pages

1. Confirm the field exists through MCP or route schema work to the shared DatoCMS skills.
2. Add the field to the `query` in `app/[lng]/product/[slug]/meta.ts` or the relevant component fragment in its `fragments.ts`.
3. Render it in the product detail component or related block component.
4. Run `npm run generate-schema` if the DatoCMS schema changed, then validate with `npx gql.tada check` and `npx tsc --noEmit`.
5. Verify static params and draft preview still work.

### Add or change filter behavior

1. Identify whether the filter is a taxonomy record, scalar field, enum, or search term.
2. Route modeling decisions to `datocms-content-modeling` before changing schema.
3. Update listing query variables and filter arguments.
4. Update URL query param handling without breaking existing params.
5. Update `FilterPanel` (`components/ProductListing/FilterPanel.tsx`; sort options in `SortTabs.tsx`) or the listing page UI. A control inside the filters drawer pushes its query with the "filter" transition type (`pushQueryParam` in `PendingQuery.tsx`), so the results update behind the scrim instead of swapping.
6. Run `npm run generate-schema` if the DatoCMS schema changed, then validate with `npx gql.tada check` and `npx tsc --noEmit`. Verify pagination counts.

### Add or change sort behavior

1. Confirm the field is sortable in the GraphQL schema.
2. Add the order value to the listing UI.
3. Keep `orderBy` query param behavior stable.
4. Verify the `ProductModelOrderBy` enum values (typed from `schema.graphql`) and default ordering.

### Adjust header category dropdowns

1. Inspect layout menu records and linked taxonomy records through MCP.
2. Keep links in the form `/<locale>/products?<modelApiKey>s=<recordId>` unless changing the listing parser too.
3. Hrefs come from `productsHref` in `components/Layout/Header/menu.ts`; columns render in `MegaMenuPanel.tsx` (desktop) and `MobileMenu.tsx`, the Trending/New tiles in `FeatureTiles.tsx`; the menu data is the `menu` selection in `app/[lng]/meta.ts`.
4. Verify mobile and desktop category menus.

## Guardrails

- Bulk content updates belong to `datocms-cma`, `datocms-cli`, or MCP unless storefront wiring is also requested.
- Schema design decisions belong to `datocms-content-modeling` first.
- Homepage sections belong to `ecommerce-demo-sections`.
- New record-backed routes belong to `ecommerce-demo-pages-preview`.

## Acceptance criteria

- Listing query variables remain typed.
- URL query params remain stable.
- Filter counts, pagination links, and pagination range text still work.
- Check page 1, page 2 or last page, zero-result, and out-of-range `page` states when changing listing filters, sorting, or counts.
- Product detail pages still generate static params.
- `npx gql.tada check` and `npx tsc --noEmit` pass after query changes.
