// Called by the Web Previews plugin (installed by /api/post-install) to list preview links for a record

import type { NextRequest } from 'next/server';
import { recordToWebsiteRoute } from '@/lib/datocms/recordToWebsiteRoute';
import { hasBearerToken } from '@/lib/hasBearerToken';
import { getSiteUrl } from '@/lib/siteUrl';

type PreviewLinksRequest = {
  item: {
    id: string;
    attributes: { slug?: unknown };
    meta: { status: 'draft' | 'updated' | 'published' };
  };
  itemType: { attributes: { api_key: string } };
  locale: string;
};

type PreviewLink = { label: string; url: string };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response('ok', { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  // The plugin sends the token as a request header (see /api/post-install)
  const draftToken = process.env.DRAFT_SECRET_TOKEN;

  if (!hasBearerToken(request, draftToken))
    return new Response('Invalid token', { status: 401, headers: corsHeaders });

  const { item, itemType, locale }: PreviewLinksRequest = await request.json();
  const path = recordToWebsiteRoute(
    { id: item.id, slug: item.attributes.slug },
    itemType.attributes.api_key,
    locale,
  );

  const previewLinks: PreviewLink[] = [];
  const baseUrl = getSiteUrl();

  // Records with unpublished changes ('updated') get both links
  if (path && item.meta.status !== 'published') {
    previewLinks.push({
      label: 'Draft version',
      // Opened by a browser, where we cannot set headers
      url: `${baseUrl}/api/draft/enable?token=${draftToken}&redirect=${path}`,
    });
  }

  if (path && item.meta.status !== 'draft') {
    previewLinks.push({
      label: 'Published version',
      url: `${baseUrl}/api/draft/disable?redirect=${path}`,
    });
  }

  return Response.json({ previewLinks }, { headers: corsHeaders });
}
