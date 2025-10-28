import { stripStega } from 'datocms-visual-editing';

/** Sale flag is strictly "on_sale" */
export function isOnSaleFlag(sale: string | null | undefined): boolean {
  return sale === 'on_sale';
}

/** Sale flag + sale price present (matches cart logic) */
export function isOnSaleWithPrice(
  sale: string | null | undefined,
  salePrice?: number | null,
): boolean {
  return sale === 'on_sale' && salePrice != null;
}

/** Draft-tolerant check: strips stega before comparing. */
export function isOnSaleDraftTolerant(
  sale: string | null | undefined,
): boolean {
  try {
    return stripStega(sale ?? '') === 'on_sale';
  } catch {
    return sale === 'on_sale';
  }
}
