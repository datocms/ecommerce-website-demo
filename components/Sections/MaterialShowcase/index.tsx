import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DatoImage from '@/components/DatoImage';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import RailControls from '../RailControls';
import { IMG_ZOOM, MEDIA, RAIL, TILE } from '../ui';
import { MaterialShowcaseFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof MaterialShowcaseFragment>;
  globalPageProps: ResolvedGlobalPageProps;
};

const GRID_COLUMNS = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
} as const;

// Image sizes that follow the column count from lg (a rail below it)
const SIZES = {
  2: '(min-width: 1440px) 680px, (min-width: 1024px) 48vw, (min-width: 640px) 40vw, 72vw',
  3: '(min-width: 1440px) 450px, (min-width: 1024px) 32vw, (min-width: 640px) 40vw, 72vw',
  4: '(min-width: 1440px) 340px, (min-width: 1024px) 24vw, (min-width: 640px) 40vw, 72vw',
} as const;

// Title on the left, the lead and the copy on the right, then one square photo per material
// (a snap rail below lg, with arrows beside the title from sm) named with an arrow. The rail
// pauses snapping while keyboard focus is inside, so RailControls can scroll the focused tile
// fully into view. Below lg the copy keeps a reading measure.
const MaterialShowcase = ({ fragment, globalPageProps }: Props) => {
  const { id, title, description, subDescription, materials } = readFragment(
    MaterialShowcaseFragment,
    fragment,
  );
  // One row where the count allows it; longer lists wrap onto more rows
  const columns =
    materials.length <= 2
      ? 2
      : materials.length % 4 === 0 && materials.length % 3 !== 0
        ? 4
        : 3;
  const titleId = `${id}-title`;
  const railId = `${id}-rail`;

  return (
    <section aria-labelledby={titleId} className="shell pt-(--section-gap)">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-4">
        <div className="flex items-end justify-between gap-6 lg:col-span-5 lg:items-start">
          <h2 id={titleId} className="title-section">
            {title}
          </h2>
          <RailControls railId={railId} />
        </div>
        {(description || subDescription) && (
          <div className="max-w-[40rem] lg:col-span-6 lg:col-start-7 lg:max-w-none">
            {description && (
              <p className="text-xl leading-[1.45] text-pretty lg:text-[1.375rem] lg:tracking-[-0.015em]">
                {description}
              </p>
            )}
            {subDescription && (
              <p
                className={`text-base leading-[1.65] text-ink-2 ${description ? 'mt-5' : ''}`}
              >
                {subDescription}
              </p>
            )}
          </div>
        )}
      </div>

      <ul
        id={railId}
        className={`${RAIL} mt-10 has-focus-visible:snap-none lg:mt-16 lg:gap-y-12 ${GRID_COLUMNS[columns]}`}
      >
        {materials.map((material) => (
          <li
            key={material.id}
            className="flex w-[72%] shrink-0 snap-start sm:w-[40%] lg:w-auto"
          >
            <Link
              href={`/${globalPageProps.params.lng}/products?materials=${material.id}`}
              className={`${TILE} w-full outline-offset-4`}
              data-datocms-content-link-group
            >
              <div className={`${MEDIA} aspect-square`}>
                {material.details.image.responsiveImage && (
                  <DatoImage
                    fragment={material.details.image.responsiveImage}
                    className={IMG_ZOOM}
                    layout="fill"
                    objectFit="cover"
                    sizes={SIZES[columns]}
                  />
                )}
              </div>
              <h3 className="title-item mt-4 inline-flex items-center gap-2">
                {material.name}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="size-[1.125rem] shrink-0 stroke-2 transition-transform duration-200 group-hover:translate-x-1"
                />
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MaterialShowcase;
