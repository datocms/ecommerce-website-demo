import { stripStega } from '@datocms/content-link';
import type { CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import RailControls from '../RailControls';
import { TestimonialSectionFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof TestimonialSectionFragment>;
};

// "Jane P." -> "JP"
const initialsOf = (author?: string | null) =>
  stripStega(author ?? '')
    .replaceAll('.', '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join('')
    .toUpperCase();

// The rail's padding matches the title row (24/40/56px). Cards are sized off the butter panel
// (a size container) so one card (two from xl) plus a peek fit, and the peek fades out until
// the rail reaches its end. Its 8px block padding holds the rounded focus ring around the cards;
// the fade drops while the rail has focus so it doesn't wipe out the ring's right edge.
const RAIL =
  'no-scrollbar mt-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto rounded-card px-6 py-2 [--fade:2.75rem] [mask-image:linear-gradient(to_right,black_calc(100%-var(--fade)),transparent)] focus-visible:-outline-offset-2 focus-visible:[mask-image:none] data-at-end:[mask-image:none] sm:scroll-px-10 sm:px-10 sm:[--fade:6rem] lg:mt-10 lg:scroll-px-14 lg:px-14 xl:[--fade:7rem]';
const CARD_WIDTH =
  'w-[calc(100cqw-5.25rem)] sm:w-[min(38.75rem,calc(100cqw-9.5rem))] lg:w-[min(38.75rem,calc(100cqw-11.5rem))] xl:w-[calc((100cqw-12.5rem)/2)]';

const TestimonialsSection = ({ fragment }: Props) => {
  const { id, title, testimonial } = readFragment(
    TestimonialSectionFragment,
    fragment,
  );
  const titleId = `${id}-title`;
  const railId = `${id}-rail`;
  // On phones the title shrinks until its longest word fits the panel (Kundenstimmen), at
  // about 0.6em per letter
  const longestWord = Math.max(
    1,
    ...stripStega(title ?? '')
      .split(/\s+/)
      .map((word) => Array.from(word).length),
  );

  return (
    <section aria-labelledby={titleId} className="shell pt-(--section-gap)">
      <div className="@container rounded-card bg-butter pt-10 pb-8 sm:pt-14 sm:pb-12 lg:pt-16 lg:pb-14">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5 px-6 sm:px-10 lg:px-14">
          <h2
            id={titleId}
            className="h-xl min-w-0 wrap-break-word hyphens-auto max-sm:text-[min(2.75rem,calc((100cqw-3rem)/var(--title-em)))]"
            style={{ '--title-em': longestWord * 0.6 } as CSSProperties}
          >
            {title}
          </h2>
          <RailControls railId={railId} count={testimonial.length} />
        </div>
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: the quotes are not focusable, so the scroller takes focus for keyboard scrolling */}
        <ul id={railId} tabIndex={0} aria-labelledby={titleId} className={RAIL}>
          {testimonial.map((item) => {
            const initials = initialsOf(item.author);
            return (
              <li
                key={item.id}
                className={`flex shrink-0 snap-start ${CARD_WIDTH}`}
              >
                <figure
                  data-datocms-content-link-group
                  className="flex w-full flex-col rounded-card bg-white p-7 sm:p-10"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 48 36"
                    fill="currentColor"
                    className="h-[2.125rem] w-11 shrink-0 text-forest"
                  >
                    <path d="M0 36V22.5C0 10.8 6.2 3.3 18.6 0l2.2 5.1C14.4 7.4 11.3 11.4 11 17h9v19H0Zm27 0V22.5C27 10.8 33.2 3.3 45.6 0l2.2 5.1C41.4 7.4 38.3 11.4 38 17h9v19H27Z" />
                  </svg>
                  <blockquote className="mt-6 font-display text-[1.375rem] leading-[1.3] font-medium tracking-[-0.012em] text-pretty sm:text-[1.625rem] xl:text-[1.75rem] [&>p+p]:mt-[0.75em]">
                    <ReactMarkdown>{item.testimonial || ''}</ReactMarkdown>
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 pt-9">
                    {initials && (
                      <span
                        aria-hidden="true"
                        className="grid size-12 shrink-0 place-items-center rounded-full bg-cream font-display text-base font-bold"
                      >
                        {initials}
                      </span>
                    )}
                    <span className="text-md font-bold">{item.author}</span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default TestimonialsSection;
