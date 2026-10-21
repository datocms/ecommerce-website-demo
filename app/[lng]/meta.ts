import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { GlobalPageProps } from '@/lib/globalPageProps';

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
        favicon {
          url
        }
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
            slug
          }
        }
        cookieNotice {
          primaryButtonLabel
          secondaryButtonLabel
          subheader
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
          url
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
            _modelApiKey
            column {
              label
              id
              item {
                ... on ProductRecord {
                  slug
                  _modelApiKey
                  id
                  name
                }
                ... on MaterialRecord {
                  slug
                  id
                  _modelApiKey
                  name
                }
                ... on CollectionRecord {
                  slug
                  id
                  _modelApiKey
                  name
                }
                ... on BrandRecord {
                  slug
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
                slug
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
                slug
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
                slug
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
                slug
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
                slug
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
                slug
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
            _modelApiKey
          }
        }
      }
      _site {
        locales
      }
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        currencySymbol
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
