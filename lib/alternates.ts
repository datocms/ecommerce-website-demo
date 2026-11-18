import type { Metadata } from 'next';
import { fallbackLocaleOf, type SiteLocale, toLanguageTag } from '@/lib/i18n';

/**
 * Canonical and hreflang links for a page: `pathFor` gives the page's path in a locale, and
 * x-default points at the fallback locale's.
 */
export function buildAlternates({
  locale,
  locales,
  pathFor,
}: {
  locale: string;
  locales: SiteLocale[];
  pathFor: (locale: SiteLocale) => string;
}): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {};
  for (const available of locales) {
    languages[toLanguageTag(available)] = pathFor(available);
  }
  languages['x-default'] = pathFor(fallbackLocaleOf(locales));

  return {
    canonical: pathFor(
      locales.find((available) => available === locale) ??
        fallbackLocaleOf(locales),
    ),
    languages,
  };
}
