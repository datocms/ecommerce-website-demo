/** Tailwind's lg breakpoint */
export const LG_MEDIA_QUERY = '(min-width: 64rem)';

/** The page's scroll-padding-top in px, i.e. the height of what sticks to the top of the viewport */
export const getScrollPaddingTop = () =>
  Number.parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop,
  ) || 0;
