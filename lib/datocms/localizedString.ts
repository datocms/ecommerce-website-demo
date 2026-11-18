const isNonEmptyString = (entry: unknown): entry is string =>
  typeof entry === 'string' && entry.length > 0;

/**
 * Reads a localized CMA field value ({ en: "…", it: "…" }) for `locale`, falling back to
 * `fallbackLocale`, then to any non-empty locale. Plain strings (non-localized fields) pass through.
 */
export function localizedString(
  value: unknown,
  locale: string,
  fallbackLocale = 'en',
) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const byLocale = value as Record<string, unknown>;
  return (
    [
      byLocale[locale],
      byLocale[fallbackLocale],
      ...Object.values(byLocale),
    ].find(isNonEmptyString) ?? null
  );
}
