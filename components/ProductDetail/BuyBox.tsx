'use client';

import { stripStega } from '@datocms/content-link';
import { CheckIcon, HeartIcon, TruckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import type { Query as ProductQuery } from '@/app/[lng]/product/[slug]/meta';
import Price from '@/components/ProductCard/Price';
import { contrast, hexToRgb, WHITE } from '@/lib/color';
import { readFragment } from '@/lib/datocms/graphql';
import { type ProductPageLabels, ProductPageLabelsFragment } from './fragments';
import StarRating from './StarRating';
import { BUY_BOX_COLUMN } from './styles';

type Product = NonNullable<ProductQuery['product']>;
type Variation = Product['productVariations'][number];

type Props = {
  product: Product;
  labels: ProductPageLabels;
  lng: string;
  isOnSale: boolean;
};

const SIZE_ORDER = ['xs', 's', 'm', 'l', 'xl'];

// availableSizes is a JSON field (checkbox editor) holding size codes; narrow it to string[]
const sizesOf = (variation?: Variation) =>
  (variation?.availableSizes as Array<string> | null | undefined) ?? [];

const firstAvailableSize = (variation?: Variation) => {
  const available = sizesOf(variation);
  return SIZE_ORDER.find((size) => available.includes(size)) ?? available[0];
};

export default function BuyBox({ product, labels, lng, isOnSale }: Props) {
  const variations = product.productVariations;

  const [selectedVariationId, setSelectedVariationId] = useState(
    variations[0]?.id,
  );

  const [selectedSize, setSelectedSize] = useState(
    firstAvailableSize(variations[0]),
  );

  // A buy box taller than the viewport sticks by its bottom edge, so its actions stay in view
  const buyBoxRef = useRef<HTMLDivElement>(null);
  const [buyBoxHeight, setBuyBoxHeight] = useState<number>();
  useEffect(() => {
    const box = buyBoxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(() =>
      setBuyBoxHeight(box.offsetHeight),
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

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
      ref={buyBoxRef}
      style={
        buyBoxHeight
          ? ({ '--buy-box-h': `${buyBoxHeight}px` } as CSSProperties)
          : undefined
      }
      className={`enter-stagger pt-7 md:pt-8 lg:sticky lg:top-[min(calc(var(--header-h)_+_2rem),calc(100vh_-_var(--buy-box-h,0px)_-_2rem))] lg:self-start lg:pt-0 ${BUY_BOX_COLUMN}`}
    >
      {/* Both links reach 44px through ::after, so their focus rings hug the text */}
      <Link
        href={`/${lng}/products?brands=${product.brand.id}`}
        className="eyebrow relative block w-fit underline-offset-4 after:absolute after:-inset-y-2.5 after:inset-x-0 hover:underline"
      >
        {product.brand.name}
      </Link>
      {/* 44px between lg and xl, where the buy box is narrowest; pretty keeps compound names
          whole where balance would split them at their hyphen */}
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
          onSale={isOnSale}
          currencySymbol={currencySymbol ?? ''}
          size="lg"
        />
        {priceUndertext && (
          <p className="mt-1 text-sm text-mute">{priceUndertext}</p>
        )}
      </div>

      {/* Tablets: color and size side by side, then the two actions side by side */}
      <div className="mt-8 border-t border-line pt-6 md:grid md:grid-cols-2 md:gap-x-10 lg:block">
        <div>
          <p id="pdp-color-label" className="text-sm font-semibold">
            {color}
          </p>
          <fieldset
            aria-labelledby="pdp-color-label"
            className="mt-3 flex min-w-0 flex-wrap gap-2"
          >
            {variations.map((variation) => {
              const hex = stripStega(variation.color.hex);
              const rgb = hexToRgb(hex);
              const light = rgb ? contrast(rgb, WHITE) < 3 : false;
              const selected = variation.id === selectedVariation?.id;
              return (
                // Selected: a 2px ink frame and a tick, so it reads apart from the outer focus ring
                <button
                  key={variation.id}
                  type="button"
                  aria-label={`${color ?? 'Color'}: ${hex}`}
                  aria-pressed={selected}
                  onClick={() => selectVariation(variation)}
                  className="press grid size-12 place-items-center border border-line hover:border-ink aria-pressed:border-2 aria-pressed:border-ink"
                >
                  <span
                    style={{ backgroundColor: hex }}
                    className={`grid size-9 place-items-center forced-color-adjust-none ${light ? 'border border-line-strong text-ink' : 'text-white'}`}
                  >
                    {selected && (
                      <CheckIcon
                        aria-hidden="true"
                        className="size-[1.125rem] animate-pop stroke-[2.25]"
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </fieldset>
        </div>

        <div className="mt-6 md:mt-0 lg:mt-6">
          <p id="pdp-size-label" className="text-sm font-semibold">
            {size}{' '}
            <span className="ml-1 font-medium text-mute tabular-nums">
              {selectedSize?.toUpperCase()}
            </span>
          </p>
          <fieldset
            aria-labelledby="pdp-size-label"
            className="mt-3 grid min-w-0 grid-cols-5 gap-2"
          >
            {SIZE_ORDER.map((sizeOption) => {
              const available = availableSizes.includes(sizeOption);
              return (
                <button
                  key={sizeOption}
                  type="button"
                  disabled={!available}
                  aria-pressed={
                    available ? selectedSize === sizeOption : undefined
                  }
                  onClick={() => setSelectedSize(sizeOption)}
                  className="chip h-12 px-0 text-base font-semibold tabular-nums"
                >
                  {sizeOption.toUpperCase()}
                </button>
              );
            })}
          </fieldset>
        </div>
      </div>

      <div className="mt-8 grid gap-2 md:grid-cols-2 lg:grid-cols-1">
        <div className="flex gap-2">
          <button type="button" className="btn flex-1">
            {primaryButton}
          </button>
          <button
            type="button"
            aria-label="Add to wishlist"
            className="icon-btn size-13 border border-line-strong hover:border-ink"
          >
            <HeartIcon aria-hidden="true" />
          </button>
        </div>
        <button type="button" className="btn-line w-full">
          {secondaryButton}
        </button>
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
