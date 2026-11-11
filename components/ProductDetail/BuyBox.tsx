'use client';

import { HeartIcon, TruckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/app/[lng]/product/[slug]/meta';
import DemoActionButton from '@/components/Common/DemoActionButton';
import Price from '@/components/ProductCard/Price';
import { readFragment } from '@/lib/datocms/graphql';
import { productsPath } from '@/lib/routes';
import ColorOptions from './ColorOptions';
import { type ProductPageLabels, ProductPageLabelsFragment } from './fragments';
import SizeOptions from './SizeOptions';
import StarRating from './StarRating';
import { firstAvailableSize, sizesOf, type Variation } from './sizes';
import { BUY_BOX_COLUMN } from './styles';
import { useBuyBoxHeight } from './useBuyBoxHeight';

type Props = {
  product: Product;
  labels: ProductPageLabels;
  lng: string;
};

export default function BuyBox({ product, labels, lng }: Props) {
  const variations = product.productVariations;

  const [selectedVariationId, setSelectedVariationId] = useState(
    variations[0]?.id,
  );

  const [selectedSize, setSelectedSize] = useState(
    firstAvailableSize(variations[0]),
  );

  const { ref, style } = useBuyBoxHeight();

  const {
    reviews,
    color,
    size,
    currencySymbol,
    priceUndertext,
    shippingText,
    primaryButton,
    secondaryButton,
  } = readFragment(ProductPageLabelsFragment, labels) ?? {};

  const selectedVariation =
    variations.find((variation) => variation.id === selectedVariationId) ??
    variations[0];
  const availableSizes = sizesOf(selectedVariation);

  const selectVariation = (variation: Variation) => {
    setSelectedVariationId(variation.id);
    setSelectedSize(firstAvailableSize(variation));
  };

  return (
    <div
      ref={ref}
      style={style}
      className={`enter-stagger pt-7 md:pt-8 lg:sticky lg:top-[min(calc(var(--header-h)_+_2rem),calc(100vh_-_var(--buy-box-h,0px)_-_2rem))] lg:self-start lg:pt-0 ${BUY_BOX_COLUMN}`}
    >
      {/* Both links reach 44px through ::after, so their focus rings hug the text */}
      <Link
        href={productsPath(lng, { brands: product.brand.id })}
        className="eyebrow relative block w-fit underline-offset-4 after:absolute after:-inset-y-2.5 after:inset-x-0 hover:underline"
      >
        {product.brand.name}
      </Link>
      {/* text-pretty, not balance: balance splits compound names at the hyphen */}
      <h1 className="title-section mt-3 text-pretty lg:max-xl:text-[2.75rem]">
        {product.name}
      </h1>
      <a
        href="#reviews"
        className="group relative mt-4 flex min-h-6 w-fit items-center gap-2.5 text-sm after:absolute after:-inset-y-2.5 after:inset-x-0"
      >
        <StarRating value={product.reviewAverage} />
        <span className="text-ink-2 underline decoration-line underline-offset-4 transition-colors group-hover:text-ink group-hover:decoration-ink">
          <span className="tabular-nums">{product.numberOfReviews}</span>{' '}
          {reviews}
        </span>
      </a>

      <div className="mt-6">
        <Price
          price={product.price}
          salePrice={product.salePrice}
          onSale={product.onSale}
          currencySymbol={currencySymbol ?? ''}
          size="lg"
        />
        {priceUndertext && (
          <p className="mt-1 text-sm text-mute">{priceUndertext}</p>
        )}
      </div>

      <div className="mt-8 border-t border-line pt-6 md:grid md:grid-cols-2 md:gap-x-10 lg:block">
        <ColorOptions
          label={color}
          variations={variations}
          selectedId={selectedVariation?.id}
          onSelect={selectVariation}
        />
        <SizeOptions
          label={size}
          availableSizes={availableSizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
      </div>

      <div className="mt-8 grid gap-2 md:grid-cols-2 lg:grid-cols-1">
        <div className="flex gap-2">
          <DemoActionButton className="btn flex-1">
            {primaryButton}
          </DemoActionButton>
          <DemoActionButton
            aria-label="Add to wishlist"
            className="icon-btn size-13 border border-line-strong hover:border-ink"
          >
            <HeartIcon aria-hidden="true" />
          </DemoActionButton>
        </div>
        <DemoActionButton className="btn-line w-full">
          {secondaryButton}
        </DemoActionButton>
      </div>

      {shippingText && (
        <p className="mt-6 flex items-center gap-3 border-t border-line pt-5 text-sm font-medium">
          <TruckIcon aria-hidden="true" className="size-5 shrink-0" />
          {shippingText}
        </p>
      )}
    </div>
  );
}
