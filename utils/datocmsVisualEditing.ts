/**
 * Small helpers to build edit attributes for inline targets.
 * - `buildEditTagAttributes` computes data-* attributes consumed by the
 *   visual-editing controller. Spread them onto the element you want to make
 *   editable and add `data-datocms-edit-target` to explicitly mark it.
 */
import { buildEditTagAttributes } from 'datocms-visual-editing';

type ProductPriceFieldPath = 'price' | 'sale_price';

type ProductPriceEditOptions = {
  fieldPath?: ProductPriceFieldPath;
};

/**
 * Build edit attributes for the product price field so the element becomes an
 * inline edit target under Visual Editing.
 *
 * @param editingUrl - `_editingUrl` for the record; when falsy, returns `{}`
 * @param locale - Active locale for the field
 * @param options - Optional field override (defaults to `price`)
 * @returns Plain object with data-attributes to spread on an element
 */
export const getProductPriceEditAttributes = (
  editingUrl: string | null | undefined,
  locale: string,
  { fieldPath = 'price' }: ProductPriceEditOptions = {},
) =>
  editingUrl
    ? buildEditTagAttributes({
        _editingUrl: editingUrl,
        fieldPath,
        locale,
      })
    : {};

/**
 * Build edit attributes for an arbitrary field path on a product record.
 *
 * @param editingUrl - `_editingUrl` for the record; when falsy, returns `{}`
 * @param locale - Active locale for the field
 * @param fieldPath - Field path or array of nested path segments
 * @returns Plain object with data-attributes to spread on an element
 */
export const getProductFieldEditAttributes = (
  editingUrl: string | null | undefined,
  locale: string,
  fieldPath: string | string[],
) =>
  editingUrl
    ? buildEditTagAttributes({
        _editingUrl: editingUrl,
        fieldPath,
        locale,
      })
    : {};
