// Called by the SEO/Readability Analysis plugin, which /api/post-install does not install: in its
// settings, set htmlGeneratorUrl to /api/seoAnalysis and send "Authorization: Bearer <SEO_SECRET_TOKEN>"

import { buildClient } from '@datocms/cma-client-node';
import { parseHTML } from 'linkedom';
import type { NextRequest } from 'next/server';
import { localizedString } from '@/lib/datocms/localizedString';
import { recordToWebsiteRoute } from '@/lib/datocms/recordToWebsiteRoute';
import { hasBearerToken } from '@/lib/hasBearerToken';
import { requireEnv } from '@/lib/requireEnv';
import { getSiteUrl } from '@/lib/siteUrl';

// Models whose pages get SEO/readability analysis
const SEO_ANALYZED_MODELS = ['home', 'showcase', 'store', 'product'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Authorization',
};

const textResponse = (message: string, status: number) =>
  new Response(message, { status, headers: corsHeaders });

export async function OPTIONS() {
  return textResponse('ok', 200);
}

export async function GET(request: NextRequest) {
  if (!hasBearerToken(request, process.env.SEO_SECRET_TOKEN)) {
    return textResponse('Invalid token', 401);
  }

  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId');
  const itemTypeApiKey = searchParams.get('itemTypeApiKey');
  const locale = searchParams.get('locale');
  const sandboxEnvironmentId = searchParams.get('sandboxEnvironmentId');

  if (!itemId || !itemTypeApiKey || !locale || !sandboxEnvironmentId) {
    return textResponse('Missing required parameters!', 422);
  }

  try {
    const client = buildClient({
      apiToken: requireEnv('DATOCMS_CMA_TOKEN'),
      environment: sandboxEnvironmentId,
    });
    const item = await client.items.find(itemId);

    const permalink = SEO_ANALYZED_MODELS.includes(itemTypeApiKey)
      ? recordToWebsiteRoute(item, itemTypeApiKey, locale)
      : null;

    if (!permalink) {
      return textResponse(
        `Don't know which route corresponds to record #${itemId} (model: ${itemTypeApiKey})!`,
        422,
      );
    }

    const page = await fetch(new URL(permalink, getSiteUrl()));
    if (!page.ok) return textResponse('Page not reachable', 422);

    const { document } = parseHTML(await page.text());
    const body = document.querySelector('body');
    if (!body) return textResponse('No content found', 422);

    return Response.json(
      {
        // The server HTML has no <html lang>, so echo the requested locale
        locale,
        // Home and Showcase have no slug field: the last segment of their route stands in
        slug: localizedString(item.slug, locale) ?? permalink.split('/').pop(),
        permalink,
        title: document.querySelector('title')?.textContent,
        description: document
          .querySelector('meta[name="description"]')
          ?.getAttribute('content'),
        content: body.innerHTML,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    // Never return the error: the DatoCMS client stores the failed request in
    // it, Authorization header and payload included
    console.error(error);

    return textResponse('Internal server error', 500);
  }
}
