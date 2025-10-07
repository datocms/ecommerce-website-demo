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

const extractFieldPathSegment = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const marker = 'fieldPath=';
  const index = value.indexOf(marker);

  if (index === -1) {
    return null;
  }

  const start = index + marker.length;
  let end = value.length;

  for (const delimiter of ['#', '&', '?']) {
    const position = value.indexOf(delimiter, start);
    if (position !== -1) {
      end = Math.min(end, position);
    }
  }

  if (end <= start) {
    return null;
  }

  const raw = value.slice(start, end);

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

export const extractDatoFieldPath = (
  editUrl: string | null | undefined,
): string | null => {
  if (!editUrl) {
    return null;
  }

  try {
    const url = new URL(editUrl);
    const fromSearch = url.searchParams.get('fieldPath');
    if (fromSearch) {
      return fromSearch;
    }

    const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
    if (hash) {
      return extractFieldPathSegment(hash);
    }
  } catch {
    // fall through to direct parsing
  }

  return extractFieldPathSegment(editUrl);
};
