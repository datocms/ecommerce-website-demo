import { stripStega } from '@datocms/content-link';

// sale is a text field, so draft content carries Content Link stega characters
export const isOnSale = (sale: string | null | undefined) =>
  stripStega(sale ?? '') === 'on_sale';
