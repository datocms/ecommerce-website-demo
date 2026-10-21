import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const HeroSectionFragment = graphql(
  /* GraphQL */ `
    fragment HeroSectionFragment on HeroSectionRecord {
      id
      heroSubtitle
      heroTitle
      heroImage {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
      additionalImage {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
      socialLabel
      socials {
        id
        name
        url
        icon {
          url
        }
      }
      featuredCollections {
        id
        name
      }
    }
  `,
  [ResponsiveImageFragment],
);
