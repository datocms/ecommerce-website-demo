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

type CaptionProps = {
  name: string;
  partnerName?: string;
  shopNow: string | null | undefined;
  compact: boolean;
};

function Caption({ name, partnerName, shopNow, compact }: CaptionProps) {
  if (compact) {
    return <span className="mt-2.5 text-sm font-semibold">{name}</span>;
  }

  return (
    <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      {/* The partner tile's name sits invisibly in the same cell, so both captions wrap the
          same way */}
      <span className="grid min-w-0 text-base font-semibold text-pretty">
        <span className="col-start-1 row-start-1">{name}</span>
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
  );
}

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
  const isBrand = item._modelApiKey === 'brand';

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
          (isBrand ? (
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
      <Caption
        name={item.name}
        partnerName={partnerName}
        shopNow={shopNow}
        compact={compact}
      />
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
  // Trending first, then New. Each tile sizes its caption to the other's name.
  const trending = { item: category.trending, tag: generalInterface?.trending };
  const arrival = { item: category.newArrival, tag: generalInterface?.new };

  // A fragment, so the tiles stay direct children of the caller's grid
  return (
    <>
      <FeatureTile
        item={trending.item}
        href={productsHref(lng, trending.item)}
        tag={trending.tag}
        shopNow={generalInterface?.shopNow}
        sizes={sizes}
        onNavigate={onNavigate}
        // Stripped: the invisible copy must not become a second visual-editing target
        partnerName={stripStega(arrival.item.name)}
        compact={compact}
      />
      <FeatureTile
        item={arrival.item}
        href={productsHref(lng, arrival.item)}
        tag={arrival.tag}
        shopNow={generalInterface?.shopNow}
        sizes={sizes}
        onNavigate={onNavigate}
        partnerName={stripStega(trending.item.name)}
        compact={compact}
      />
    </>
  );
}
