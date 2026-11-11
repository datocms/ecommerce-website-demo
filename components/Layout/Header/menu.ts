import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import { productsPath } from '@/lib/routes';

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
) => productsPath(lng, { [`${item._modelApiKey}s`]: item.id });

export const productSearchHref = (lng: string, query: string) =>
  productsPath(lng, { productName: query });

const isLink = (item: MenuItem): item is LinkItem =>
  item.__typename === 'LinkItemRecord';
const isDropdown = (item: MenuItem): item is DropdownMenu =>
  item.__typename === 'DropdownMenuRecord';

export function splitMenu(menu: MenuItem[]) {
  const links = menu.filter(isLink);
  const categories = menu.filter(isDropdown);
  const [firstLink, ...rightLinks] = links;
  // Dropdowns and the first link sit left of the logo, the other links right
  const leftItems = menu.filter(
    (item) => isDropdown(item) || item === firstLink,
  );

  return { links, categories, leftItems, rightLinks };
}
