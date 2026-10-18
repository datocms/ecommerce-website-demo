import { DividerSectionFragment } from '@/components/Sections/DividerSection/fragments';
import { HeroSectionFragment } from '@/components/Sections/Hero/fragments';
import { MaterialShowcaseFragment } from '@/components/Sections/MaterialShowcase/fragments';
import { ProductRailFragment } from '@/components/Sections/ProductRail/fragments';
import { CollectionCardShowcaseFragment } from '@/components/Sections/ProductShowcase/fragments';
import { TestimonialSectionFragment } from '@/components/Sections/Testimonials/fragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps;

export const query = graphql(
  /* GraphQL */ `
    query Home($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        currencySymbol
        sale
        shopNow
      }
      allProducts(
        first: 8
        orderBy: _createdAt_DESC
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        ...ProductRailFragment
      }
      home(locale: $locale, fallbackLocales: $fallbackLocale) {
        seo: _seoMetaTags {
          attributes
          content
          tag
        }
        sections {
          ... on RecordInterface {
            id
            __typename
          }
          ...HeroSectionFragment
          ...DividerSectionFragment
          ...TestimonialSectionFragment
          ...CollectionCardShowcaseFragment
          ...MaterialShowcaseFragment
        }
      }
    }
  `,
  [
    HeroSectionFragment,
    DividerSectionFragment,
    TestimonialSectionFragment,
    CollectionCardShowcaseFragment,
    MaterialShowcaseFragment,
    ProductRailFragment,
  ],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
