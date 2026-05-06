---
name: ecommerce-demo-sections
description: >-
  Use for homepage section work in the DatoCMS ecommerce website demo starter,
  especially requests like "add a new homepage section", "add a featured brands
  section", "show three featured brands on the homepage", or "add a homepage
  block". Handles sections rendered through app/[lng]/home/Content.tsx,
  app/[lng]/home/query.graphql, components/Sections/**/fragment.graphql, and
  components/Sections/** React components. Also use when the section displays
  existing catalog data such as brands, materials, collections, or products.
  Do not use for product listing filters, product detail blocks, new page
  routes, generic schema modeling, or unrelated frontend components.
---

# Ecommerce Demo Sections

Use this for homepage section work in the ecommerce starter only. Keep generic DatoCMS schema decisions and mutations in the shared DatoCMS skills.

## Prerequisites

Before schema or content operations:

- Expect the DatoCMS skills plugin to be installed. If it is missing, pause and request installation before continuing.
- Strongly recommend the DatoCMS remote MCP from `/Users/marcelofinamorvieira/datoCMS/dev/remote-mcp`. If section schema facts are needed and the MCP is not running, pause and request startup.
- Inspect the live schema through MCP before assuming block model names, field API keys, or allowed block validators.

## Existing section pattern

Homepage sections follow this chain:

1. A DatoCMS block record appears inside `home.sections`.
2. The block has a fragment in `components/Sections/<SectionName>/fragment.graphql`.
3. The block has a React renderer in `components/Sections/<SectionName>/index.tsx`.
4. `app/[lng]/home/query.graphql` includes an inline fragment for the block.
5. `app/[lng]/home/Content.tsx` switches on `section.__typename` and renders the component.
6. GraphQL types are refreshed after query or fragment changes.

Existing section examples: Hero, Divider, ProductShowcase, MaterialShowcase, Testimonials.

## Workflow for a new homepage section

1. Confirm this is a homepage section, not a new page route or product detail block.
2. Inspect the current home model and allowed section blocks through MCP.
3. Reuse an existing block if it already represents the desired content shape.
4. If a schema change is needed, route the modeling decision to `datocms-content-modeling` and the implementation to `datocms-cli`, `datocms-cma`, or MCP. Do not duplicate those instructions here.
5. If the user asks to add a homepage section and does not explicitly say "schema/frontend only", also add an instance of the new block to the existing Home singleton's `sections` field.

   - Treat "managed from Home.sections" as both:
     1. the block model is allowed by the `Home.sections` validator, and
     2. the current Home record contains at least one block instance editors can see, edit, reorder, and preview.
   - If `Home.sections` is localized, append the section to every existing locale value unless the user requested a specific locale.
   - Preserve all existing sections and ordering; append the new section unless the user specifies placement.
   - Use existing records for referenced content when possible. For example, a featured brands section should link existing Brand records.
   - If no content selection is specified, choose a small deterministic set of existing valid records, preferably 3 items, and mention that choice in the final summary.
   - If the Home record is currently published, publish the updated Home record after adding the section so published mode and draft preview both render it.
6. Add the section fragment beside the section component.
7. Add or update the React component under `components/Sections/` using this starter's existing component props pattern.
8. Add the inline fragment to `app/[lng]/home/query.graphql`.
9. Add a `case` to the switch in `app/[lng]/home/Content.tsx` using the generated `__typename`.
10. Refresh GraphQL types.
11. Verify published rendering and draft/live preview rendering.

## Guardrails

- Do not create generic block-modeling guidance here.
- Do not handle product detail Structured Text blocks here; those belong to catalog work.
- Do not create new page routes here; use `ecommerce-demo-pages-preview`.
- Keep the existing default switch behavior: unknown section types should safely render nothing.

## Acceptance criteria

- The section appears in generated homepage query types.
- The existing Home singleton contains the new section block in `sections`.
- If `sections` is localized, the section is present in each active locale unless scoped otherwise.
- The section renders on the homepage in published mode.
- Published mode renders the new section when Home was previously published.
- The section renders in draft/live preview mode.
- Existing homepage sections still render unchanged.
- Unknown section types remain safely ignored.
