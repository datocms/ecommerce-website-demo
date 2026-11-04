// Slug fields never carry Content Link stega, so the slug goes into the URL as is
export const productPath = (lng: string, slug: string) =>
  `/${lng}/product/${slug}`;
