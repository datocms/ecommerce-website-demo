import { buildEditTagAttributes } from 'datocms-visual-editing';

export const getProductPriceEditAttributes = (itemId: string) =>
  buildEditTagAttributes({
    itemId,
    itemTypeId: 'product',
    fieldPath: 'price',
  });
