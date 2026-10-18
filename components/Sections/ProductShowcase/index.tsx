import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import SectionTitle from '@/components/Common/SectionTitle';
import DatoImage from '@/components/DatoImage';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import RailControls from '../RailControls';
import RailFocus from '../RailFocus';
import { IMG_ZOOM, MEDIA } from '../ui';
import { CollectionCardShowcaseFragment } from './fragments';

type Props = {
  /** Consecutive collection showcases (the seasons), shown side by side */
  sections: FragmentOf<typeof CollectionCardShowcaseFragment>[];
  globalPageProps: ResolvedGlobalPageProps;
  /** Base of the heading id; the group is a labelled section only when it has a title */
  id: string;
  /** Navigation column label that groups these collections ("Seasons") */
  title?: string | null;
  /** Navigation link to the whole catalog ("All products") */
  action?: { label: string; href: string };
};

// Up to four columns side by side from lg; more wrap onto another row
const COLUMNS = [
  '',
  'lg:grid-cols-1',
  'lg:grid-cols-2',
  'lg:grid-cols-3',
  'lg:grid-cols-4',
];

// Below lg a snap rail that runs gutter to gutter, from lg a grid. Either way every column spans
// the same four rows (photo, title and copy, link, other collections), so the copy, links and
// small photos line up across the seasons whatever the text lengths. py-2 (taken back by -my-2)
// leaves room for the links' focus rings, 4px out, inside the rail. Snapping pauses while
// keyboard focus is inside, so tabbing moves the rail only as far as RailControls (or RailFocus)
// scrolls to show the focused season whole.
const GRID =
  'no-scrollbar -mx-(--gutter) -my-2 grid auto-cols-[80%] grid-flow-col grid-rows-[repeat(4,auto)] gap-x-4 overflow-x-auto scroll-px-(--gutter) px-(--gutter) py-2 snap-x snap-mandatory has-focus-visible:snap-none sm:auto-cols-[44%] lg:mx-0 lg:my-0 lg:auto-cols-auto lg:grid-flow-row lg:gap-x-8 lg:overflow-visible lg:px-0 lg:py-0 xl:gap-x-10';

function Season({
  fragment,
  lng,
  className,
}: {
  fragment: FragmentOf<typeof CollectionCardShowcaseFragment>;
  lng: string;
  className: string;
}) {
  const { id, pretitle, title, description, button, collection } = readFragment(
    CollectionCardShowcaseFragment,
    fragment,
  );
  const [lead, ...rest] = collection;
  const cta = button[0];
  const titleId = `${id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={`row-span-4 grid snap-start grid-rows-subgrid ${className}`}
    >
      {lead ? (
        <Link
          href={`/${lng}/products?collections=${lead.id}`}
          className={`group block ${MEDIA} aspect-[4/5] outline-offset-4`}
          data-datocms-content-link-group
        >
          {lead.details.image.responsiveImage && (
            <DatoImage
              fragment={lead.details.image.responsiveImage}
              className={IMG_ZOOM}
              layout="fill"
              objectFit="cover"
              objectPosition="50% 30%"
              sizes="(min-width: 1440px) 310px, (min-width: 1024px) 22vw, (min-width: 640px) 44vw, 80vw"
            />
          )}
          {/* The pretitle belongs to this showcase block, not to the lead collection the link
              group edits, so it stays its own click-to-edit target. A long one wraps into
              balanced lines whose white boxes hug the text and join into one label: 28px boxes
              24px apart, the wrapper 2px lower so a single line sits 12px in like every tag. */}
          {pretitle && (
            <span className="absolute top-3.5 left-3 max-w-[calc(100%-1.5rem)] text-xs leading-6 text-balance">
              <span
                className="tag inline box-decoration-clone py-1.25 leading-6 whitespace-normal"
                data-datocms-content-link-boundary
              >
                {pretitle}
              </span>
            </span>
          )}
          {/* Dark and tall enough to keep the white caption at AA on the lightest photos */}
          <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-linear-to-t from-ink/75 to-transparent px-4 pt-20 pb-4 text-sm font-semibold text-white">
            {lead.name}
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 shrink-0 stroke-2 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      <div className="mt-5">
        <h3 id={titleId} className="title-card">
          {title}
        </h3>
        {description && (
          <p className="mt-3 text-sm leading-[1.5] text-pretty text-ink-2">
            {description}
          </p>
        )}
      </div>
      {cta ? (
        <div className="mt-4">
          <Link
            href={`/${lng}/${stripStega(cta.slug ?? '')}`}
            className="tlink"
          >
            {cta.label}
            <ArrowRightIcon aria-hidden="true" className="stroke-2" />
          </Link>
        </div>
      ) : (
        <span aria-hidden="true" />
      )}
      {rest.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5">
          {rest.map((item) => (
            <li key={item.id}>
              <Link
                href={`/${lng}/products?collections=${item.id}`}
                className="group block outline-offset-4"
                data-datocms-content-link-group
              >
                <div className={`${MEDIA} aspect-[4/5]`}>
                  {item.details.image.responsiveImage && (
                    <DatoImage
                      fragment={item.details.image.responsiveImage}
                      className={IMG_ZOOM}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="50% 30%"
                      sizes="(min-width: 1440px) 150px, (min-width: 1024px) 11vw, (min-width: 640px) 22vw, 40vw"
                    />
                  )}
                </div>
                <p className="mt-2.5 text-sm leading-tight font-medium underline-offset-4 group-hover:underline">
                  {item.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <span aria-hidden="true" />
      )}
    </article>
  );
}

const ProductShowcase = ({
  sections,
  globalPageProps,
  id,
  title,
  action,
}: Props) => {
  const { lng } = globalPageProps.params;
  const columns = Math.min(sections.length, 4);
  const titleId = `${id}-seasons-title`;
  const railId = `${id}-seasons`;

  const grid = (
    <div id={railId} className={`${GRID} ${COLUMNS[columns]}`}>
      {sections.map((section, index) => (
        <Season
          key={readFragment(CollectionCardShowcaseFragment, section).id}
          fragment={section}
          lng={lng}
          // A wrapped row of seasons keeps its distance from the one above
          className={index >= columns ? 'lg:mt-16' : ''}
        />
      ))}
    </div>
  );

  if (!title) {
    return (
      <div className="shell pt-(--section-gap)">
        {grid}
        <RailFocus railId={railId} />
      </div>
    );
  }

  return (
    <section aria-labelledby={titleId} className="shell pt-(--section-gap)">
      {/* The arrows show only while the seasons scroll (from sm to lg) */}
      <SectionTitle
        id={titleId}
        title={title}
        action={action}
        aside={<RailControls railId={railId} />}
        className="mb-8 lg:mb-12"
      />
      {grid}
    </section>
  );
};

export default ProductShowcase;
