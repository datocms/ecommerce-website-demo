import getAvailableLocales from '@/app/i18n/settings';
import {
  ProductSlugLookupDocument,
  type SiteLocale,
} from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';

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
  const locales = await getAvailableLocales();
  const searchLocales = [
    locale,
    ...locales.filter((candidateLocale) => candidateLocale !== locale),
  ] as SiteLocale[];

  for (const searchLocale of searchLocales) {
    const data = await queryDatoCMS(
      ProductSlugLookupDocument,
      {
        slug,
        locale: searchLocale,
        fallbackLocale: [fallbackLocale],
      },
      isDraft,
    );

    if (!data.product) {
      continue;
    }

    const slugs = buildProductSlugMap(
      data.product._allSlugLocales,
      searchLocale,
      data.product.slug,
    );
    const localizedSlug = slugForLocale(slugs, locale, fallbackLocale);

    if (!localizedSlug) {
      return null;
    }

    return {
      productId: data.product.id,
      slugs,
      localizedSlug,
      matchedLocale: searchLocale,
    };
  }

  return null;
}
