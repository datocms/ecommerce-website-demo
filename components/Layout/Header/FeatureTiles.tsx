import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { type DropdownMenu, type FeaturedItem, productsHref } from './menu';

type FeatureTileProps = {
  item: FeaturedItem;
  href: string;
  tag: string | null | undefined;
  shopNow: string | null | undefined;
  sizes: string;
  onNavigate: () => void;
  /** The other tile's name, so both captions lay out the same */
  partnerName?: string;
  compact?: boolean;
};

// One featured record: a 4:3 photo (or a brand's logo) with its tag, the name below. In the mega
// menu the pair shares subgrid rows, so both photos stay the same height.
function FeatureTile({
  item,
  href,
  tag,
  shopNow,
  sizes,
  onNavigate,
  partnerName,
  compact = false,
}: FeatureTileProps) {
  const image = item.image.responsiveImage;
  const brand = item._modelApiKey === 'brand';

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group min-w-0 outline-offset-4 ${compact ? 'flex flex-col' : 'row-span-2 grid grid-rows-subgrid'}`}
    >
      <span
        // Stretched in the mega menu: w-full, or the ratio would size the width from the height
        className={`${MEDIA} block aspect-[4/3] ${compact ? '' : 'w-full self-stretch'}`}
      >
        {image &&
          (brand ? (
            // Inset 19%, but never closer than 8px to the tag above
            <span className="absolute inset-x-[19%] top-[max(19%,3rem)] bottom-[max(19%,0.75rem)]">
              <DatoImage
                fragment={image}
                layout="fill"
                objectFit="contain"
                sizes={sizes}
                usePlaceholder={false}
                // Logos come on white: multiply drops the box onto the mist well
                imgClassName="mix-blend-multiply"
              />
            </span>
          ) : (
            <DatoImage
              fragment={image}
              layout="fill"
              objectFit="cover"
              // Portraits keep their faces in the landscape crop
              objectPosition="50% 20%"
              sizes={sizes}
              className={IMG_ZOOM}
            />
          ))}
        {tag && <span className="tag absolute top-3 left-3">{tag}</span>}
      </span>
      {compact ? (
        <span className="mt-2.5 text-sm font-semibold">{item.name}</span>
      ) : (
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          {/* The partner tile's name sits invisibly in the same cell, so both captions wrap the
              same way */}
          <span className="grid min-w-0 text-base font-semibold text-pretty">
            <span className="col-start-1 row-start-1">{item.name}</span>
            {partnerName && (
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1"
              >
                {partnerName}
              </span>
            )}
          </span>
          {shopNow && (
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium">
              {shopNow}
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 stroke-2 transition-transform duration-200 group-hover:translate-x-0.75"
              />
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

type Props = {
  category: DropdownMenu;
  generalInterface: LayoutQuery['generalInterface'];
  lng: string;
  sizes: string;
  onNavigate: () => void;
  /** The mobile menu's variant: the name only, no "Shop now" */
  compact?: boolean;
};

// A dropdown's two featured records as tiles
export default function FeatureTiles({
  category,
  generalInterface,
  lng,
  sizes,
  onNavigate,
  compact,
}: Props) {
  // Trending first, then New. Keyed by slot: one record can fill both.
  const slots = [
    {
      slot: 'trending',
      item: category.trending,
      tag: generalInterface?.trending,
    },
    { slot: 'new', item: category.newArrival, tag: generalInterface?.new },
  ];

  // A fragment, so the tiles stay direct children of the caller's grid
  return (
    <>
      {slots.map(({ slot, item, tag }, index) => (
        <FeatureTile
          key={slot}
          item={item}
          href={productsHref(lng, item)}
          tag={tag}
          shopNow={generalInterface?.shopNow}
          sizes={sizes}
          onNavigate={onNavigate}
          // Stripped: the invisible copy must not become a second visual-editing target
          partnerName={stripStega(slots[1 - index].item.name)}
          compact={compact}
        />
      ))}
    </>
  );
}
