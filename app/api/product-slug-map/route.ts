// Called by the LanguageSelector to link to the same product in another locale (product slugs
// are localized)

import { draftMode } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { fallbackLocaleOf, getAvailableLocales } from '@/lib/i18n';
import { resolveProductSlug } from '@/lib/productSlugs';

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

  const locales = await getAvailableLocales();
  // Narrows the raw param to a SiteLocale
  const siteLocale = locales.find((available) => available === locale);

  if (!siteLocale) {
    return NextResponse.json({ error: 'Unsupported locale' }, { status: 422 });
  }

  const { isEnabled: isDraft } = await draftMode();
  const resolved = await resolveProductSlug({
    slug,
    locale: siteLocale,
    fallbackLocale: fallbackLocaleOf(locales),
    isDraft,
  });

  if (!resolved) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ slugs: resolved.slugs });
}
