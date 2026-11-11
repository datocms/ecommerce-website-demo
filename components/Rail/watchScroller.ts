// Pixels of slack when comparing scroll positions, which can be fractional
export const SCROLL_EPSILON = 1;

// How far the scroller can scroll horizontally
export const scrollRange = (scroller: HTMLElement) =>
  scroller.scrollWidth - scroller.clientWidth;

// Calls onChange now, then on every scroll and resize of the scroller; returns the cleanup
export function watchScroller(scroller: HTMLElement, onChange: () => void) {
  onChange();
  scroller.addEventListener('scroll', onChange, { passive: true });
  const observer = new ResizeObserver(onChange);
  observer.observe(scroller);
  return () => {
    scroller.removeEventListener('scroll', onChange);
    observer.disconnect();
  };
}
