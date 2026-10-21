import { stripStega } from '@datocms/content-link';
import { useEffect, useRef } from 'react';

type Props = {
  text: string;
};

// The giant wordmark, fitted to the content width: measure the ink at a reference size and
// rescale (Geist's widths are linear in size, so one step converges; the loop also covers
// fallback fonts), then shift the ink onto the content's left edge.
export default function Wordmark({ text }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const plain = stripStega(text).trim();

  useEffect(() => {
    const element = ref.current;
    const context = document.createElement('canvas').getContext('2d');
    if (!element || !context || !plain) return;

    let width = 0;
    const fit = () => {
      width = element.clientWidth;
      if (!width) return;
      let size = 100;
      let metrics = context.measureText(plain);
      element.style.transform = '';
      for (let step = 0; step < 5; step++) {
        element.style.fontSize = `${size}px`;
        const style = getComputedStyle(element);
        context.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
        context.letterSpacing = style.letterSpacing;
        metrics = context.measureText(plain);
        const ink =
          metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
        if (!ink) return;
        size = (size * width) / ink;
      }
      element.style.fontSize = `${size.toFixed(2)}px`;
      element.style.transform = `translateX(${metrics.actualBoundingBoxLeft.toFixed(2)}px)`;
    };

    fit();
    document.fonts.ready.then(fit);
    const observer = new ResizeObserver(() => {
      if (element.clientWidth !== width) fit();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [plain]);

  return (
    <p
      ref={ref}
      aria-hidden="true"
      className="giant reveal mask pb-6 select-none md:pb-10"
      // Close to the fitted size before the script runs: the content width at about
      // 0.46em per glyph
      style={{
        fontSize: `calc((min(100vw, 90rem) - 2 * var(--gutter)) / ${Math.max(plain.length, 1) * 0.46})`,
      }}
    >
      {text}
    </p>
  );
}
