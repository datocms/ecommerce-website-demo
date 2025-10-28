/**
 * Common Next/Image-style props used by our DatoImage wrapper when we want to
 * fill the container and cover it, with a default centered object position.
 * Use by spreading: `{...imageFillCoverProps()}` or pass a different position.
 */
export function imageFillCoverProps(objectPosition = '50% 50%') {
  return {
    layout: 'fill' as const,
    objectFit: 'cover' as const,
    objectPosition,
  };
}

/** Same as above but without setting a layout/fill mode. */
export function imageCoverProps(objectPosition = '50% 50%') {
  return {
    objectFit: 'cover' as const,
    objectPosition,
  };
}
