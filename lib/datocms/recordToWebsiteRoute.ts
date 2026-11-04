import { productPath } from '@/lib/productPath';
import { localizedString } from './localizedString';

// The site path of a CMA record (its slug may be localized), or null when its model has no page
export function recordToWebsiteRoute(
  record: { id: string; slug?: unknown },
  itemTypeApiKey: string,
  locale: string,
): string | null {
  const slug = localizedString(record.slug, locale);

  switch (itemTypeApiKey) {
    case 'home':
      return `/${locale}/home`;
    case 'showcase':
      return `/${locale}/showcase`;
    case 'store':
      return `/${locale}/stores`;
    case 'product':
      return slug ? productPath(locale, slug) : null;
    case 'legal_page':
      return slug ? `/${locale}/legal/${slug}` : null;
    case 'brand':
      return `/${locale}/products?brands=${record.id}`;
    case 'material':
      return `/${locale}/products?materials=${record.id}`;
    case 'collection':
      return `/${locale}/products?collections=${record.id}`;
    default:
      return null;
  }
}
