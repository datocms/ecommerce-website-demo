import type { SiteLocale } from '@/lib/i18n';

export function buildLocaleVariables({
  params,
  fallbackLocale,
}: {
  params: { lng: string };
  fallbackLocale: SiteLocale;
}) {
  return {
    locale: params.lng as SiteLocale,
    fallbackLocale: [fallbackLocale],
  };
}
