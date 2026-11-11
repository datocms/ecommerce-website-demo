import SectionTitle from '@/components/Common/SectionTitle';
import RailControls from '@/components/Rail/RailControls';
import RailFocus from '@/components/Rail/RailFocus';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { CollectionCardShowcaseFragment } from './fragments';
import ShowcaseColumn from './ShowcaseColumn';

type Props = {
  sections: FragmentOf<typeof CollectionCardShowcaseFragment>[];
  lng: string;
  /** Prefix for the heading and rail ids */
  id: string;
  /** Header dropdown column label ("Seasons"); without it the group has no heading */
  title?: string | null;
  /** Navigation link to the whole catalog ("All products") */
  action?: { label: string; href: string };
  /** General interface "Previous" and "Next" labels, for the rail buttons */
  previousLabel?: string;
  nextLabel?: string;
};

// Up to four columns side by side from lg; more wrap onto another row
const GRID_COLUMNS = [
  '',
  'lg:grid-cols-1',
  'lg:grid-cols-2',
  'lg:grid-cols-3',
  'lg:grid-cols-4',
];

// Snap rail below lg, grid from lg; columns share four subgrid rows. Snapping pauses during
// keyboard focus so RailControls or RailFocus can scroll to the focused column.
const RAIL_GRID =
  'no-scrollbar -mx-(--gutter) -my-2 grid auto-cols-[80%] grid-flow-col grid-rows-[repeat(4,auto)] gap-x-4 overflow-x-auto scroll-px-(--gutter) px-(--gutter) py-2 snap-x snap-mandatory has-focus-visible:snap-none sm:auto-cols-[44%] lg:mx-0 lg:my-0 lg:auto-cols-auto lg:grid-flow-row lg:gap-x-8 lg:overflow-visible lg:px-0 lg:py-0 xl:gap-x-10';

// One column per block in a run of consecutive showcases (grouped by home/showcaseGroups.ts)
export default function CollectionCardShowcase({
  sections,
  lng,
  id,
  title,
  action,
  previousLabel,
  nextLabel,
}: Props) {
  const columns = Math.min(sections.length, 4);
  const titleId = `${id}-seasons-title`;
  const railId = `${id}-seasons`;

  const grid = (
    <div
      id={railId}
      className={`${RAIL_GRID} ${GRID_COLUMNS[columns]} reveal-stagger`}
    >
      {sections.map((section, index) => (
        <ShowcaseColumn
          key={readFragment(CollectionCardShowcaseFragment, section).id}
          fragment={section}
          lng={lng}
          // Gap above a wrapped row
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
      <SectionTitle
        id={titleId}
        title={title}
        action={action}
        aside={
          <RailControls
            railId={railId}
            previousLabel={previousLabel}
            nextLabel={nextLabel}
          />
        }
        className="mb-8 lg:mb-12"
      />
      {grid}
    </section>
  );
}
