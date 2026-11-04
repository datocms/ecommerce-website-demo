// The photo covers its box: request the box width or its height × the photo's ratio, whichever is
// wider. From lg the box is the photo column (6 of 12 columns plus the right gutter, 7 from 2xl),
// 780px tall (--hero-h) unless a long description stretches it; below lg it is full width and 4:3
export function heroImageSizes(ratio: number): string {
  const cover = ({
    minViewportPx,
    maxViewportPx,
    columnVw,
    columnOffsetPx,
    boxHeightPx,
  }: {
    minViewportPx: number;
    maxViewportPx: number;
    /** The column is columnVw + columnOffsetPx wide */
    columnVw: number;
    columnOffsetPx: number;
    boxHeightPx: number;
  }) => {
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
    cover({
      minViewportPx: 1440,
      maxViewportPx: Number.POSITIVE_INFINITY,
      columnVw: 50,
      columnOffsetPx: 107,
      boxHeightPx: 780,
    }),
    cover({
      minViewportPx: 1024,
      maxViewportPx: 1440,
      columnVw: 50,
      columnOffsetPx: -8,
      boxHeightPx: 780,
    }),
    `${Math.round(Math.max(100, 75 * ratio))}vw`,
  ].join(', ');
}
