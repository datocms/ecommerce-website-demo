// The photo covers its box, so it renders at the box's width or at its height × the photo's
// ratio, whichever is wider. Below lg the box is full width and 4:3; from lg it is 6 of 12
// columns plus the right gutter (50vw - 8px), 7 from 2xl (50vw + 107px), and at most 780px
// tall (--hero-h), unless a long description makes the text column taller
export function heroImageSizes(ratio: number): string {
  const cover = (
    minViewportPx: number,
    maxViewportPx: number,
    columnVw: number,
    columnOffsetPx: number,
    boxHeightPx: number,
  ) => {
    const photoWidthPx = Math.round(boxHeightPx * ratio);
    const columnWidth = `calc(${columnVw}vw ${columnOffsetPx < 0 ? '-' : '+'} ${Math.abs(columnOffsetPx)}px)`;
    const breakpointPx = Math.ceil(
      ((photoWidthPx - columnOffsetPx) * 100) / columnVw,
    );
    if (breakpointPx <= minViewportPx)
      return `(min-width: ${minViewportPx}px) ${columnWidth}`;
    if (breakpointPx >= maxViewportPx)
      return `(min-width: ${minViewportPx}px) ${photoWidthPx}px`;
    return `(min-width: ${breakpointPx}px) ${columnWidth}, (min-width: ${minViewportPx}px) ${photoWidthPx}px`;
  };

  return [
    cover(1440, Number.POSITIVE_INFINITY, 50, 107, 780),
    cover(1024, 1440, 50, -8, 780),
    `${Math.round(Math.max(100, 75 * ratio))}vw`,
  ].join(', ');
}
