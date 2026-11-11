'use client';

import { useEffect, useState } from 'react';
import { getScrollPaddingTop, LG_MEDIA_QUERY } from '@/lib/scrollPadding';

export type Section = { id: string; title: string };

type Props = {
  label: string;
  sections: Section[];
};

// From lg, marks the section being read: the last heading past a line a quarter down the screen,
// the one an index link just parked under the header, or the last one in view at the page's end
export default function SectionIndex({ label, sections }: Props) {
  const [active, setActive] = useState(0);
  // Joined so the effect only re-runs when the set of ids changes
  const ids = sections.map((section) => section.id).join(' ');

  useEffect(() => {
    const lgQuery = window.matchMedia(LG_MEDIA_QUERY);
    const headings = ids.split(' ').map((id) => document.getElementById(id));
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const offset = getScrollPaddingTop();
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
    const syncScrollListeners = () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (!lgQuery.matches) return;
      update();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
    };
    syncScrollListeners();
    lgQuery.addEventListener('change', syncScrollListeners);
    return () => {
      cancelAnimationFrame(frame);
      lgQuery.removeEventListener('change', syncScrollListeners);
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
      <ol className="enter no-scrollbar sticky top-[calc(var(--header-h)+2rem)] max-h-[calc(100svh-var(--header-h)-4rem)] overflow-y-auto [--delay:120ms]">
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
}
