import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';

export type PageProps = {
  params: Promise<{
    lng: string;
    slug: string;
  }>;
};

export const query = graphql(/* GraphQL */ `
  query LegalPage(
    $slug: String
    $locale: SiteLocale
    $fallbackLocale: [SiteLocale!]
  ) {
    legalPage(
      filter: { slug: { eq: $slug } }
      locale: $locale
      fallbackLocales: $fallbackLocale
    ) {
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
      content {
        value
      }
    }
  }
`);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
