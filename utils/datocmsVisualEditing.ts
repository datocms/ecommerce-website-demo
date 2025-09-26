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
