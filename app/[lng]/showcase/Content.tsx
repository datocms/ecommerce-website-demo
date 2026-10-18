import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/Common/ProductCard';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { CAPTION, IMG_ZOOM, MEDIA, TILE } from '@/components/Sections/ui';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { PageProps, Query } from './meta';

const hasImage = <T extends { responsiveImage?: unknown }>(
  item: T,
): item is T & { responsiveImage: NonNullable<T['responsiveImage']> } =>
  Boolean(item.responsiveImage);

// Photo frames per breakpoint, widest first: media query, frame width, frame aspect ratio.
// From lg the display frames are 600px tall and the material photos stretch to the localized
// copy, so each ratio is the narrowest one in its range.
type Frame = [media: string, width: number, unit: 'px' | 'vw', ratio: number];
const FRAMES: Record<
  'wide' | 'narrow' | 'lone' | 'trio' | 'material' | 'loneMaterial',
  Frame[]
> = {
  wide: [
    ['(min-width: 1440px)', 787, 'px', 1.31],
    ['(min-width: 1024px)', 54, 'vw', 0.9],
    ['', 46, 'vw', 3 / 4],
  ],
  narrow: [
    ['(min-width: 1440px)', 557, 'px', 0.93],
    ['(min-width: 1024px)', 39, 'vw', 0.64],
    ['', 46, 'vw', 3 / 4],
  ],
  lone: [
    ['(min-width: 1440px)', 1360, 'px', 2.27],
    ['(min-width: 1024px)', 94, 'vw', 1.57],
    ['', 90, 'vw', 4 / 3],
  ],
  // Desktop frames only: below lg a trio photo keeps its pair or lone frame
  trio: [
    ['(min-width: 1440px)', 443, 'px', 0.74],
    ['(min-width: 1024px)', 30, 'vw', 0.51],
  ],
  material: [
    ['(min-width: 1440px)', 385, 'px', 0.75],
    ['(min-width: 1024px)', 27, 'vw', 0.58],
    ['', 46, 'vw', 4 / 5],
  ],
  loneMaterial: [
    ['(min-width: 1440px)', 787, 'px', 1.3],
    ['(min-width: 1024px)', 55, 'vw', 1.1],
    ['', 90, 'vw', 4 / 3],
  ],
};

// A photo wider than its frame is cropped by height, so its source must be wider than the frame
const coverSizes = (frames: Frame[], imageRatio: number) =>
  frames
    .map(([media, width, unit, ratio]) =>
      `${media} ${Math.ceil(width * Math.max(1, imageRatio / ratio))}${unit}`.trim(),
    )
    .join(', ');

