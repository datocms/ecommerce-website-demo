import { stripStega } from '@datocms/content-link';
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

// The catalog filtered by a menu record: `brand` → ?brands=<id>,
// `material` → ?materials=<id>…
export const productsHref = (
  lng: string,
  item: { _modelApiKey: string; id: string },
) => `/${lng}/products?${item._modelApiKey}s=${item.id}`;

export const linkHref = (lng: string, link: LinkItem) =>
  `/${lng}/${stripStega(link.slug)}`;

// The catalog searched by product name (the search sheet's and the mobile menu's field)
export const productSearchHref = (
  lng: string,
  query: FormDataEntryValue | null,
) => `/${lng}/products?productName=${encodeURIComponent(String(query ?? ''))}`;
