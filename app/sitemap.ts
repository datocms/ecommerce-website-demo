import type { MetadataRoute } from 'next';
import { graphql } from '@/lib/datocms/graphql';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import {
  fallbackLocaleOf,
  getAvailableLocales,
  type SiteLocale,
  toLanguageTag,
} from '@/lib/i18n';
import { buildProductSlugMap, slugForLocale } from '@/lib/productSlugs';
import {
  homePath,
  legalPagePath,
  productPath,
  productsPath,
  showcasePath,
  storesPath,
} from '@/lib/routes';
import { getSiteUrl } from '@/lib/siteUrl';

// DatoCMS caps a list at 100 records
const PAGE_SIZE = 100;

const pagesQuery = graphql(/* GraphQL */ `
  query SitemapPages {
    home {
      _updatedAt
    }
    showcase {
      _updatedAt
    }
    allStores(first: 100) {
      _updatedAt
    }
    allLegalPages(first: 100) {
      slug
      _updatedAt
    }
  }
`);

const productsQuery = graphql(/* GraphQL */ `
  query SitemapProducts($first: IntType, $skip: IntType) {
    allProducts(first: $first, skip: $skip) {
      slug
      _updatedAt
      _allSlugLocales {
        locale
        value
      }
    }
  }
`);

async function getAllProducts() {
  const products = [];
  for (let skip = 0; ; skip += PAGE_SIZE) {
    const { allProducts } = await queryDatoCMS(productsQuery, {
      first: PAGE_SIZE,
      skip,
    });
    products.push(...allProducts);
    if (allProducts.length < PAGE_SIZE) return products;
  }
}

const latest = (dates: (string | null | undefined)[]) =>
  dates.reduce<string | undefined>(
    (max, date) => (date && (!max || date > max) ? date : max),
    undefined,
  );

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [locales, pages, products] = await Promise.all([
    getAvailableLocales(),
    queryDatoCMS(pagesQuery),
    getAllProducts(),
  ]);
  const siteUrl = getSiteUrl();
  const fallbackLocale = fallbackLocaleOf(locales);
  const absolute = (path: string) => new URL(path, siteUrl).toString();

  // One entry per locale, each listing every locale's URL
  const entries = (
    pathFor: (locale: SiteLocale) => string,
    lastModified?: string,
  ): MetadataRoute.Sitemap => {
    const languages: Record<string, string> = {
      'x-default': absolute(pathFor(fallbackLocale)),
    };
    for (const locale of locales) {
      languages[toLanguageTag(locale)] = absolute(pathFor(locale));
    }
    return locales.map((locale) => ({
      url: absolute(pathFor(locale)),
      ...(lastModified && { lastModified }),
      alternates: { languages },
    }));
  };

  return [
    ...entries(homePath, pages.home?._updatedAt),
    ...entries(
      (locale) => productsPath(locale),
      latest(products.map((p) => p._updatedAt)),
    ),
    ...entries(showcasePath, pages.showcase?._updatedAt),
    ...entries(storesPath, latest(pages.allStores.map((s) => s._updatedAt))),
    ...pages.allLegalPages.flatMap((legal) =>
      entries((locale) => legalPagePath(locale, legal.slug), legal._updatedAt),
    ),
    ...products.flatMap((product) => {
      const slugs = buildProductSlugMap(
        product._allSlugLocales,
        fallbackLocale,
        product.slug,
      );
      return entries(
        (locale) =>
          productPath(
            locale,
            slugForLocale(slugs, locale, fallbackLocale) ?? product.slug,
          ),
        product._updatedAt,
      );
    }),
  ];
}