const imageRatio = (
  responsiveImage: FragmentOf<typeof ResponsiveImageFragment>,
) => {
  const { width, height } = readFragment(
    ResponsiveImageFragment,
    responsiveImage,
  );
  return width / height;
};

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
  const ctaHref = cta ? `/${lng}/${stripStega(cta.slug)}` : '';
  const collectionsCta = data.showcase.collectionsCta[0];
  const currencySymbol = data.generalInterface?.currencySymbol ?? '';
  const saleLabel = data.generalInterface?.sale;
  const shopNow = data.generalInterface?.shopNow;
  const displays = data.showcase.displays.filter(hasImage);
  const materials = data.showcase.materialsDisplay.filter(hasImage).slice(0, 2);
  const hasMaterials = materials.length > 0;
  const loneMaterial = materials.length === 1;
  // Two product columns: an odd count would leave the last row a card short, so the CTA
  // closes it as a photo-sized tile
  const endTile = Boolean(cta) && newProducts.length % 2 === 1;

  const ctaArrow = <ArrowRightIcon aria-hidden="true" className="stroke-2" />;
  // Button content for the CMS CTA, whose localized label can wrap (es at 360px, or in the
  // 304px title column at lg): the arrow follows the last word, glued to it by a word joiner,
  // instead of sitting at the far edge of the wrapped label. The tighter leading keeps a wrapped
  // label inside the 52px button height.
  const ctaButtonLabel = cta && (
    <span className="leading-[1.15]">
      {cta.label}
      <span className="whitespace-nowrap">
        {'\u2060'}
        <ArrowRightIcon
          aria-hidden="true"
          className="ml-2.5 inline size-4.5 stroke-2 align-[-0.2em]"
        />
      </span>
    </span>
  );

  return (
    <>
      <section
        aria-labelledby="showcase-title"
        className="shell pt-(--page-top)"
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-4">
          {/* Greedy lines: balance would narrow the block and
              leave a wide gap before the description */}
          <h1
            id="showcase-title"
            className="title-display text-wrap lg:col-span-7 lg:pr-6 xl:col-span-8 xl:pr-10"
          >
            {title}
          </h1>
          {(description || cta) && (
            <div className="max-w-[34rem] lg:col-span-5 lg:max-w-none xl:col-span-4">
              {description && (
                <p className="text-md leading-[1.6] text-pretty text-ink-2">
                  {description}
                </p>
              )}
              {cta && (
                <Link
                  href={ctaHref}
                  className={`btn ${description ? 'mt-7' : ''}`}
                >
                  {ctaButtonLabel}
                </Link>
              )}
            </div>
          )}
        </div>
        {displays.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 lg:mt-16 lg:grid-cols-12 lg:gap-4">
            {displays.map(({ id, responsiveImage }, i) => {
              // Pairs alternate 7/5 and 5/7 columns; an odd last photo takes the whole row.
              // From lg an odd count of three or more ends in three equal columns instead, so
              // the last portrait isn't cropped to a thin band.
              const slot =
                i === displays.length - 1 && i % 2 === 0
                  ? 'lone'
                  : (i % 2 === 0) === (Math.floor(i / 2) % 2 === 0)
                    ? 'wide'
                    : 'narrow';
              const trio =
                displays.length % 2 === 1 &&
                displays.length >= 3 &&
                i >= displays.length - 3;
              const frames = trio
                ? [...FRAMES.trio, ...FRAMES[slot].slice(-1)]
                : FRAMES[slot];
              return (
                <div
                  key={id}
                  className={`${MEDIA} lg:aspect-auto lg:h-[37.5rem] ${
                    slot === 'lone' ? 'col-span-2 aspect-[4/3]' : 'aspect-[3/4]'
                  } ${
                    trio
                      ? 'lg:col-span-4'
                      : {
                          wide: 'lg:col-span-7',
                          narrow: 'lg:col-span-5',
                          lone: 'lg:col-span-12',
                        }[slot]
                  }`}
                >
                  <DatoImage
                    fragment={responsiveImage}
                    layout="fill"
                    objectFit="cover"
                    objectPosition={
                      trio
                        ? '50% 20%'
                        : {
                            wide: '50% 12%',
                            narrow: '50% 35%',
                            lone: '50% 15%',
                          }[slot]
                    }
                    sizes={coverSizes(frames, imageRatio(responsiveImage))}
                    priority={i < 2}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {collectionsCta && collections.length > 0 && (
        <section
          aria-label={
            stripStega(data.generalInterface?.collection ?? '') || undefined
          }
          className="shell pt-16 lg:pt-20"
        >
          {/* A snap rail on phones (py-2 keeps the focus rings inside the scroller),
              three columns from md */}
          <ul className="no-scrollbar -mx-(--gutter) -my-2 flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) py-2 md:mx-0 md:my-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:py-0">
            {collections.map((collection) => (
              <li
                key={collection.id}
                className="flex w-[78%] shrink-0 snap-start sm:w-[44%] md:w-auto"
              >
                <Link
                  href={`/${lng}/${stripStega(collectionsCta.slug)}${collection.id}`}
                  className={`${TILE} w-full outline-offset-4`}
                  data-datocms-content-link-group
                >
                  <div aria-hidden="true" className={`${MEDIA} aspect-[4/5]`}>
                    {collection.details.image.responsiveImage && (
                      <DatoImage
                        fragment={collection.details.image.responsiveImage}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="50% 30%"
                        sizes="(min-width: 1440px) 443px, (min-width: 768px) 31vw, (min-width: 640px) 42vw, 72vw"
                        className={IMG_ZOOM}
                      />
                    )}
                  </div>
                  {/* The links line up even when a localized name wraps. Names wrap between
                      words only: balanced lines would otherwise split "Geschäftlich" in three
                      columns at md */}
                  <div className={`${CAPTION} flex-1 pt-5`}>
                    <h2 className="title-card hyphens-manual">
                      {collection.name}
                    </h2>
                    <span className="tlink mt-auto">
                      {collectionsCta.label}
                      {ctaArrow}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {newProducts.length > 0 && (
        <section
          aria-labelledby="new-arrivals-title"
          className="shell pt-(--section-gap)"
        >
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-4">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <h2 id="new-arrivals-title" className="title-section lg:pr-6">
                  {newProductsTitle}
                </h2>
                {/* With an odd count the end tile carries the CTA. Otherwise it sits under the
                    title (a long label wraps inside the column) */}
                {cta && !endTile && (
                  <Link
                    href={ctaHref}
                    className="btn mt-8 hidden max-w-full lg:inline-flex"
                  >
                    {ctaButtonLabel}
                  </Link>
                )}
              </div>
            </div>
            <div className="-mb-(--card-row-gap) grid grid-cols-2 gap-x-3 [--card-row-gap:2.5rem] md:gap-x-4 lg:col-span-8">
              {newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  href={`/${lng}/product/${stripStega(product.slug)}`}
                  name={product.name}
                  brand={product.brand?.name}
                  image={product.productImages[0]?.responsiveImage}
                  hoverImage={product.productImages[1]?.responsiveImage}
                  price={product.price}
                  salePrice={product.salePrice}
                  onSale={stripStega(product.sale) === 'on_sale'}
                  currencySymbol={currencySymbol}
                  saleLabel={saleLabel}
                  sizes="(min-width: 1440px) 443px, (min-width: 1024px) 31vw, 46vw"
                  size="lg"
                  titleAs="h3"
                  data-datocms-content-link-group
                />
              ))}
              {/* Only the square is the link, so its focus ring wraps what shows */}
              {endTile && cta && (
                <div className="row-span-4 mb-(--card-row-gap)">
                  <Link
                    href={ctaHref}
                    className="group flex aspect-[4/5] items-center justify-center bg-mist p-6 text-center outline-offset-4"
                  >
                    <span className="tlink">
                      {cta.label}
                      {ctaArrow}
                    </span>
                  </Link>
                </div>
              )}
            </div>
            {cta && !endTile && (
              <Link
                href={ctaHref}
                className="btn-line w-full max-sm:[--btn-px:1rem] sm:w-auto sm:justify-self-start lg:hidden"
              >
                {ctaButtonLabel}
              </Link>
            )}
          </div>
        </section>
      )}

      <section
        aria-labelledby="materials-title"
        className="shell pt-(--section-gap)"
      >
        {/* From lg the photos run from the top of the copy column to the foot of its button in
            every locale: they stretch to the copy, and their landscape frame only sets a
            minimum for short copy. Between lg and xl the title takes the row above (beside the
            photos it would dwarf them); from xl it heads the copy column. */}
        <div
          className={
            hasMaterials
              ? 'grid gap-y-6 lg:grid-cols-12 lg:gap-x-4 lg:gap-y-12 xl:grid-rows-[auto_1fr] xl:gap-y-6'
              : 'max-w-[45rem]'
          }
        >
          {/* Whole words only from sm: "Qualitätsmaterialien" fits the column at every width */}
          <h2
            id="materials-title"
            className={`title-section sm:hyphens-manual ${hasMaterials ? 'lg:col-span-12 xl:col-span-5 xl:pr-8' : ''}`}
          >
            {materialsTitle}
          </h2>
          {(materialsDescription || shopNow) && (
            <div
              className={`flex max-w-[36rem] flex-col items-start gap-8 ${
                hasMaterials
                  ? 'lg:col-span-5 lg:max-w-none lg:pr-8 xl:col-start-1 xl:row-start-2'
                  : 'mt-6'
              }`}
            >
              {materialsDescription && (
                <p className="text-md leading-[1.65] text-pretty text-ink-2">
                  {materialsDescription}
                </p>
              )}
              {shopNow && (
                <Link href={`/${lng}/products`} className="btn">
                  {shopNow}
                  {ctaArrow}
                </Link>
              )}
            </div>
          )}
          {hasMaterials && (
            <div
              className={`mt-4 grid gap-3 lg:col-span-7 lg:mt-0 lg:gap-4 xl:col-start-6 xl:row-span-2 xl:row-start-1 ${loneMaterial ? '' : 'grid-cols-2'}`}
            >
              {/* w-full: a stretched photo would otherwise widen with its ratio */}
              {materials.map(({ id, responsiveImage }) => (
                <div
                  key={id}
                  className={`${MEDIA} w-full lg:self-stretch ${loneMaterial ? 'aspect-[4/3] lg:aspect-[5/2]' : 'aspect-[4/5] lg:aspect-[4/3]'}`}
                >
                  <DatoImage
                    fragment={responsiveImage}
                    layout="fill"
                    objectFit="cover"
                    sizes={coverSizes(
                      FRAMES[loneMaterial ? 'loneMaterial' : 'material'],
                      imageRatio(responsiveImage),
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Content;
