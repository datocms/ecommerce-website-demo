import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DatoImage from '@/components/DatoImage';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { IMG_ZOOM, TILE_CARD, TILE_MEDIA, TILE_TEXT } from '../ui';
import { MaterialShowcaseFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof MaterialShowcaseFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** General interface "Shop now" label, shown as the tiles' pill */
  shopNow?: string | null;
};

// A snap rail that bleeds off the right edge until md (three cards are too narrow for the
// material names and the pill below that); a grid from md
const RAIL =
  'no-scrollbar -mx-(--gutter) -my-1 flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) py-1 sm:gap-4 md:mx-0 md:my-0 md:grid md:overflow-visible md:px-0 md:py-0';

const GRID_COLUMNS = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
} as const;

// Image sizes that follow the column count at each breakpoint
const SIZES = {
  2: '(min-width: 768px) 48vw, 76vw',
  3: '(min-width: 768px) 32vw, 76vw',
  4: '(min-width: 1024px) 24vw, (min-width: 768px) 48vw, 76vw',
} as const;

const MaterialShowcase = ({ fragment, globalPageProps, shopNow }: Props) => {
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

  return (
    <section aria-labelledby={titleId} className="shell pt-(--section-gap)">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-6">
          <h2 id={titleId} className="h-xl">
            {title}
          </h2>
          {description && (
            <p className="mt-5 max-w-[26em] text-[1.1875rem] leading-[1.45] font-medium text-pretty lg:text-[1.375rem]">
              {description}
            </p>
          )}
        </div>
        {subDescription && (
          <p className="max-w-[54ch] text-md leading-[1.6] text-pretty text-ink/80 lg:col-span-6 lg:col-start-7 lg:text-lg lg:leading-[1.6] xl:col-span-5 xl:col-start-8">
            {subDescription}
          </p>
        )}
      </div>

      {/* A tile with keyboard focus becomes the rail's only snap point: one tile shows at a time
          on phones, so the next one always needs scrolling into view */}
      <div className="mt-8 lg:mt-12">
        <ul className={`${RAIL} ${GRID_COLUMNS[columns]}`}>
          {materials.map((material) => (
            <li
              key={material.id}
              className="flex w-[76vw] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none [ul:has(:focus-visible)>&:not(:has(:focus-visible))]:snap-align-none"
            >
              <Link
                href={`/${globalPageProps.params.lng}/products?materials=${material.id}`}
                className={`${TILE_CARD} w-full`}
                data-datocms-content-link-group
              >
                <div
                  aria-hidden="true"
                  className={`${TILE_MEDIA} aspect-[4/3]`}
                >
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
                <div className={TILE_TEXT}>
                  <span className="title-md wrap-break-word hyphens-auto">
                    {material.name}
                  </span>
                  {shopNow && (
                    <span className="btn-secondary btn-sm">
                      {shopNow}
                      <ArrowRightIcon aria-hidden="true" />
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MaterialShowcase;
