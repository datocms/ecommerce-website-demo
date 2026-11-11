import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import { LinkRecordFragment } from '@/lib/datocms/linkHref';
import type { GlobalPageProps } from '@/lib/globalPageProps';

// children (the current page) travels in pageProps, so RealTime renders it in draft mode too
export type PageProps = GlobalPageProps & {
  children: React.ReactNode;
};

export const query = graphql(
  /* GraphQL */ `
    query Layout($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      _site {
        faviconMetaTags {
          attributes
          content
          tag
        }
        globalSeo {
          fallbackSeo {
            title
            description
          }
        }
        locales
      }
      layout(locale: $locale, fallbackLocales: $fallbackLocale) {
        copyrightText
        socialMediaLinks {
          id
          name
          url
          icon {
            url
          }
        }
        footerSubtitle
        footerTitle
        footerLogo {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        footerColumns {
          id
          label
          footerItem {
            id
            label
            page
            record {
              ...LinkRecordFragment
            }
          }
        }
        cookieNotice {
          primaryButtonLabel
          secondaryButtonLabel
          subheader {
            value
          }
          header
          cookieNoticeImage {
            responsiveImage {
              ...ResponsiveImageFragment
            }
          }
        }
        accentColor {
          red
          blue
          green
        }
        popup {
          title
          underText
          subtitle
          preTitle
          dismissButtonLabel
          button {
            label
            page
            record {
              ...LinkRecordFragment
            }
          }
          popupImage {
            responsiveImage {
              ...ResponsiveImageFragment
            }
          }
        }
        logo {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        notification {
          value
          # The records its itemLink nodes point to
          links {
            ... on RecordInterface {
              id
              __typename
            }
            ...LinkRecordFragment
          }
        }
        menu {
          __typename
          ... on DropdownMenuRecord {
            id
            label
            column {
              label
              id
              item {
                ... on ProductRecord {
                  _modelApiKey
                  id
                  name
                }
                ... on MaterialRecord {
                  id
                  _modelApiKey
                  name
                }
                ... on CollectionRecord {
                  id
                  _modelApiKey
                  name
                }
                ... on BrandRecord {
                  id
                  _modelApiKey
                  name
                }
              }
            }
            trending {
              ... on MaterialRecord {
                id
                name
                _modelApiKey
                image {
                  responsiveImage {
                    ...ResponsiveImageFragment
                  }
                }
              }
              ... on CollectionRecord {
                id
                name
                _modelApiKey
                image {
                  responsiveImage {
                    ...ResponsiveImageFragment
                  }
                }
              }
              ... on BrandRecord {
                id
                name
                _modelApiKey
                image {
                  responsiveImage {
                    ...ResponsiveImageFragment
                  }
                }
              }
            }
            newArrival {
              ... on MaterialRecord {
                id
                name
                _modelApiKey
                image {
                  responsiveImage {
                    ...ResponsiveImageFragment
                  }
                }
              }
              ... on CollectionRecord {
                id
                name
                _modelApiKey
                image {
                  responsiveImage {
                    ...ResponsiveImageFragment
                  }
                }
              }
              ... on BrandRecord {
                id
                name
                _modelApiKey
                image {
                  responsiveImage {
                    ...ResponsiveImageFragment
                  }
                }
              }
            }
          }

          ... on LinkItemRecord {
            id
            label
            page
            record {
              ...LinkRecordFragment
            }
          }
        }
      }
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        currencySymbol
        # Every locale's symbol, for the language selector's list
        _allCurrencySymbolLocales {
          locale
          value
        }
        trending
        new
        shopNow
        searchPlaceholder
        newsletter
        subscribeToOurNewsletter
        newsletterButton
        emailPlaceholder
        displayNewsletterFooter
      }
    }
  `,
  [ResponsiveImageFragment, LinkRecordFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
