import type { Query as LayoutQuery } from '@/app/[lng]/meta';

type MenuItem = NonNullable<LayoutQuery['layout']>['menu'][number];
export type LinkItem = Extract<MenuItem, { __typename: 'LinkItemRecord' }>;
export type DropdownMenu = Extract<
  MenuItem,
  { __typename: 'DropdownMenuRecord' }
>;
export type FeaturedItem =
  | DropdownMenu['newArrival']
  | DropdownMenu['trending'];

// The catalog filtered by a menu record: `brand` → ?brands=<id>, `material` → ?materials=<id>
export const productsHref = (
  lng: string,
  item: { _modelApiKey: string; id: string },
) => `/${lng}/products?${item._modelApiKey}s=${item.id}`;

export const productSearchHref = (lng: string, query: string) =>
  `/${lng}/products?productName=${encodeURIComponent(query)}`;
