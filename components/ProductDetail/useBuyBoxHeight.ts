'use client';

import { type CSSProperties, useEffect, useRef, useState } from 'react';

// A buy box taller than the viewport sticks by its bottom edge, so its actions stay in view
export function useBuyBoxHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const observer = new ResizeObserver(() => setHeight(box.offsetHeight));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const style = height
    ? ({ '--buy-box-h': `${height}px` } as CSSProperties)
    : undefined;
  return { ref, style };
}
