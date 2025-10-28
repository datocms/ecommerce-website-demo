/**
 * Common Next/Image-style props used by our DatoImage wrapper when we want to
 * fill the container and cover it, with a default centered object position.
 * Use by spreading: `{...imageFillCoverProps()}` or pass a different position.
 *
 * @param objectPosition - CSS `object-position` string (e.g., `"50% 50%"`).
 * @returns Props compatible with `react-datocms` Image that fill and cover.
 */
export function imageFillCoverProps(objectPosition = '50% 50%') {
  return {
    layout: 'fill' as const,
    objectFit: 'cover' as const,
    objectPosition,
  };
}

/**
 * Same as {@link imageFillCoverProps} but without setting a layout/fill mode.
 *
 * @param objectPosition - CSS `object-position` string.
 * @returns Props with `objectFit: 'cover'` and the given `objectPosition`.
 */
export function imageCoverProps(objectPosition = '50% 50%') {
  return {
    objectFit: 'cover' as const,
    objectPosition,
  };
}
