<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# An Ecommerce Website Demo using Next.js 14 and DatoCMS

This example showcases a TypeScript Next.js 14 website with App Router (app) — using [DatoCMS](https://www.datocms.com/) as the data source.

It uses GraphQL CodeGen to type all of the requests comming from Dato automatically: [See how it works here](https://www.datocms.com/blog/how-to-generate-typescript-types-from-graphql)

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

Then click **Read-only API token** and copy the token.

Next, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

and set the `DATOCMS_READONLY_API_TOKEN` variable as the API token you just copied.

Also then set a secret token that is being used for WebPreviews, SEO Previews and Cache invalidation:

```
URL=http://localhost:3000
SEO_SECRET_TOKEN=superSecretToken
DRAFT_SECRET_TOKEN=superSecretToken
CACHE_INVALIDATION_SECRET_TOKEN=superSecretToken
NEXT_PUBLIC_DATO_BASE_EDITING_URL=https://<project>.admin.datocms.com
```

`NEXT_PUBLIC_DATO_BASE_EDITING_URL` needs to point to your project's DatoCMS dashboard so the Visual Editing overlay can deep link you to the exact record while you're reviewing drafts.

#### Run your project locally

```bash
npm install
npm run dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)!

### Preview & Visual Editing

Follow this exact checklist whenever you wire up or test Visual Editing locally. Skipping a step is the fastest way to hit the “works once, then breaks after disabling” trap.

1. **Set the required environment variables.** In `.env.local` you need *both* `DATOCMS_READONLY_API_TOKEN=<token>` and `NEXT_PUBLIC_DATO_BASE_EDITING_URL=https://<project>.admin.datocms.com`. The second one is mandatory whenever a GraphQL query requests `_editingUrl`; without it DatoCMS rejects the request once the overlay is re-enabled.
2. **Enter draft mode with the edit flag.** Visit `/api/draft?secret=YOUR_DRAFT_SECRET&path=/?edit=1`. This sets the preview cookies, adds `?edit=1`, and ensures our middleware writes the `datocms-visual-editing=1` cookie.
3. **Verify the special headers are present.** While draft mode is active the app automatically includes:
   - `X-Visual-Editing: vercel-v1`
   - `X-Base-Editing-Url: https://<project>.admin.datocms.com`
   You can confirm this in your browser’s network tab on any DatoCMS GraphQL request.
4. **Toggle visual editing from the in-app control.** Use the floating “Enable Visual Editing” button (above “Enter Published Mode”) to turn overlays off and on. This control only does a soft navigation, so metadata stays warm and overlays light up immediately when you re-enable them.
5. **After toggling off, toggle back on without a full reload.** If the overlay still highlights elements, your environment is configured correctly. If it doesn’t, re-check steps 1–3—most failures are missing headers or stripped stega markup.

#### Preventing stale overlays after toggling off/on

This project ships with the safeguards already in place. If you customize the code, keep these rules intact so Visual Editing keeps working after you disable and re-enable it:

- **Never request `_editingUrl` unless `visualEditing: true`.** All queries use the `...VisualEditingFields @include(if: $visualEditing)` fragment and the page wrappers only set that flag when draft mode or the `datocms-visual-editing=1` cookie is active. Removing that guard will trigger the GraphQL error mentioned above.
- **Do not strip stega data while overlays are enabled.** Components such as `components/Common/StegaText.tsx` only call `stripStega` when visual editing is off. Keep that behaviour so the hidden markers survive a toggle.
- **Leave the client toggle logic intact.** `components/ScrollToTop/index.tsx` updates the query param and cookie with `router.replace` + `router.refresh()` instead of forcing a full reload. Reuse that pattern for any custom toggles so the existing metadata stays cached.
- **Mount the overlay once per page.** `components/preview/DatoContentLinkClient.tsx` calls `enableDatoVisualEditing` with `persistAfterClean: true`, which stops the observer from auto-cleaning metadata on mount. Make sure your layout continues to mount this component whenever draft mode is enabled.

Keep those pieces in place and the overlay survives infinite on/off cycles without requiring a hard refresh.

### Visual Editing on responsive images

DatoCMS only embeds the stega payload in the original upload fields (for example `Upload.alt`), not in the Imgix-derived `responsiveImage.alt`. To make the hover overlays appear on `<img>` tags you need to preserve that upload alt end-to-end:

1. **Request upload-level alt values wherever you query images.** Every GraphQL selection that pulls a `responsiveImage` should also ask for the parent `alt`. See `app/[lng]/query.graphql`, `app/[lng]/product/[slug]/query.graphql`, and the fragments under `components/Sections/**/fragment.graphql` for reference.
2. **Thread the raw alt through your components.** The shared image wrapper (`components/DatoImage/index.tsx`) exposes an `assetAlt` prop that overrides the `responsiveImage.alt` with the upload alt before rendering. All call sites pass the value through, so the Visual Editing overlay decodes the hidden metadata when `?edit=1` is active.
3. **Populate alt text inside DatoCMS.** Even with the overrides in place the overlay can only decode non-empty strings. Make sure editors add localized alt text to every asset that should support visual editing.

Once these three pieces are wired up, hovering any visual-edit-enabled image in draft or preview mode highlights the element and deep-links you to the exact upload record in DatoCMS when you click it.

## VS Code

It's strongly suggested to install the [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) extension, to get autocomplete suggestions, validation against schema, and many more niceties when working with your GraphQL queries.

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
