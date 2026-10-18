// Shared layout recipes for the home and showcase pages. Spacing comes from global.css:
// sections sit --section-gap apart, white cards pad by --card-pad, forest panels by --panel-pad.

// Page wrapper: both page heroes share --hero-h. The footer owns the gap above it.
export const PAGE_VARS = '[--hero-h:clamp(36.25rem,45.8vw,41.25rem)]';

// White content card (season bands, large text panels)
export const CARD = 'rounded-card bg-white p-(--card-pad)';

// Forest feature panel (page heroes)
export const FOREST_CARD = 'rounded-card surface-forest p-(--panel-pad)';

// Below sm a snap rail that starts on the gutter and bleeds off the right edge; from sm a plain
// grid. py-1/-my-1 leaves room for focus rings inside the scroller.
export const RAIL =
  'no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) py-1 -my-1 sm:mx-0 sm:my-0 sm:grid sm:gap-4 sm:overflow-visible sm:px-0 sm:py-0';

// White tile card around a photo (materials, collections, spotlights): the link is the card,
// so its focus ring follows the card's corners
export const TILE_CARD = 'group flex flex-col rounded-card bg-white p-2';
// The photo well inside a tile card
export const TILE_MEDIA = 'relative overflow-hidden rounded-image bg-oat';
// The card's text block under the photo
export const TILE_TEXT =
  'flex flex-col items-start gap-4 px-3 pt-5 pb-3 lg:px-4 lg:pb-4';
// Slow zoom on the photo while its card is hovered
export const IMG_ZOOM =
  'transition-transform duration-500 ease-out group-hover:scale-[1.04]';

// Photo tile without a card (mosaics): the focus ring is drawn on the photo instead of the link box
export const TILE_LINK = 'group block focus-visible:outline-hidden';
export const TILE_IMG =
  'relative overflow-hidden rounded-nav bg-oat group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-solid group-focus-visible:outline-ink';

export const CAPTION_HOVER =
  'decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline';

// Text inside a media panel (8px padding) lands on the same --card-pad as every other card
export const PANEL_TEXT =
  'px-[calc(var(--card-pad)-0.5rem)] pt-[calc(var(--card-pad)-0.5rem)]';
