import { graphql } from '@/lib/datocms/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';

export type SiteLocale = ReturnType<typeof graphql.scalar<'SiteLocale'>>;

const localesQuery = graphql(/* GraphQL */ `
  query Locales {
    _site {
      locales
    }
  }
`);

export default async function getAvailableLocales() {
  const { _site } = await queryDatoCMS(localesQuery);
  return _site.locales;
}

export async function getFallbackLocale() {
  const locales = await getAvailableLocales();
  return locales[0]; //using the first ordered locale as fallback
}
