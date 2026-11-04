// Called by the SEO/Readability Analysis plugin, which /api/post-install does not install: in its
// settings, set htmlGeneratorUrl to /api/seoAnalysis and send "Authorization: Bearer <SEO_SECRET_TOKEN>"

import { buildClient } from '@datocms/cma-client-node';
import { parseHTML } from 'linkedom';
import type { NextRequest } from 'next/server';
import { localizedString } from '@/lib/datocms/localizedString';
import { recordToWebsiteRoute } from '@/lib/datocms/recordToWebsiteRoute';
import { getSiteUrl } from '@/lib/siteUrl';

// Models whose pages get SEO/readability analysis
const SEO_ANALYZED_MODELS = ['home', 'showcase', 'store', 'product'];

const responseHeaders = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
};

export async function OPTIONS() {
  return new Response('ok', {
    status: 200,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const itemId = searchParams.get('itemId');
  const itemTypeId = searchParams.get('itemTypeId');
  const itemTypeApiKey = searchParams.get('itemTypeApiKey');
  const locale = searchParams.get('locale');
  const sandboxEnvironmentId = searchParams.get('sandboxEnvironmentId');

  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');

  if (!token || token !== process.env.SEO_SECRET_TOKEN) {
    return new Response('Invalid token', {
      status: 401,
      headers: responseHeaders,
    });
  }

  if (
    !itemId ||
    !itemTypeApiKey ||
    !itemTypeId ||
    !locale ||
    !sandboxEnvironmentId
  ) {
    return new Response('Missing required parameters!', {
      status: 422,
      headers: responseHeaders,
    });
  }

  try {
    const client = buildClient({
      apiToken: process.env.DATOCMS_CMA_TOKEN || '',
      environment: sandboxEnvironmentId,
    });
    const item = await client.items.find(itemId);

    const permalink = SEO_ANALYZED_MODELS.includes(itemTypeApiKey)
      ? recordToWebsiteRoute(item, itemTypeApiKey, locale)
      : null;

    if (!permalink) {
      return new Response(
        `Don't know which route corresponds to record #${itemId} (model: ${itemTypeApiKey})!`,
        {
          status: 422,
          headers: responseHeaders,
        },
      );
    }

    const slug = localizedString(item.slug, locale);
    const baseUrl = getSiteUrl();

    const response = await fetch(new URL(permalink, baseUrl).toString());
    const body = await response.text();

    const { document } = parseHTML(body);

    const contentEl = document.querySelector('body');
    if (!contentEl) {
      return new Response('No content found', {
        status: 422,
        headers: responseHeaders,
      });
    }
    const pageContent = contentEl.innerHTML;
    const pageTitle = document.querySelector('title')?.textContent;
    const pageDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content');

    return new Response(
      JSON.stringify({
        // The server HTML has no <html lang>, so echo the requested locale
        locale,
        slug,
        permalink,
        title: pageTitle,
        description: pageDescription,
        content: pageContent,
      }),
      { status: 200, headers: responseHeaders },
    );
  } catch (error) {
    // Never return the error: the DatoCMS client stores the failed request in
    // it, Authorization header and payload included
    console.error(error);

    return new Response('Internal server error', {
      status: 500,
      headers: responseHeaders,
    });
  }
}
