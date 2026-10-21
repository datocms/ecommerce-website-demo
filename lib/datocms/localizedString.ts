export function localizedString(
  value: unknown,
  locale: string,
  fallbackLocale = 'en',
) {
  if (typeof value === 'string') {
    return value;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const localizedValue = value as Record<string, unknown>;
  const localeValue = localizedValue[locale];

  if (typeof localeValue === 'string' && localeValue.length > 0) {
    return localeValue;
  }

  const fallbackValue = localizedValue[fallbackLocale];

  if (typeof fallbackValue === 'string' && fallbackValue.length > 0) {
    return fallbackValue;
  }

  return (
    Object.values(localizedValue).find(
      (entry): entry is string => typeof entry === 'string' && entry.length > 0,
    ) || null
  );
}
