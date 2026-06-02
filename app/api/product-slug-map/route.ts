import { draftMode } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { getFallbackLocale } from '@/app/i18n/settings';
import type { SiteLocale } from '@/graphql/types/graphql';
import { resolveProductSlug } from '@/utils/productSlugs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');
  const slug = searchParams.get('slug');

  if (!locale || !slug) {
    return NextResponse.json(
      { error: 'Missing locale or slug' },
      { status: 422 },
    );
  }

  const fallbackLocale = await getFallbackLocale();
  const { isEnabled: isDraft } = await draftMode();
  const resolved = await resolveProductSlug({
    slug,
    locale: locale as SiteLocale,
    fallbackLocale,
    isDraft,
  });

  if (!resolved) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ slugs: resolved.slugs });
}
