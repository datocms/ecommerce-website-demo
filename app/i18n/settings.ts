import { LocalesDocument } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';

/**
 * Fetch the list of locales configured in the CMS, preserving order.
 * @returns Array of supported locale codes
 */
export default async function getAvailableLocales() {
  const { _site } = await queryDatoCMS(LocalesDocument);
  return _site.locales;
}

/**
 * Return the default fallback locale (first in the configured order).
 */
export async function getFallbackLocale() {
  const locales = await getAvailableLocales();
  return locales[0]; // using the first ordered locale as fallback
}

/** Primary brand color expressed using CSS custom properties. */
export const primaryColor = 'rgb(var(--color-primary))';
