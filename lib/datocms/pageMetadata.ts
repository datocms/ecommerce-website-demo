import { stripStega } from '@datocms/content-link/stega';
import type { Metadata } from 'next';
import { type FragmentOf, graphql, readFragment } from '@/lib/datocms/graphql';

// The site's title suffix and the fallback description and share image, for pages that have no
// SEO tags of their own. It is a fragment on Query, so any query can spread it.
export const GlobalSeoFragment = graphql(/* GraphQL */ `
  fragment GlobalSeoFragment on Query {
    _site {
      globalSeo {
        titleSuffix
        fallbackSeo {
          description
          image {
            url
          }
        }
      }
    }
  }
`);

/**
 * Title (plus the site's suffix), description and share-image tags; the description and image
 * default to the global fallback ones.
 */
export function buildPageMetadata(
  data: FragmentOf<typeof GlobalSeoFragment>,
  page: {
    title: string;
    description?: string | null;
    imageUrl?: string | null;
  },
): Metadata {
  const globalSeo = readFragment(GlobalSeoFragment, data)._site.globalSeo;
  const title = `${stripStega(page.title)}${stripStega(globalSeo?.titleSuffix ?? '')}`;
  const text = page.description ?? globalSeo?.fallbackSeo?.description;
  const description = text ? stripStega(text) : undefined;
  const image = page.imageUrl ?? globalSeo?.fallbackSeo?.image?.url;
  const images = image ? [image] : undefined;

  return {
    title,
    description,
    openGraph: { type: 'website', title, description, images },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images,
    },
  };
}
