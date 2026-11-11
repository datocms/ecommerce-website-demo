import { stripStega } from '@datocms/content-link';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { readFragment } from '@/lib/datocms/graphql';
import { productPath } from '@/lib/routes';
import { getSiteUrl } from '@/lib/siteUrl';
import type { Product } from './meta';

// schema.org Product for search engines. Text goes through stripStega: in draft mode it carries
// invisible Content Link characters.
export function buildProductJsonLd({
  product,
  lng,
  currencyCode,
}: {
  product: Product;
  lng: string;
  currencyCode: string;
}) {
  const description = product.seo.find(
    (tag) => tag.tag === 'meta' && tag.attributes?.name === 'description',
  )?.attributes?.content;
  const images = product.productImages.flatMap((image) => {
    const src = readFragment(
      ResponsiveImageFragment,
      image.responsiveImage,
    )?.src;
    return src ? [src] : [];
  });
  const price =
    product.onSale && product.salePrice !== null
      ? product.salePrice
      : product.price;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: stripStega(product.name),
    ...(description && { description: stripStega(description) }),
    ...(images.length > 0 && { image: images }),
    brand: { '@type': 'Brand', name: stripStega(product.brand.name) },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: stripStega(currencyCode),
      availability: 'https://schema.org/InStock',
      url: new URL(productPath(lng, product.slug), getSiteUrl()).toString(),
    },
    ...(product.numberOfReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.reviewAverage,
        reviewCount: product.numberOfReviews,
      },
    }),
  };
}
