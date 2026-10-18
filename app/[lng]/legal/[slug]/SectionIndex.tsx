'use client';

import { useEffect, useState } from 'react';

export type Section = { id: string; title: string };

// The index follows the reader: the current section is the last one whose heading has passed a
// line a quarter of the way down the screen, the one an index link just parked under the header,
// or the last one in view once the page can't scroll any further. It only shows from lg
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
    const wide = window.matchMedia('(min-width: 64rem)');
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

  // Each row draws its stretch of the rail, so the current section's 2px bar can sit on it
  // without leaving the scroll box (which would clip it)
  return (
    <nav
      aria-label={label}
      className="hidden lg:col-span-4 lg:block lg:pr-8 xl:col-span-3 xl:pr-0"
    >
      <ol className="no-scrollbar sticky top-[calc(var(--header-h)+2rem)] max-h-[calc(100svh-var(--header-h)-4rem)] overflow-y-auto">
        {sections.map((section, index) => (
          <li key={section.id} className="border-l">
            <a
              href={`#${section.id}`}
              aria-current={index === active ? 'true' : undefined}
              className="-ml-px flex min-h-11 items-center border-l-2 border-transparent py-2 pl-5 text-sm leading-snug text-mute transition-colors duration-150 hover:text-ink focus-visible:outline-offset-[-2px] aria-[current=true]:border-ink aria-[current=true]:font-semibold aria-[current=true]:text-ink"
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
