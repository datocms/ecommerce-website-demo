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

export async function getFallbackLocale() {
  const locales = await getAvailableLocales();
  // The first locale in the project settings is the fallback
  return locales[0];
}
