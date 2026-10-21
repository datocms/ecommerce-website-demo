import ReactMarkdown from 'react-markdown';
import RailControls from '@/components/Common/RailControls';
import RailProgress from '@/components/Common/RailProgress';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { TestimonialSectionFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof TestimonialSectionFragment>;
};

// Up to three quotes side by side from lg, split by hairlines; more wrap onto another row
const COLUMNS = [
  { grid: '', item: '' },
  { grid: 'lg:grid-cols-1', item: 'lg:border-l-0 lg:pl-0' },
  { grid: 'lg:grid-cols-2', item: 'lg:odd:border-l-0 lg:odd:pl-0' },
  {
    grid: 'lg:grid-cols-3',
    item: 'lg:[&:nth-child(3n+1)]:border-l-0 lg:[&:nth-child(3n+1)]:pl-0',
  },
];

// Black band of big white quotes. Below lg the quotes are a snap rail with a progress track (and
// arrows from sm, for mouse users); from lg a grid whose authors line up along the bottom.
export default function Testimonials({ fragment }: Props) {
  const { id, title, testimonial } = readFragment(
    TestimonialSectionFragment,
    fragment,
  );
  const titleId = `${id}-title`;
  const railId = `${id}-rail`;
  const columns = COLUMNS[Math.min(testimonial.length, 3)];

  return (
    <section
      aria-labelledby={titleId}
      className="surface-ink py-(--band-y) mt-(--section-gap)"
    >
      <div className="shell">
        <div className="mb-12 flex items-end justify-between gap-6 lg:mb-16">
          <h2 id={titleId} className="title-section">
            {title}
          </h2>
          <RailControls railId={railId} />
        </div>
        <ul
          id={railId}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the quotes are not focusable, so the scroller takes focus for keyboard scrolling (RailProgress drops it while nothing scrolls)
          tabIndex={0}
          aria-labelledby={titleId}
          className={`no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-6 overflow-x-auto px-(--gutter) focus-visible:-outline-offset-2 lg:mx-0 lg:grid lg:gap-x-10 lg:gap-y-16 lg:overflow-visible lg:px-0 ${columns.grid}`}
        >
          {testimonial.map((item) => (
            <li
              key={item.id}
              className={`flex w-[86%] max-w-[30rem] shrink-0 snap-start border-l border-line pl-6 sm:w-[60%] lg:w-auto lg:max-w-none lg:pl-10 ${columns.item}`}
            >
              <figure
                data-datocms-content-link-group
                className="flex w-full flex-col justify-between"
              >
                {/* One pair of quotes in the page language around the whole testimonial */}
                <blockquote className="text-[1.3125rem] leading-[1.32] font-medium tracking-[-0.02em] text-pretty xl:text-[1.625rem] [&>p+p]:mt-[0.75em] [&>p:first-child]:before:content-[open-quote] [&>p:last-child]:after:content-[close-quote]">
                  <ReactMarkdown>{item.testimonial || ''}</ReactMarkdown>
                </blockquote>
                <figcaption className="mt-10 text-sm font-medium text-mute">
                  {item.author}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <RailProgress railId={railId} tabStop className="mt-10 lg:hidden" />
      </div>
    </section>
  );
}
