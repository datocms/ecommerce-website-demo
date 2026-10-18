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
} & Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'children'>;

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
  className,
  ...rest
}: ProductCardProps) {
  return (
    <Link
      {...rest}
      href={href}
      className={[
        // In a grid parent the card spans 4 shared rows, so brand, name and price
        // line up across a row even when a name wraps. A parent row-gap would leak
        // into those rows, so grids space card rows with --card-row-gap instead.
        // Outside a grid (a flex rail) wrap each card in a grid-rows-[auto_auto_auto_1fr]
        // element: with no parent grid, Chrome collapses the subgrid rows.
        'group relative row-span-4 mb-(--card-row-gap) grid grid-rows-subgrid content-start gap-y-0 rounded-card bg-white p-1.5 focus-visible:z-10 sm:p-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-image bg-oat">
        <div
          className={`absolute inset-0 ${hoverImage ? '' : 'transition-transform duration-500 ease-out group-hover:scale-[1.03]'}`}
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
            className="absolute inset-0 hidden opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 [@media(hover:hover)]:block"
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
          <span className="badge absolute top-2.5 left-2.5 z-10 bg-sale text-white sm:top-3 sm:left-3">
            {saleLabel}
          </span>
        )}
      </div>
      {brand ? (
        <p className="px-2 pt-3.5 text-xs font-semibold text-muted sm:px-2.5 sm:pt-4">
          {brand}
        </p>
      ) : (
        <span aria-hidden="true" className="pt-3.5 sm:pt-4" />
      )}
      <Title className="line-clamp-2 px-2 pt-1 text-md font-semibold text-ink sm:px-2.5">
        {name}
      </Title>
      <Price
        price={price}
        salePrice={salePrice}
        onSale={onSale}
        currencySymbol={currencySymbol}
        className="px-2 pt-2.5 pb-2.5 text-ink sm:px-2.5"
      />
    </Link>
  );
}
