// Tailwind class recipes shared across pages. Spacing tokens (--section-gap, --band-y, --gutter)
// live in styles/global.css. Keep this file under components/: Tailwind only scans app/ and
// components/ for class names.

// Defines --hero-h for pages that open with a photo hero (home, stores): the viewport minus the
// strip and the header, clamped to 600-780px.
export const PAGE_VARS = '[--hero-h:clamp(37.5rem,calc(100svh-7rem),48.75rem)]';

// The well behind every photo: mist while it loads, crops whatever the image does
export const MEDIA = 'relative overflow-hidden bg-mist';

// Slow zoom on the photo while its link is hovered
export const IMG_ZOOM =
  'transition-transform duration-700 ease-out group-hover:scale-[1.03]';
