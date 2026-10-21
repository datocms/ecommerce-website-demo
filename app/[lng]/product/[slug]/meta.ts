import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  ProductInfoSectionFragment,
  ProductMaterialFragment,
} from '@/components/ProductDetail/Blocks/ProductInfoSection/fragments';
import { QuestionSectionFragment } from '@/components/ProductDetail/Blocks/QuestionsSection/fragments';
import { ProductPageLabelsFragment } from '@/components/ProductDetail/fragments';
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

export const query = graphql(
  /* GraphQL */ `
    query Product(
      $slug: String
      $locale: SiteLocale
      $fallbackLocale: [SiteLocale!]
    ) {
      product(
        filter: { slug: { eq: $slug } }
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        seo: _seoMetaTags {
          attributes
          content
          tag
        }
        name
        price
        sale
        salePrice
        slug
        _allSlugLocales {
          locale
          value
        }
        reviewAverage
        numberOfReviews
        featuredReviews {
          id
          reviewerName
          reviewDate
          reviewScore
          review
        }
        material {
          ...ProductMaterialFragment
        }
        description {
          value
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ...ProductInfoSectionFragment
            ...QuestionSectionFragment
          }
        }
        id
        productImages {
          id
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        brand {
          name
          id
        }
        productVariations {
          id
          color {
            hex
          }
          availableSizes
        }
        relatedProducts {
          id
          name
          price
          sale
          salePrice
          slug
          brand {
            name
          }
          productImages {
            id
            responsiveImage {
              ...ResponsiveImageFragment
            }
          }
        }
      }
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        ...ProductPageLabelsFragment
      }
    }
  `,
  [
    ProductMaterialFragment,
    ProductInfoSectionFragment,
    QuestionSectionFragment,
    ResponsiveImageFragment,
    ProductPageLabelsFragment,
  ],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
