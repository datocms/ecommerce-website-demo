// Cross-locale product slugs: the product page redirects a slug from another locale to its own,
// and /api/product-slug-map gives the language selector each locale's slug.

import { graphql } from '@/lib/datocms/graphql';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import type { SiteLocale } from './i18n';

const productSlugLookupQuery = graphql(/* GraphQL */ `
  query ProductSlugLookup {
    allProducts(first: 100) {
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

type ProductSlugMap = Partial<Record<SiteLocale, string>>;

/** Collects a product's slug per locale from its _allSlugLocales entries. */
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

  // product.slug has fallbacks applied, so it fills a locale that has no slug of its own
  if (currentLocale && currentSlug) {
    slugs[currentLocale] = currentSlug;
  }

  return slugs;
}

/** The slug for `locale`, else the fallback locale's, else any slug the product has. */
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

/** Finds the product with `slug` in any locale; returns its slugs and the one for `locale`. */
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

  // The first product with a matching slug wins
  for (const product of data.allProducts) {
    const slugs = buildProductSlugMap(
      product._allSlugLocales,
      fallbackLocale,
      product.slug,
    );
    if (!Object.values(slugs).includes(slug)) continue;
    const localizedSlug = slugForLocale(slugs, locale, fallbackLocale);
    return localizedSlug ? { slugs, localizedSlug } : null;
  }

  return null;
}
