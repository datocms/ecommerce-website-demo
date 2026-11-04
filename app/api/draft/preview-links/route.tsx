// Called by the Web Previews plugin (installed by /api/post-install) to list preview links for a record

import type { NextRequest } from 'next/server';
import { recordToWebsiteRoute } from '@/lib/datocms/recordToWebsiteRoute';
import type { SiteLocale } from '@/lib/i18n';
import { getSiteUrl } from '@/lib/siteUrl';

type PreviewLinksRequest = {
  item: {
    id: string;
    attributes: { slug?: unknown };
    meta: { status: 'draft' | 'updated' | 'published' };
  };
  itemType: { attributes: { api_key: string } };
  locale: SiteLocale;
};

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new Response('ok', {
    status: 200,
    headers: responseHeaders,
  });
}

export async function POST(request: NextRequest) {
  // The token is sent by the plugin as a request header (see /api/post-install)
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');

  if (!token || token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  const { item, itemType, locale }: PreviewLinksRequest = await request.json();
  const path = recordToWebsiteRoute(
    { id: item.id, slug: item.attributes.slug },
    itemType.attributes.api_key,
    locale,
  );

  if (!path) {
    return new Response(JSON.stringify({ previewLinks: [] }), {
      status: 200,
      headers: responseHeaders,
    });
  }

  const baseUrl = getSiteUrl();

  const previewLinks = [];

  // Records with unpublished changes ('updated') get both links
  if (item.meta.status !== 'published') {
    previewLinks.push({
      label: 'Draft version',
      // Opened by a browser, where we cannot set headers
      url: `${baseUrl}/api/draft/enable?token=${token}&redirect=${path}`,
    });
  }

  if (item.meta.status !== 'draft') {
    previewLinks.push({
      label: 'Published version',
      url: `${baseUrl}/api/draft/disable?redirect=${path}`,
    });
  }

  return new Response(JSON.stringify({ previewLinks }), {
    status: 200,
    headers: responseHeaders,
  });
}
