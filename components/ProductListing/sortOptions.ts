import { readFragment } from '@/lib/datocms/graphql';
import {
  type ProductListingLabels,
  ProductListingLabelsFragment,
} from './fragments';

export function getSortOptions(labels: ProductListingLabels) {
  const { newArrivals, mostPopular, topRated, price, sales } =
    readFragment(ProductListingLabelsFragment, labels) ?? {};

  return [
    { label: newArrivals, value: '_publishedAt_DESC' },
    { label: mostPopular, value: 'numberOfReviews_DESC' },
    { label: topRated, value: 'reviewAverage_DESC' },
    { label: price, value: 'price_DESC' },
    { label: sales, value: 'onSale_DESC' },
  ];
}
