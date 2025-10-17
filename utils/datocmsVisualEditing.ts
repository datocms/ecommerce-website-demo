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
