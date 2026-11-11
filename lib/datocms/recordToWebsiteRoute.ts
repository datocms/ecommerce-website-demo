import {
  homePath,
  legalPagePath,
  productPath,
  productsPath,
  showcasePath,
  storesPath,
} from '@/lib/routes';
import { localizedString } from './localizedString';

// The site path of a record, or null when its model has no page. Takes a CMA record (its slug may
// be localized) or a queried one (see linkHref.ts).
export function recordToWebsiteRoute(
  record: { id: string; slug?: unknown },
  itemTypeApiKey: string,
  locale: string,
): string | null {
  const slug = localizedString(record.slug, locale);

  switch (itemTypeApiKey) {
    case 'home':
      return homePath(locale);
    case 'showcase':
      return showcasePath(locale);
    case 'store':
      return storesPath(locale);
    case 'product':
      return slug ? productPath(locale, slug) : null;
    case 'legal_page':
      return slug ? legalPagePath(locale, slug) : null;
    case 'brand':
      return productsPath(locale, { brands: record.id });
    case 'material':
      return productsPath(locale, { materials: record.id });
    case 'collection':
      return productsPath(locale, { collections: record.id });
    default:
      return null;
  }
}
