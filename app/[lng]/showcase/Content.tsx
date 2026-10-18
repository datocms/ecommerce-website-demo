import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Price from '@/components/Common/Price';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  FOREST_CARD,
  IMG_ZOOM,
  PAGE_VARS,
  TILE_CARD,
  TILE_MEDIA,
  TILE_TEXT,
} from '@/components/Sections/ui';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { readFragment } from '@/lib/datocms/graphql';
import type { PageProps, Query } from './meta';

const hasImage = <T extends { responsiveImage?: unknown }>(
  item: T,
): item is T & { responsiveImage: NonNullable<T['responsiveImage']> } =>
  Boolean(item.responsiveImage);

// Materials photo frames per breakpoint: media query, frame width, frame aspect ratio
type Frame = [media: string, width: number, unit: 'px' | 'vw', ratio: number];
const MATERIAL_FRAMES: Record<'lone' | 'first' | 'second', Frame[]> = {
  lone: [
    ['(min-width: 1440px)', 710, 'px', 4 / 3],
    ['(min-width: 1280px)', 48, 'vw', 4 / 3],
    ['', 88, 'vw', 4 / 3],
  ],
  first: [
    ['(min-width: 1440px)', 390, 'px', 4 / 5],
    ['(min-width: 1280px)', 27, 'vw', 4 / 5],
    ['(min-width: 1024px)', 48, 'vw', 5 / 4],
    ['', 48, 'vw', 4 / 5],
  ],
  second: [
    ['(min-width: 1440px)', 300, 'px', 4 / 5],
    ['(min-width: 1280px)', 21, 'vw', 4 / 5],
    ['(min-width: 1024px)', 37, 'vw', 1],
    ['', 37, 'vw', 4 / 5],
  ],
};

