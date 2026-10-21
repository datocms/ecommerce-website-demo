// Called once by the "Deploy with DatoCMS" flow (postInstallUrl in datocms.json) to install the
// Web Previews plugin and the cache-revalidation webhook. Safe to delete after setup.

import { buildClient, type Client } from '@datocms/cma-client-node';
import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/siteUrl';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response('OK', { headers: corsHeaders });
}

async function installWebPreviewsPlugin(client: Client, baseUrl: string) {
  const webPreviewsPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-web-previews',
  });

  await client.plugins.update(webPreviewsPlugin, {
    parameters: {
      frontends: [
        {
          name: 'Production',
          previewWebhook: new URL(
            '/api/draft/preview-links',
            baseUrl,
          ).toString(),
          // The secret travels in a header: an URL ends up in logs, proxies and
          // in the plugin settings, where every collaborator can read it
          customHeaders: [
            {
              name: 'Authorization',
              value: `Bearer ${process.env.DRAFT_SECRET_TOKEN}`,
            },
          ],
          visualEditing: {
            // Opened by a browser, where we cannot set headers
            enableDraftModeUrl: new URL(
              `/api/draft/enable?token=${process.env.DRAFT_SECRET_TOKEN}`,
              baseUrl,
            ).toString(),
            initialPath: '/',
          },
        },
      ],
      startOpen: true,
    },
  });
}

// The SEO/Readability Analysis plugin is not installed automatically. To enable it, point its
// htmlGeneratorUrl at /api/seoAnalysis and send `Authorization: Bearer ${SEO_SECRET_TOKEN}`.

async function createCacheInvalidationWebhook(client: Client, baseUrl: string) {
  await client.webhooks.create({
    name: '🔄 Cache Revalidation',
    url: new URL('/api/revalidateCache', baseUrl).toString(),
    custom_payload: null,
    headers: {
      Authorization: `Bearer ${process.env.CACHE_INVALIDATION_SECRET_TOKEN}`,
    },
    events: [
      {
        filters: [],
        entity_type: 'item',
        event_types: ['create', 'update', 'delete', 'publish', 'unpublish'],
      },
      {
        filters: [],
        entity_type: 'item_type',
        event_types: ['create', 'update', 'delete'],
      },
      {
        filters: [],
        entity_type: 'upload',
        event_types: ['update', 'delete'],
      },
    ],
    http_basic_user: null,
    http_basic_password: null,
    enabled: true,
    payload_api_version: '3',
    nested_items_in_payload: false,
  });
}

/**
 * The DatoCMS API token arrives in the request body, so without this check the
 * endpoint would happily write our secret tokens into any project a caller
 * names, and the caller could then read them back from their own project.
 */
async function isSameProject(client: Client, ourApiToken: string) {
  const ourClient = buildClient({ apiToken: ourApiToken });

  const [callerProject, ourProject] = await Promise.all([
    client.site.find(),
    ourClient.site.find(),
  ]);

  return callerProject.id === ourProject.id;
}

export async function POST(request: Request) {
  const body = await request.json();

  const client = buildClient({ apiToken: body.datocmsApiToken });

  const baseUrl = getSiteUrl();

  try {
    if (!(await isSameProject(client, process.env.DATOCMS_CMA_TOKEN!))) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401, headers: corsHeaders },
      );
    }

    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      createCacheInvalidationWebhook(client, baseUrl),
    ]);

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    // Never return the error: the DatoCMS client stores the failed request in
    // it, Authorization header and payload included
    console.error(error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders },
    );
  }
}
