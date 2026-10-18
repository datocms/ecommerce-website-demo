'use client';

import { useEffect, useState } from 'react';

export type Section = { id: string; title: string };

// The index follows the reader: the current section is the last one whose heading has passed a
// line a quarter of the way down the screen, the one an index link just parked under the header,
// or the last one in view once the page can't scroll any further. It only shows from xl
const SectionIndex = ({
  label,
  sections,
}: {
  label?: string;
  sections: Section[];
}) => {
  const [active, setActive] = useState(0);
  const ids = sections.map((section) => section.id).join(' ');

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 80rem)');
    const headings = ids.split(' ').map((id) => document.getElementById(id));
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const offset =
        Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const line = offset + (window.innerHeight - offset) / 4;
      const atBottom =
        window.innerHeight + window.scrollY >= root.scrollHeight - 1;
      let current = 0;
      let parked = -1;
      headings.forEach((heading, index) => {
        const top = heading?.getBoundingClientRect().top ?? Infinity;
        if (top <= line || (atBottom && top < window.innerHeight)) {
          current = index;
        }
        if (Math.abs(top - offset) < 2) parked = index;
      });
      setActive(parked === -1 ? current : parked);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const listen = () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (!wide.matches) return;
      update();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
    };
    listen();
    wide.addEventListener('change', listen);
    return () => {
      cancelAnimationFrame(frame);
      wide.removeEventListener('change', listen);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids]);

  return (
    <nav aria-label={label} className="hidden xl:col-span-3 xl:block">
      <ol className="no-scrollbar sticky top-[calc(var(--header-h)+1rem)] grid max-h-[calc(100svh-var(--header-h)-2rem)] gap-0.5 overflow-y-auto rounded-card bg-white p-3">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={index === active ? 'true' : undefined}
              className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-cream hover:text-ink aria-[current=true]:bg-cream aria-[current=true]:text-ink"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default SectionIndex;
