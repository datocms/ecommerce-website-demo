import { decodeStega } from '@datocms/content-link/stega';

/**
 * Content Link URL that opens one field of a record, for values the Content Delivery API cannot
 * stega-encode (numbers, colors, JSON, links) or that belong to a different field than the text
 * around them. `source` is any stega-encoded text from the same record, such as its name: its edit
 * URL is reused with a new #fieldPath. Outside draft mode `source` has no stega, so this returns
 * undefined and no attribute is rendered.
 *
 * `fieldPath` uses the editor's syntax: the field API key, then the locale for localized fields,
 * then the block index and the block's field for fields inside blocks. `{locale}` is replaced with
 * the locale `source` was read in. Examples: 'number_of_reviews', 'price.{locale}',
 * 'product_variations.0.color'.
 */
export function fieldEditUrl(
  source: string | null | undefined,
  fieldPath: string,
): string | undefined {
  const href = source ? decodeStega(source)?.href : undefined;
  if (!href) return undefined;

  const [recordUrl, hash = ''] = href.split('#');
  // The source's own path, e.g. name.en: its second segment is the locale when it is localized
  const sourceLocale = new URLSearchParams(hash)
    .get('fieldPath')
    ?.split('.')[1];
  const path = fieldPath.includes('{locale}')
    ? sourceLocale && fieldPath.replace('{locale}', sourceLocale)
    : fieldPath;

  return path ? `${recordUrl}#fieldPath=${path}` : recordUrl;
}
