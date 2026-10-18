import type { SiteLocale } from '@/app/i18n/settings';
import { graphql } from '@/lib/datocms/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';

const productSlugLookupQuery = graphql(/* GraphQL */ `
  query ProductSlugLookup {
    allProducts(first: 100) {
      id
      slug
      _allSlugLocales {
        locale
        value
      }
    }
  }
`);

type SlugLocaleEntry = {
  locale?: SiteLocale | null;
  value?: string | null;
};

export type ProductSlugMap = Partial<Record<SiteLocale, string>>;

export function buildProductSlugMap(
  entries: readonly SlugLocaleEntry[] | null | undefined,
  currentLocale?: SiteLocale,
  currentSlug?: string | null,
): ProductSlugMap {
  const slugs: ProductSlugMap = {};

  for (const entry of entries || []) {
    if (entry.locale && entry.value) {
      slugs[entry.locale] = entry.value;
    }
  }

  if (currentLocale && currentSlug) {
    slugs[currentLocale] = currentSlug;
  }

  return slugs;
}

export function slugForLocale(
  slugs: ProductSlugMap,
  locale: SiteLocale,
  fallbackLocale?: SiteLocale,
) {
  return (
    slugs[locale] ||
    (fallbackLocale ? slugs[fallbackLocale] : undefined) ||
    Object.values(slugs).find((slug) => slug)
  );
}

export async function resolveProductSlug({
  slug,
  locale,
  fallbackLocale,
  isDraft,
}: {
  slug: string;
  locale: SiteLocale;
  fallbackLocale: SiteLocale;
  isDraft: boolean;
}) {
  const data = await queryDatoCMS(productSlugLookupQuery, undefined, isDraft);
  const slugIndex = new Map<
    string,
    {
      productId: string;
      slugs: ProductSlugMap;
      matchedLocale: SiteLocale;
    }
  >();

  for (const product of data.allProducts) {
    const slugs = buildProductSlugMap(
      product._allSlugLocales,
      fallbackLocale,
      product.slug,
    );

    for (const [matchedLocale, productSlug] of Object.entries(slugs)) {
      if (productSlug && !slugIndex.has(productSlug)) {
        slugIndex.set(productSlug, {
          productId: product.id,
          slugs,
          matchedLocale: matchedLocale as SiteLocale,
        });
      }
    }
  }

  const matchedProduct = slugIndex.get(slug);

  if (!matchedProduct) {
    return null;
  }

  const localizedSlug = slugForLocale(
    matchedProduct.slugs,
    locale,
    fallbackLocale,
  );

  if (!localizedSlug) {
    return null;
  }

  return {
    productId: matchedProduct.productId,
    slugs: matchedProduct.slugs,
    localizedSlug,
    matchedLocale: matchedProduct.matchedLocale,
  };
}
