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

// The catalog filtered by a menu record: `brand` → ?brands=<id>, `material` → ?materials=<id>
export const productsHref = (
  lng: string,
  item: { _modelApiKey: string; id: string },
) => `/${lng}/products?${item._modelApiKey}s=${item.id}`;

// A CMS page link. Its slug is a text field (not a slug field), so draft values carry Content
// Link stega characters, which must stay out of the URL
export const linkHref = (lng: string, link: { slug: string | null }) =>
  `/${lng}/${stripStega(link.slug)}`;

export const productSearchHref = (lng: string, query: string) =>
  `/${lng}/products?productName=${encodeURIComponent(query)}`;
