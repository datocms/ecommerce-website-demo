import { stripStega } from '@datocms/content-link';

// Season tints for the hero tiles and the season band pre-titles. Keyed on the collection slug
// ("summer-looks"), which is not localized; the names are.
const SEASON_TINTS = {
  spring: 'bg-spring',
  summer: 'bg-summer',
  fall: 'bg-fall',
  autumn: 'bg-fall',
  winter: 'bg-winter',
} as const;

export function seasonTint(slug?: string | null) {
  const key = stripStega(slug ?? '')
    .toLowerCase()
    .split('-')[0];
  return Object.hasOwn(SEASON_TINTS, key)
    ? SEASON_TINTS[key as keyof typeof SEASON_TINTS]
    : undefined;
}
