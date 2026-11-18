import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  ProductInfoSectionFragment,
  ProductMaterialFragment,
} from '@/components/ProductDetail/Blocks/ProductInfoSection/fragments';
import { QuestionsSectionFragment } from '@/components/ProductDetail/Blocks/QuestionsSection/fragments';
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
        onSale
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
          review {
            value
          }
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
            ...QuestionsSectionFragment
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
          onSale
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
        currencyCode
      }
    }
  `,
  [
    ProductMaterialFragment,
    ProductInfoSectionFragment,
    QuestionsSectionFragment,
    ResponsiveImageFragment,
    ProductPageLabelsFragment,
  ],
);

export type Query = ResultOf<typeof query>;
export type Product = NonNullable<Query['product']>;
export type Variables = VariablesOf<typeof query>;
