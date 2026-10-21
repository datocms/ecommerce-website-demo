import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import DatoImage from '@/components/DatoImage';
import type { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import type { FragmentOf } from '@/lib/datocms/graphql';
import Price from './Price';

type ProductCardProps = {
  href: string;
  name: string;
  brand?: string | null;
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
  /** Second product image, crossfaded in on hover-capable devices */
  hoverImage?: FragmentOf<typeof ResponsiveImageFragment> | null;
  price: number;
  salePrice?: number | null;
  /** Caller compares with stripStega(product.sale) === 'on_sale' */
  onSale: boolean;
  currencySymbol: string;
  saleLabel?: string | null;
  sizes: string;
  priority?: boolean;
  titleAs?: 'h2' | 'h3' | 'p';
  /** md: 16px name (grids, rails); lg: 18px name, 20px from lg, and 18px price (spotlights) */
  size?: 'md' | 'lg';
} & Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'children'>;

// No box: a 4:5 photo on mist, then name, brand and price on the page itself
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
}: ProductCardProps) {
  return (
    <Link
      {...rest}
      href={href}
      // Its lead photo flies to the product page's (morph in global.css)
      transitionTypes={['product']}
      className={[
        // In a grid parent the card spans 4 shared rows, so name, brand and price
        // line up across a row even when a name wraps. A parent row-gap would leak
        // into those rows, so grids space card rows with --card-row-gap instead.
        // Outside a grid (a flex rail) wrap each card in a grid-rows-[auto_auto_1fr_auto]
        // element: with no parent grid, Chrome collapses the subgrid rows. The brand row
        // takes the slack there, so prices line up across the rail.
        'group relative row-span-4 mb-(--card-row-gap) grid grid-rows-subgrid content-start gap-y-0 outline-offset-4 focus-visible:z-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        data-morph="card"
        className="relative aspect-[4/5] overflow-hidden bg-mist"
      >
        <div
          className={`absolute inset-0 ${hoverImage ? '' : 'transition-transform duration-700 ease-out group-hover:scale-[1.03]'}`}
        >
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
      {/* Greedy wrap: the base h1-h3 balance (and pretty) move the break to the hyphen of a
          compound such as Funnel-Neck. Three lines leave room for long localized names. */}
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
