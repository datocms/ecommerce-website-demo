import { CollectionCardShowcaseFragment } from '@/components/Sections/CollectionCardShowcase/fragments';
import { DividerSectionFragment } from '@/components/Sections/DividerSection/fragments';
import { HeroSectionFragment } from '@/components/Sections/Hero/fragments';
import { MaterialShowcaseFragment } from '@/components/Sections/MaterialShowcase/fragments';
import { ProductRailFragment } from '@/components/Sections/NewArrivals/fragments';
import { TestimonialSectionFragment } from '@/components/Sections/Testimonials/fragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { GlobalPageProps } from '@/lib/globalPageProps';

export type PageProps = GlobalPageProps;

export const query = graphql(
  /* GraphQL */ `
    query Home($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        currencySymbol
        sale
        shopNow
        newArrivals
      }
      # Only for the collection card showcases (see Content.tsx): their title is the header
      # dropdown column that lists their collections, and their link reuses the header's
      # products link label
      layout(locale: $locale, fallbackLocales: $fallbackLocale) {
        menu {
          __typename
          ... on DropdownMenuRecord {
            id
            column {
              id
              label
              item {
                ... on RecordInterface {
                  id
                }
              }
            }
          }
          ... on LinkItemRecord {
            id
            label
            slug
          }
        }
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
