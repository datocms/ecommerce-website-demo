// Tailwind class recipes shared across pages. Keep this file under components/: Tailwind only
// scans app/ and components/ for class names.

// Defines --hero-h for pages that open with a photo hero: the viewport minus the strip and the
// header, clamped to 600-780px
export const PAGE_VARS = '[--hero-h:clamp(37.5rem,calc(100svh-7rem),48.75rem)]';

// The well behind every photo: mist while it loads, crops whatever the image does
export const MEDIA = 'relative overflow-hidden bg-mist';

// Slow zoom on the photo while its link is hovered
export const IMG_ZOOM =
  'transition-transform duration-700 ease-out group-hover:scale-[1.03]';

// The dimmed backdrop behind drawers and dialogs
export const SCRIM =
  'fixed inset-0 bg-ink/30 transition-opacity duration-(--dur-sheet) ease-out data-closed:opacity-0 data-leave:duration-(--dur-pop)';
