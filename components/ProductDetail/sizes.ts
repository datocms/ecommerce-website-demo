import type { Product } from '@/app/[lng]/product/[slug]/meta';

export type Variation = Product['productVariations'][number];

export const SIZE_ORDER = ['xs', 's', 'm', 'l', 'xl'];

// availableSizes is a JSON field (checkbox editor) holding size codes; narrow it to string[]
export const sizesOf = (variation?: Variation) =>
  (variation?.availableSizes as string[] | null | undefined) ?? [];

export const firstAvailableSize = (variation?: Variation) => {
  const available = sizesOf(variation);
  return SIZE_ORDER.find((size) => available.includes(size)) ?? available[0];
};
