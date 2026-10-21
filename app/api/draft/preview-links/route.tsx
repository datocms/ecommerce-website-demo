// Called by the Web Previews plugin (installed by /api/post-install) to list preview links for a record

import type { NextRequest } from 'next/server';
import { localizedString } from '@/lib/datocms/localizedString';
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

const generatePreviewUrl = ({
  item,
  itemType,
  locale,
}: PreviewLinksRequest) => {
  // Every record-backed route; /api/seoAnalysis maps the subset that gets SEO analysis
  switch (itemType.attributes.api_key) {
    case 'home':
      return `/${locale}/home`;
    case 'showcase':
      return `/${locale}/showcase`;
    case 'store':
      return `/${locale}/stores`;
    case 'product': {
      const slug = localizedString(item.attributes.slug, locale);
      return slug ? `/${locale}/product/${slug}` : undefined;
    }
    case 'legal_page': {
      const slug = localizedString(item.attributes.slug, locale);
      return slug ? `/${locale}/legal/${slug}` : undefined;
    }
    case 'brand':
      return `/${locale}/products?brands=${item.id}`;
    case 'material':
      return `/${locale}/products?materials=${item.id}`;
    case 'collection':
      return `/${locale}/products?collections=${item.id}`;
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new Response('ok', {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  // The token is sent by the plugin as a request header (see /api/post-install)
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');

  if (!token || token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  const body: PreviewLinksRequest = await request.json();
  const path = generatePreviewUrl(body);

  if (!path) {
    return new Response(JSON.stringify({ previewLinks: [] }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  const baseUrl = getSiteUrl();

  const previewLinks = [];

  // Records with unpublished changes ('updated') get both links
  if (body.item.meta.status !== 'published') {
    previewLinks.push({
      label: 'Draft version',
      // Opened by a browser, where we cannot set headers
      url: `${baseUrl}/api/draft/enable?token=${token}&redirect=${path}`,
    });
  }

  if (body.item.meta.status !== 'draft') {
    previewLinks.push({
      label: 'Published version',
      url: `${baseUrl}/api/draft/disable?redirect=${path}`,
    });
  }

  return new Response(JSON.stringify({ previewLinks }), {
    status: 200,
    headers: corsHeaders,
  });
}
