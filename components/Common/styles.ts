// Shared layout recipes for the home and showcase pages. Spacing comes from global.css:
// sections sit --section-gap apart, black bands pad by --band-y.

// Page wrapper: the photo heights of both page heroes (600-780px, the viewport minus the
// strip and the header in between). The footer owns the gap above it.
export const PAGE_VARS = '[--hero-h:clamp(37.5rem,calc(100svh-7rem),48.75rem)]';

// Black band, full bleed: testimonials and any other dark section
export const BAND = 'surface-ink py-(--band-y)';

// The well behind every photo: mist while it loads, crops whatever the image does
export const MEDIA = 'relative overflow-hidden bg-mist';

// Slow zoom on the photo while its link is hovered
export const IMG_ZOOM =
  'transition-transform duration-700 ease-out group-hover:scale-[1.03]';

// A photo with its caption under it, as one link (collections, seasons)
export const TILE = 'group flex flex-col';
// The caption block under a tile's photo: a title and a tlink, or a name with an arrow
export const CAPTION = 'flex flex-col items-start gap-2 pt-4';

// Below lg a snap rail that runs gutter to gutter; from lg a plain grid (add lg:grid-cols-*).
// py-2/-my-2 leaves room inside the scroller for the tiles' focus rings (outline-offset-4).
// An mt-* on the same element replaces the -my-2 top, so the rail then sits 8px lower.
export const RAIL =
  'no-scrollbar -mx-(--gutter) -my-2 flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) py-2 lg:mx-0 lg:my-0 lg:grid lg:snap-none lg:overflow-visible lg:px-0 lg:py-0';
