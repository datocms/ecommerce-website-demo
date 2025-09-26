import { buildEditTagAttributes } from 'datocms-visual-editing';

type ProductPriceFieldPath = 'price' | 'salePrice';

export const getProductPriceEditAttributes = (
  itemId: string,
  { fieldPath = 'price' }: { fieldPath?: ProductPriceFieldPath } = {},
) =>
  buildEditTagAttributes({
    itemId,
    itemTypeId: 'product',
    fieldPath,
  });
