/** Joins class names, skipping the empty ones: `cx('btn', isActive && 'is-active', className)`. */
export const cx = (...classNames: (string | false | null | undefined)[]) =>
  classNames.filter(Boolean).join(' ');
