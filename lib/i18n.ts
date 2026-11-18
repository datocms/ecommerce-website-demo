import { graphql } from '@/lib/datocms/graphql';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';

export type SiteLocale = ReturnType<typeof graphql.scalar<'SiteLocale'>>;

const localesQuery = graphql(/* GraphQL */ `
  query Locales {
    _site {
      locales
    }
  }
`);

export async function getAvailableLocales() {
  const { _site } = await queryDatoCMS(localesQuery);
  return _site.locales;
}

// The first locale in the project settings is the fallback
export const fallbackLocaleOf = (locales: SiteLocale[]) => locales[0];

export async function getFallbackLocale() {
  return fallbackLocaleOf(await getAvailableLocales());
}

/** SiteLocale values use '_' (pt_BR) where language tags use '-' (pt-BR). */
export const toLanguageTag = (locale: string) => locale.replaceAll('_', '-');
