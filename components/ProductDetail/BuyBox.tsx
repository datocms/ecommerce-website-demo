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
import DatoImage from '@/components/DatoImage';
import Price from '@/components/ProductCard/Price';
import { contrast, hexToRgb, WHITE } from '@/lib/color';
import { readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import { ProductGeneralInterfaceFragment } from './fragments';
import StarRating from './StarRating';
import { PDP_RAIL } from './styles';

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

const BuyBox = ({ data, globalPageProps }: Props) => {
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

  // Phones swipe one photo at a time and tablets two, edge to edge. From lg they stack beside the
  // buy box; three or more keep the lead photo full width and pair the rest (a last odd one spans
  // the row too), so a long gallery doesn't turn into a column of huge photos
  const paired = images.length >= 3;
  const spansRow = (index: number) =>
    !paired ||
    index === 0 ||
    (index === images.length - 1 && images.length % 2 === 0);

  return (
    <div className="shell grid lg:grid-cols-12 lg:gap-4 lg:pt-8">
      <div className="relative -mx-(--gutter) min-w-0 lg:col-span-6 lg:mx-0">
        <section
          ref={galleryRef}
          aria-label={product.name}
          tabIndex={galleryScrolls ? 0 : undefined}
          onScroll={handleGalleryScroll}
          className={`no-scrollbar peer flex snap-x snap-mandatory gap-1 overflow-x-auto focus-visible:outline-hidden lg:grid lg:snap-none lg:gap-4 lg:overflow-visible ${paired ? 'lg:grid-cols-2' : ''}`}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              data-morph={index === 0 ? 'pdp' : undefined}
              className={`relative aspect-[4/5] w-full shrink-0 snap-start overflow-hidden bg-mist lg:w-auto ${images.length > 1 ? 'sm:w-[calc(50%-0.125rem)]' : ''} ${paired && spansRow(index) ? 'lg:col-span-2' : ''}`}
            >
              {image.responsiveImage && (
                <DatoImage
                  fragment={image.responsiveImage}
                  layout="fill"
                  objectFit="cover"
                  sizes={
                    spansRow(index)
                      ? '(min-width: 1440px) 672px, (min-width: 1024px) 47vw, (min-width: 640px) 50vw, 100vw'
                      : '(min-width: 1440px) 328px, (min-width: 1024px) 23vw, (min-width: 640px) 50vw, 100vw'
                  }
                  priority={index === 0}
                />
              )}
              {/* While the photo bleeds, the tag sits on the text's gutter */}
              {index === 0 && isOnSale && sale && (
                <span className="tag-dark absolute top-(--gutter) left-(--gutter) z-10 lg:top-4 lg:left-4">
                  {sale}
                </span>
              )}
            </div>
          ))}
        </section>
        {/* The scroller runs edge to edge on phones, so its focus ring is drawn inside it: ink
            with a white line inside, visible on light and dark photo edges alike */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 hidden border-4 border-white outline-2 -outline-offset-2 outline-ink peer-focus-visible:block"
        />
        {images.length > 1 && (
          <span
            aria-hidden="true"
            className="tag absolute right-(--gutter) bottom-(--gutter) z-10 sm:hidden"
          >
            {currentSlide + 1} / {images.length}
          </span>
        )}
        {images.length > 2 && (
          <span
            aria-hidden="true"
            className="tag absolute right-(--gutter) bottom-(--gutter) z-10 hidden sm:inline-flex lg:hidden"
          >
            {currentSlide + 1}–{Math.min(currentSlide + 2, images.length)} /{' '}
            {images.length}
          </span>
        )}
      </div>

      <div
        ref={buyBoxRef}
        style={
          buyBoxHeight
            ? ({ '--buy-box-h': `${buyBoxHeight}px` } as CSSProperties)
            : undefined
        }
        className={`enter-stagger pt-7 md:pt-8 lg:sticky lg:top-[min(calc(var(--header-h)_+_2rem),calc(100vh_-_var(--buy-box-h,0px)_-_2rem))] lg:self-start lg:pt-0 ${PDP_RAIL}`}
      >
        {/* Both links reach 44px through ::after, so their focus rings hug the text */}
        <Link
          href={`/${globalPageProps.params.lng}/products?brands=${product.brand.id}`}
          className="eyebrow relative block w-fit underline-offset-4 after:absolute after:-inset-y-2.5 after:inset-x-0 hover:underline"
        >
          {product.brand?.name}
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
          <StarRating value={product.reviewAverage} size={16} />
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

        {/* Tablets: colour and size side by side, then the two actions side by side */}
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
    </div>
  );
};

export default BuyBox;
