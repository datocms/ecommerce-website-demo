'use client';

import { stripStega } from '@datocms/content-link';
import { CheckIcon, HeartIcon, TruckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  type CSSProperties,
  type UIEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Query as ProductQuery } from '@/app/[lng]/product/[slug]/meta';
import Price from '@/components/Common/Price';
import StarRating from '@/components/Common/StarRating';
import { ProductGeneralInterfaceFragment } from '@/components/Products/Product/GeneralInferface/fragments';
import { readFragment } from '@/lib/datocms/graphql';
import { contrast, hexToRgb, WHITE } from '@/utils/color';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import DatoImage from '../DatoImage';

type Props = {
  data: ProductQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

type Variation = NonNullable<
  ProductQuery['product']
>['productVariations'][number];

const allSizes = ['xs', 's', 'm', 'l', 'xl'];

//narrow down of json field with checkbox field editor
const sizesOf = (variation?: Variation) =>
  (variation?.availableSizes as Array<string> | null | undefined) ?? [];

const firstAvailableSize = (variation?: Variation) => {
  const available = sizesOf(variation);
  return allSizes.find((size) => available.includes(size)) ?? available[0];
};

const ProductView = ({ data, globalPageProps }: Props) => {
  if (!data.product) notFound();

  const { product } = data;
  const variations = product.productVariations;
  const images = product.productImages;

  const [selectedVariationId, setSelectedVariationId] = useState(
    variations[0]?.id,
  );

  const [selectedSize, setSelectedSize] = useState(
    firstAvailableSize(variations[0]),
  );

  // First photo in view: phones show one at a time, tablets two
  const [currentSlide, setCurrentSlide] = useState(0);

  // The gallery is a tab stop only while it scrolls (not once the photos stack from lg)
  const galleryRef = useRef<HTMLElement>(null);
  const [galleryScrolls, setGalleryScrolls] = useState(true);
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const observer = new ResizeObserver(() =>
      setGalleryScrolls(gallery.scrollWidth > gallery.clientWidth + 1),
    );
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

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

  const isOnSale = stripStega(product.sale || '') === 'on_sale';

  const {
    sale,
    reviews,
    color,
    size,
    currencySymbol,
    priceUndertext,
    shippingText,
    primaryButton,
    secondaryButton,
  } =
    readFragment(ProductGeneralInterfaceFragment, data.generalInterface) ?? {};

  const selectedVariation =
    variations.find((variation) => variation.id === selectedVariationId) ??
    variations[0];
  const availableSizes = sizesOf(selectedVariation);

  const selectVariation = (variation: Variation) => {
    setSelectedVariationId(variation.id);
    setSelectedSize(firstAvailableSize(variation));
  };

  const handleGalleryScroll = (event: UIEvent<HTMLElement>) => {
    const { scrollLeft, children } = event.currentTarget;
    const first = children[0] as HTMLElement | undefined;
    const second = children[1] as HTMLElement | undefined;
    if (!first) return;
    const pitch = second
      ? second.offsetLeft - first.offsetLeft
      : first.clientWidth;
    if (!pitch) return;
    const slide = Math.round(scrollLeft / pitch);
    setCurrentSlide(Math.min(Math.max(slide, 0), images.length - 1));
  };

  // Phones swipe one photo at a time, tablets two. From lg the photos stack beside the buy box,
  // and from xl three or more pair up (an odd first one spans the row)
  const paired = images.length >= 3;
  const oddImageCount = images.length % 2 === 1;

  return (
    <div className="shell grid gap-3 pt-1 sm:gap-4 lg:grid-cols-12 lg:gap-5">
      <div className="relative min-w-0 lg:col-span-7">
        <section
          ref={galleryRef}
          aria-label={product.name}
          tabIndex={galleryScrolls ? 0 : undefined}
          onScroll={handleGalleryScroll}
          className={`no-scrollbar peer flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-nav focus-visible:outline-hidden lg:grid lg:snap-none lg:gap-4 lg:overflow-visible ${paired ? 'xl:grid-cols-2' : ''}`}
        >
          {images.map((image, index) => {
            const spansRow = paired && oddImageCount && index === 0;
            return (
              <div
                key={image.id}
                className={`relative aspect-[4/5] w-full shrink-0 snap-start overflow-hidden rounded-nav bg-oat sm:w-[calc((100%-0.75rem)/2)] lg:w-auto ${spansRow ? 'xl:col-span-2' : ''}`}
              >
                {image.responsiveImage && (
                  <DatoImage
                    fragment={image.responsiveImage}
                    layout="fill"
                    objectFit="cover"
                    sizes={
                      paired && !spansRow
                        ? '(min-width: 1440px) 390px, (min-width: 1280px) 28vw, (min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw'
                        : '(min-width: 1440px) 790px, (min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw'
                    }
                    priority={index === 0}
                  />
                )}
                {index === 0 && isOnSale && sale && (
                  <span className="badge absolute top-4 left-4 z-10 bg-sale text-white">
                    {sale}
                  </span>
                )}
              </div>
            );
          })}
        </section>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 hidden rounded-nav outline-2 outline-offset-2 outline-ink peer-focus-visible:block"
        />
        {images.length > 1 && (
          <span
            aria-hidden="true"
            className="badge absolute right-4 bottom-4 z-10 sm:hidden"
          >
            {currentSlide + 1} / {images.length}
          </span>
        )}
        {images.length > 2 && (
          <span
            aria-hidden="true"
            className="badge absolute right-4 bottom-4 z-10 hidden sm:inline-flex lg:hidden"
          >
            {currentSlide + 1}–{Math.min(currentSlide + 2, images.length)} /{' '}
            {images.length}
          </span>
        )}
      </div>

      {/* Tablets: product and shipping on the left, options on the right */}
      <div
        ref={buyBoxRef}
        style={
          buyBoxHeight
            ? ({ '--buy-box-h': `${buyBoxHeight}px` } as CSSProperties)
            : undefined
        }
        className="rounded-card bg-white p-(--card-pad) md:grid md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-10 lg:sticky lg:top-[min(calc(var(--header-h)_+_1rem),calc(100vh_-_var(--buy-box-h,0px)_-_1rem))] lg:col-span-5 lg:block lg:self-start"
      >
        <div>
          <Link
            href={`/${globalPageProps.params.lng}/products?brands=${product.brand.id}`}
            className="eyebrow inline-flex min-h-6 items-center underline-offset-4 hover:underline"
          >
            {product.brand?.name}
          </Link>
          <h1 className="title-lg mt-3">{product.name}</h1>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div>
              <Price
                price={product.price}
                salePrice={product.salePrice}
                onSale={isOnSale}
                currencySymbol={currencySymbol ?? ''}
                size="lg"
              />
              {priceUndertext && (
                <p className="mt-0.5 text-sm text-muted">{priceUndertext}</p>
              )}
            </div>
            <a
              href="#reviews"
              className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-cream pr-4 pl-3.5 text-sm font-semibold transition-colors hover:bg-oat"
            >
              <StarRating value={product.reviewAverage} size={16} />
              <span className="tabular-nums">
                {product.numberOfReviews} {reviews}
              </span>
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-6 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:border-t-0 md:pt-1 lg:mt-6 lg:border-t lg:pt-6">
          <p id="pdp-color-label" className="text-sm font-bold">
            {color}
          </p>
          <fieldset
            aria-labelledby="pdp-color-label"
            className="mt-2 -ml-1.5 flex min-w-0 flex-wrap gap-1"
          >
            {variations.map((variation) => {
              const hex = stripStega(variation.color.hex);
              const rgb = hexToRgb(hex);
              const light = rgb ? contrast(rgb, WHITE) < 3 : false;
              const selected = variation.id === selectedVariation?.id;
              return (
                // Selected: an inner ink ring and a tick, so it reads apart from the outer focus ring
                <button
                  key={variation.id}
                  type="button"
                  aria-label={`${color ?? 'Color'}: ${hex}`}
                  aria-pressed={selected}
                  onClick={() => selectVariation(variation)}
                  className="grid size-12 place-items-center rounded-full ring-ink/30 transition-shadow ring-inset hover:ring-2 aria-pressed:ring-2 aria-pressed:ring-ink"
                >
                  <span
                    style={{ backgroundColor: hex }}
                    className={`grid size-9 place-items-center rounded-full ring-1 ring-inset ${light ? 'text-ink ring-border-strong' : 'text-white ring-ink/15'} forced-color-adjust-none`}
                  >
                    {selected && (
                      <CheckIcon
                        aria-hidden="true"
                        className="size-[1.125rem] stroke-[2.4]"
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </fieldset>

          <p id="pdp-size-label" className="mt-5 text-sm font-bold">
            {size}{' '}
            <span className="ml-1 font-semibold text-muted tabular-nums">
              {selectedSize?.toUpperCase()}
            </span>
          </p>
          <fieldset
            aria-labelledby="pdp-size-label"
            className="mt-3 grid min-w-0 grid-cols-5 gap-2"
          >
            {allSizes.map((sizeOption) => {
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
                  className="chip h-12 px-0 text-base font-bold tabular-nums"
                >
                  {sizeOption.toUpperCase()}
                </button>
              );
            })}
          </fieldset>

          <div className="mt-6 grid gap-2">
            <div className="flex gap-2">
              <button type="button" className="btn-primary flex-1">
                {primaryButton}
              </button>
              <button
                type="button"
                aria-label="Add to wishlist"
                className="icon-btn size-13 bg-white ring-1 ring-line ring-inset"
              >
                <HeartIcon aria-hidden="true" />
              </button>
            </div>
            <button type="button" className="btn-secondary w-full">
              {secondaryButton}
            </button>
          </div>
        </div>

        {shippingText && (
          <p className="mt-5 flex items-center gap-3 rounded-nav bg-cream p-3 text-sm font-semibold md:col-start-1 md:row-start-2 md:self-end">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white">
              <TruckIcon aria-hidden="true" className="size-[1.125rem]" />
            </span>
            {shippingText}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductView;
