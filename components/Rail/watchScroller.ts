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
