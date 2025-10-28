import { stripStega } from 'datocms-visual-editing';

/**
 * Check if a product’s sale flag equals the literal `"on_sale"`.
 *
 * @param sale - Raw sale flag field from the CMS (may be null/undefined).
 * @returns True if the value equals `"on_sale"`, false otherwise.
 */
export function isOnSaleFlag(sale: string | null | undefined): boolean {
  return sale === 'on_sale';
}

/**
 * Check if the sale flag is on and a sale price is present.
 *
 * @param sale - Sale flag field from the CMS.
 * @param salePrice - Optional sale price value.
 * @returns True if `sale === "on_sale"` and `salePrice` is non-null.
 */
export function isOnSaleWithPrice(
  sale: string | null | undefined,
  salePrice?: number | null,
): boolean {
  return sale === 'on_sale' && salePrice != null;
}

/**
 * Draft‑tolerant check for the sale flag. Strips stega markers before compare.
 *
 * @param sale - Sale flag value which may include steganographic markers.
 * @returns True if the decoded value equals `"on_sale"`.
 */
export function isOnSaleDraftTolerant(
  sale: string | null | undefined,
): boolean {
  try {
    return stripStega(sale ?? '') === 'on_sale';
  } catch {
    return sale === 'on_sale';
  }
}
