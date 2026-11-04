import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { IMG_ZOOM } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import type { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import type { FragmentOf } from '@/lib/datocms/graphql';
import Price from './Price';

// Plain props, so any product query can feed the card. README "Where data and components live"
// lists the four queries that do: a new card field goes into each of them.
type Props = {
  href: string;
  name: string;
  brand?: string | null;
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
  /** Second product image, crossfaded in on hover-capable devices */
  hoverImage?: FragmentOf<typeof ResponsiveImageFragment> | null;
  price: number;
  salePrice?: number | null;
  onSale: boolean;
  currencySymbol: string;
  saleLabel?: string | null;
  sizes: string;
  priority?: boolean;
  titleAs?: 'h2' | 'h3' | 'p';
  /** lg: the larger card of the showcase's new-products grid */
  size?: 'md' | 'lg';
} & Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'children'>;

/**
 * In a grid the card spans 4 subgrid rows, so names, brands and prices line up: space the rows
 * with --card-row-gap, not row-gap. In a flex rail, wrap each card in a
 * grid-rows-[auto_auto_1fr_auto] element: Chrome collapses subgrid rows without a grid parent.
 */
export default function ProductCard({
  href,
  name,
  brand,
  image,
  hoverImage,
  price,
  salePrice,
  onSale,
  currencySymbol,
  saleLabel,
  sizes,
  priority = false,
  titleAs: Title = 'h3',
  size = 'md',
  className,
  ...rest
}: Props) {
  return (
    <Link
      {...rest}
      // Content Link: the whole card opens the product record
      data-datocms-content-link-group
      href={href}
      // "product" view transition: this photo flies to the product page (view-transitions.css)
      transitionTypes={['product']}
      className={[
        'group relative row-span-4 mb-(--card-row-gap) grid grid-rows-subgrid content-start gap-y-0 outline-offset-4 focus-visible:z-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        // view-transitions.css flies this well's first child: keep the photo layer first
        data-morph="card"
        className="relative aspect-[4/5] overflow-hidden bg-mist"
      >
        <div className={`absolute inset-0 ${hoverImage ? '' : IMG_ZOOM}`}>
          {image && (
            <DatoImage
              fragment={image}
              layout="fill"
              objectFit="cover"
              sizes={sizes}
              priority={priority}
            />
          )}
        </div>
        {hoverImage && (
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 [@media(hover:hover)]:block"
          >
            <DatoImage
              fragment={hoverImage}
              layout="fill"
              objectFit="cover"
              sizes={sizes}
            />
          </div>
        )}
        {onSale && saleLabel && (
          <span className="tag-dark absolute top-3 left-3 z-10">
            {saleLabel}
          </span>
        )}
      </div>
      {/* text-wrap: the base heading balance splits compounds like Funnel-Neck at the hyphen */}
      <Title
        className={`line-clamp-3 pt-4 leading-snug font-semibold text-wrap text-ink ${size === 'lg' ? 'text-lg tracking-[-0.02em] lg:text-xl' : 'text-base'}`}
      >
        {name}
      </Title>
      {brand ? (
        <p className="pt-1 text-sm text-mute">{brand}</p>
      ) : (
        <span aria-hidden="true" />
      )}
      <Price
        price={price}
        salePrice={salePrice}
        onSale={onSale}
        currencySymbol={currencySymbol}
        size={size === 'lg' ? 'md' : 'sm'}
        className="pt-2.5 text-ink"
      />
    </Link>
  );
}
