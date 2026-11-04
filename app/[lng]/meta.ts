import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
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
        footerSubtitle {
          value
        }
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
            slug
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
        mainColor {
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
            slug
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
                details {
                  image {
                    responsiveImage {
                      ...ResponsiveImageFragment
                    }
                  }
                }
              }
              ... on CollectionRecord {
                id
                name
                _modelApiKey
                details {
                  image {
                    responsiveImage {
                      ...ResponsiveImageFragment
                    }
                  }
                }
              }
              ... on BrandRecord {
                id
                name
                _modelApiKey
                details {
                  image {
                    responsiveImage {
                      ...ResponsiveImageFragment
                    }
                  }
                }
              }
            }
            newArrival {
              ... on MaterialRecord {
                id
                name
                _modelApiKey
                details {
                  image {
                    responsiveImage {
                      ...ResponsiveImageFragment
                    }
                  }
                }
              }
              ... on CollectionRecord {
                id
                name
                _modelApiKey
                details {
                  image {
                    responsiveImage {
                      ...ResponsiveImageFragment
                    }
                  }
                }
              }
              ... on BrandRecord {
                id
                name
                _modelApiKey
                details {
                  image {
                    responsiveImage {
                      ...ResponsiveImageFragment
                    }
                  }
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
  [ResponsiveImageFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
