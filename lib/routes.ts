// The site's page URLs. Slugs and record ids go in as they are: neither carries Content Link stega.

export const homePath = (lng: string) => `/${lng}/home`;

export const showcasePath = (lng: string) => `/${lng}/showcase`;

export const storesPath = (lng: string) => `/${lng}/stores`;

export const legalPagePath = (lng: string, slug: string) =>
  `/${lng}/legal/${slug}`;

export const productPath = (lng: string, slug: string) =>
  `/${lng}/product/${slug}`;

/** The catalog, optionally narrowed: `productsPath('en', { brands: brand.id })`. */
export function productsPath(lng: string, query?: Record<string, string>) {
  const search = new URLSearchParams(query).toString();
  return search ? `/${lng}/products?${search}` : `/${lng}/products`;
}
