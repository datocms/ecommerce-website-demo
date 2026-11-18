// Called once by the "Deploy with DatoCMS" flow (postInstallUrl in datocms.json) to install the
// Web Previews plugin and the cache-revalidation webhook. Safe to delete after setup.

import { buildClient, type Client } from '@datocms/cma-client-node';
import { NextResponse } from 'next/server';
import { requireEnv } from '@/lib/requireEnv';
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
  const plugin = await client.plugins.create({
    package_name: 'datocms-plugin-web-previews',
  });

  await client.plugins.update(plugin, {
    parameters: {
      frontends: [
        {
          name: 'Production',
          previewWebhook: new URL(
            '/api/draft/preview-links',
            baseUrl,
          ).toString(),
          // A header keeps the token out of request URLs, which end up in logs and proxies
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

async function createCacheRevalidationWebhook(client: Client, baseUrl: string) {
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

// The API token comes from the request body: without this check a caller could have our secret
// tokens written into their own project
async function isSameProject(callerClient: Client, ourApiToken: string) {
  const ourClient = buildClient({ apiToken: ourApiToken });

  const [callerProject, ourProject] = await Promise.all([
    callerClient.site.find(),
    ourClient.site.find(),
  ]);

  return callerProject.id === ourProject.id;
}

export async function POST(request: Request) {
  const { datocmsApiToken }: { datocmsApiToken?: string } =
    await request.json();

  if (!datocmsApiToken) {
    return NextResponse.json(
      { success: false, error: 'Missing datocmsApiToken' },
      { status: 422, headers: corsHeaders },
    );
  }

  try {
    const client = buildClient({ apiToken: datocmsApiToken });
    const baseUrl = getSiteUrl();

    if (!(await isSameProject(client, requireEnv('DATOCMS_CMA_TOKEN')))) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401, headers: corsHeaders },
      );
    }

    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      createCacheRevalidationWebhook(client, baseUrl),
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
