import { StructuredText } from 'react-datocms/structured-text';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { TestimonialSectionFragment } from './fragments';
import QuoteMarquee from './QuoteMarquee';

type Props = {
  fragment: FragmentOf<typeof TestimonialSectionFragment>;
  /** General interface "Pause" and "Play" labels */
  pauseLabel: string | undefined;
  playLabel: string | undefined;
};

export default function Testimonials({
  fragment,
  pauseLabel,
  playLabel,
}: Props) {
  const { id, title, testimonial } = readFragment(
    TestimonialSectionFragment,
    fragment,
  );
  const titleId = `${id}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className="surface-ink mt-(--section-gap) py-(--band-y)"
    >
      <QuoteMarquee
        heading={
          <h2 id={titleId} className="title-section">
            {title}
          </h2>
        }
        pauseLabel={pauseLabel}
        playLabel={playLabel}
        quotes={testimonial.map((item) => ({
          id: item.id,
          content: (
            <figure
              data-datocms-content-link-group
              className="flex w-full flex-col justify-between"
            >
              {/* Not DatoStructuredText: its wrapper <div> would break the [&>p] selectors
                  that put page-language quote marks around the whole testimonial */}
              <blockquote className="text-[1.3125rem] leading-[1.32] font-medium tracking-[-0.02em] text-pretty xl:text-[1.625rem] [&>p+p]:mt-[0.75em] [&>p:first-child]:before:content-[open-quote] [&>p:last-child]:after:content-[close-quote]">
                <StructuredText data={item.testimonial} />
              </blockquote>
              <figcaption className="mt-10 text-sm font-medium text-mute">
                {item.author}
              </figcaption>
            </figure>
          ),
        }))}
      />
    </section>
  );
}