// A photo wider than its frame is cropped by height, so its source must be wider than the frame
const coverSizes = (frames: Frame[], imageRatio: number) =>
  frames
    .map(([media, width, unit, ratio]) =>
      `${media} ${Math.ceil(width * Math.max(1, imageRatio / ratio))}${unit}`.trim(),
    )
    .join(', ');

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.showcase) {
    notFound();
  }

  const { lng } = globalPageProps.params;
  const {
    title,
    description,
    collections,
    newProductsTitle,
    newProducts,
    materialsTitle,
    materialsDescription,
  } = data.showcase;
  const cta = data.showcase.cta[0];
  const collectionsCta = data.showcase.collectionsCta[0];
  const currencySymbol = data.generalInterface?.currencySymbol ?? '';
  const saleLabel = data.generalInterface?.sale;
  const shopNow = data.generalInterface?.shopNow;
  const displays = data.showcase.displays.filter(hasImage).slice(0, 2);
  const loneDisplay = displays.length === 1;
  const materials = data.showcase.materialsDisplay.filter(hasImage).slice(0, 2);
  const loneMaterial = materials.length === 1;

  // A label over eight characters may not fit beside its arrow in the narrowest card columns,
  // so below md every card CTA drops the arrow and the pills stay alike across the page
  const cardCta = [collectionsCta?.label, shopNow].some(
    (label) => stripStega(label ?? '').length > 8,
  )
    ? 'max-md:[--btn-px:0.875rem] max-md:[&>svg]:hidden'
    : '';

  // An odd count would leave the last row a card short, so from lg the title takes the first cell
  const productCount = newProducts.length;
  const titleCell = productCount % 2 === 1;
  const arrivalsTitle = (
    <h2
      id="new-arrivals-title"
      className={`h-xl ${titleCell ? 'pb-5 sm:pb-4 lg:pt-2 lg:pb-0' : ''}`}
    >
      {newProductsTitle}
    </h2>
  );

  return (
    <div className={PAGE_VARS}>
      <section aria-labelledby="showcase-title" className="shell pt-1">
        <div
          className={`grid grid-cols-2 gap-3 sm:gap-4 ${
            displays.length === 0
              ? ''
              : loneDisplay
                ? 'xl:min-h-(--hero-h) xl:grid-cols-[minmax(0,1.38fr)_minmax(0,2fr)]'
                : 'xl:min-h-(--hero-h) xl:grid-cols-[minmax(0,1fr)_minmax(0,1.38fr)_minmax(0,1fr)]'
          }`}
        >
          <div
            className={`col-span-2 flex flex-col ${FOREST_CARD} ${displays.length > 0 ? 'xl:col-span-1 xl:justify-center' : ''}`}
          >
            <h1 id="showcase-title" className="sc-title max-w-[13em]">
              {title}
            </h1>
            {(description || cta) && (
              <div className="mt-6 sm:mt-8">
                {description && (
                  <p className="max-w-[36em] text-md/[1.6] text-pretty text-cream/85 xl:text-lg/[1.6]">
                    {description}
                  </p>
                )}
                {cta && (
                  <Link
                    href={`/${lng}/${stripStega(cta.slug)}`}
                    className={`btn-butter ${description ? 'mt-8' : ''}`}
                  >
                    {cta.label}
                    <ArrowRightIcon />
                  </Link>
                )}
              </div>
            )}
          </div>
          {displays.map(({ id, responsiveImage }, i) => (
            <div
              key={id}
              className={`relative overflow-hidden rounded-card bg-oat xl:aspect-auto ${
                loneDisplay
                  ? 'col-span-2 aspect-[4/5] sm:aspect-[3/2] xl:col-span-1'
                  : `aspect-[3/4] ${i === 0 ? 'xl:order-first' : ''}`
              }`}
            >
              <DatoImage
                fragment={responsiveImage}
                layout="fill"
                objectFit="cover"
                objectPosition={
                  loneDisplay ? '50% 12%' : i === 0 ? '50% 20%' : '50% 25%'
                }
                sizes={
                  loneDisplay
                    ? '(min-width: 1280px) 58vw, 100vw'
                    : '(min-width: 1440px) 400px, (min-width: 1280px) 28vw, 50vw'
                }
                priority
              />
            </div>
          ))}
        </div>
      </section>

      {collectionsCta && collections.length > 0 && (
        <section
          aria-label={
            stripStega(data.generalInterface?.collection ?? '') || undefined
          }
          className="shell pt-3 sm:pt-4"
        >
          <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {collections.map((collection) => (
              <li key={collection.id} className="flex">
                <Link
                  href={`/${lng}/${stripStega(collectionsCta.slug)}${collection.id}`}
                  className={`${TILE_CARD} w-full`}
                  data-datocms-content-link-group
                >
                  <div
                    aria-hidden="true"
                    className={`${TILE_MEDIA} aspect-[4/5]`}
                  >
                    {collection.details.image.responsiveImage && (
                      <DatoImage
                        fragment={collection.details.image.responsiveImage}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="50% 30%"
                        sizes="(min-width: 1440px) 440px, (min-width: 640px) 31vw, 100vw"
                        className={IMG_ZOOM}
                      />
                    )}
                  </div>
                  {/* The CTAs line up even when a name wraps. Only long words that can't
                      fit the narrow tiles hyphenate */}
                  <div className={`${TILE_TEXT} flex-1`}>
                    <h2 className="title-md hyphens-auto text-pretty [hyphenate-limit-chars:10_4_4]">
                      {collection.name}
                    </h2>
                    <span className={`btn-primary btn-sm mt-auto ${cardCta}`}>
                      {collectionsCta.label}
                      <ArrowRightIcon />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {productCount > 0 && (
        <section
          aria-labelledby="new-arrivals-title"
          className="shell pt-(--section-gap)"
        >
          {!titleCell && arrivalsTitle}
          <div
            className={`grid gap-3 sm:gap-4 lg:grid-cols-2 ${titleCell ? '' : 'mt-8 lg:mt-10'}`}
          >
            {titleCell && arrivalsTitle}
            {newProducts.map((product) => {
              const onSale = stripStega(product.sale) === 'on_sale';
              const [image] = product.productImages;
              const thumbnails = product.productImages
                .filter(hasImage)
                .slice(0, 4);
              return (
                <Link
                  key={product.id}
                  href={`/${lng}/product/${stripStega(product.slug)}`}
                  className="group @container grid grid-cols-2 gap-2 rounded-card bg-white p-2"
                  data-datocms-content-link-group
                >
                  {/* The photo keeps 4:5; only on phones does it stretch to a taller text column */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-image bg-oat max-sm:self-stretch">
                    {image?.responsiveImage && (
                      <DatoImage
                        fragment={image.responsiveImage}
                        layout="fill"
                        objectFit="cover"
                        sizes="(min-width: 1440px) 324px, (min-width: 1024px) 23vw, 46vw"
                        className={IMG_ZOOM}
                      />
                    )}
                    {onSale && saleLabel && (
                      <span className="badge absolute top-3 left-3 bg-sale text-white">
                        {saleLabel}
                      </span>
                    )}
                  </div>
                  {/* On the smallest phones a step smaller name and less padding keep long words whole */}
                  <div className="flex min-w-0 flex-col p-3 @max-[19rem]:px-2 sm:p-6 lg:p-5 xl:p-7">
                    {product.brand?.name && (
                      <p className="mb-2 text-xs font-semibold text-muted sm:text-sm">
                        {product.brand.name}
                      </p>
                    )}
                    <h3 className="title-sm text-[1.375rem] leading-[1.08] break-words @max-[19rem]:text-xl sm:text-[1.875rem] lg:text-[1.625rem] xl:text-[2rem]">
                      {product.name}
                    </h3>
                    <Price
                      price={product.price}
                      salePrice={product.salePrice}
                      onSale={onSale}
                      currencySymbol={currencySymbol}
                      size="md"
                      className="mt-4 max-sm:text-md"
                    />
                    <div className="mt-auto pt-1 sm:pt-6">
                      {thumbnails.length > 1 && (
                        <div
                          aria-hidden="true"
                          className="mb-4 hidden max-w-[17rem] grid-cols-4 gap-2 sm:grid"
                        >
                          {thumbnails.map(({ id, responsiveImage }) => (
                            <div
                              key={id}
                              className="relative aspect-square overflow-hidden rounded-sm bg-oat ring-1 ring-line"
                            >
                              <DatoImage
                                fragment={responsiveImage}
                                layout="fill"
                                objectFit="cover"
                                sizes="64px"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {shopNow && (
                        <span
                          className={`btn-secondary btn-sm @max-[21rem]:hidden ${cardCta}`}
                        >
                          {shopNow}
                          <ArrowRightIcon />
                        </span>
                      )}
                    </div>
                  </div>
                  {/* On the narrowest phones the text column can't hold the pill on one line,
                      so it moves to a full-width row under the photo */}
                  {shopNow && (
                    <span
                      className={`btn-secondary btn-sm col-span-2 @min-[21rem]:hidden ${cardCta}`}
                    >
                      {shopNow}
                      <ArrowRightIcon />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section
        aria-labelledby="materials-title"
        className="shell pt-(--section-gap)"
      >
        <div
          className={`grid items-center gap-10 rounded-card bg-white p-5 sm:p-10 lg:p-12 xl:gap-12 xl:p-14 ${materials.length > 0 ? 'xl:grid-cols-12' : ''}`}
        >
          <div
            className={`@container ${
              materials.length > 0
                ? `xl:col-span-5 ${materialsDescription ? 'lg:grid lg:grid-cols-2 lg:items-end lg:gap-12 xl:block' : ''}`
                : ''
            }`}
          >
            {/* Chrome hyphenates a long word at a line end even when it would fit on the next
                line, so hyphenation stays on only where the title column is too narrow for it */}
            <h2
              id="materials-title"
              className="title-lg hyphens-auto [hyphenate-limit-chars:14_6_6] @min-[24.5rem]:max-lg:hyphens-manual"
            >
              {materialsTitle}
            </h2>
            {materialsDescription && (
              <p
                className={`mt-6 max-w-[52ch] text-md/[1.65] text-pretty text-ink/80 lg:text-lg/[1.65] ${materials.length > 0 ? 'lg:mt-0 xl:mt-6' : ''}`}
              >
                {materialsDescription}
              </p>
            )}
          </div>
          {materials.length > 0 && (
            <div
              className={`grid items-end gap-3 sm:gap-4 xl:col-span-7 ${loneMaterial ? '' : 'grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'}`}
            >
              {materials.map(({ id, responsiveImage }, i) => {
                const { width, height } = readFragment(
                  ResponsiveImageFragment,
                  responsiveImage,
                );
                return (
                  <div
                    key={id}
                    className={`relative overflow-hidden rounded-nav bg-oat ${
                      loneMaterial
                        ? 'aspect-[4/3]'
                        : i === 0
                          ? 'aspect-[4/5] lg:aspect-[5/4] xl:aspect-[4/5]'
                          : 'aspect-[4/5] sm:mb-16 lg:aspect-square xl:aspect-[4/5]'
                    }`}
                  >
                    <DatoImage
                      fragment={responsiveImage}
                      layout="fill"
                      objectFit="cover"
                      sizes={coverSizes(
                        MATERIAL_FRAMES[
                          loneMaterial ? 'lone' : i === 0 ? 'first' : 'second'
                        ],
                        width / height,
                      )}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Content;
