import { buildClient } from '@datocms/cma-client-node';
import { JSDOM } from 'jsdom';
import type { NextRequest } from 'next/server';

type CMAItem = { id: string; attributes: { slug?: string } };

const findSlugAndPermalink = async (
  item: CMAItem,
  itemTypeApiKey: string,
  locale: string,
) => {
  switch (itemTypeApiKey) {
    case 'home':
      return [item.attributes.slug, `/${locale}/`];
    case 'showcase':
      return [item.attributes.slug, `/${locale}/showcase`];
    case 'store':
      return [item.attributes.slug, `/${locale}/stores`];
    case 'product':
      return [
        item.attributes.slug,
        `/${locale}/product/${item.attributes.slug}`,
      ];
    default:
      return [null, null];
  }
};

const headers = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
};

/** CORS preflight for SEO analysis endpoint. */
export async function OPTIONS(_request: NextRequest) {
  return new Response('ok', {
    status: 200,
    headers,
  });
}

/**
 * Fetch a page preview and return minimal SEO metadata to the DatoCMS UI.
 *
 * Requires `?token=` to match `SEO_SECRET_TOKEN` and additional query string
 * params:
 * - `itemId`, `itemTypeId`, `itemTypeApiKey`, `locale`, `sandboxEnvironmentId`.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const itemId = searchParams.get('itemId');
  const itemTypeId = searchParams.get('itemTypeId');
  const itemTypeApiKey = searchParams.get('itemTypeApiKey');
  const locale = searchParams.get('locale');
  const sandboxEnvironmentId = searchParams.get('sandboxEnvironmentId');
  const token = searchParams.get('token');

  if (token !== process.env.SEO_SECRET_TOKEN)
    return new Response('Invalid token token', { status: 401, headers });

  if (
    !itemId ||
    !itemTypeApiKey ||
    !itemTypeId ||
    !locale ||
    !sandboxEnvironmentId
  ) {
    return new Response('Missing required parameters!', {
      status: 422,
      headers,
    });
  }

  const client = buildClient({
    apiToken: process.env.DATOCMS_READONLY_API_TOKEN || '',
    environment: sandboxEnvironmentId,
  });
  const item = (await client.items.find(itemId)) as unknown as CMAItem;

  const [slug, permalink] = await findSlugAndPermalink(
    item,
    itemTypeApiKey,
    locale,
  );

  if (!permalink) {
    return new Response(
      `Don't know which route corresponds to record #${itemId} (model: ${itemTypeApiKey})!`,
      {
        status: 422,
        headers,
      },
    );
  }

  const baseUrl = (
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.URL
  ) as string;

  const response = await fetch(new URL(permalink, baseUrl).toString());
  if (!response.ok) {
    return new Response(`Failed to fetch page: ${response.status}`, {
      status: 502,
      headers,
    });
  }
  const body = await response.text();

  const { document } = new JSDOM(body).window;
  const contentEl = document.querySelector('body');
  if (!contentEl)
    return new Response('No content found', { status: 422, headers });
  const pageContent = contentEl.innerHTML;
  const pageLocale =
    document.querySelector('html')?.getAttribute('lang') || 'en';
  const pageTitle = document.querySelector('title')?.textContent;
  const pageDescription = document
    .querySelector('meta[name="description"]')
    ?.getAttribute('content');

  return new Response(
    JSON.stringify({
      locale: pageLocale,
      slug,
      permalink,
      title: pageTitle,
      description: pageDescription,
      content: pageContent,
    }),
    { status: 200, headers },
  );
}
