'use client';

import { stripStega } from '@datocms/content-link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { type MouseEvent, useRef, useState } from 'react';
import { StructuredText } from 'react-datocms/structured-text';
import { MEDIA, PAGE_VARS } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import DatoStructuredText from '@/components/DatoStructuredText';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { readFragment } from '@/lib/datocms/graphql';
import { heroImageSizes } from './imageSizes';
import type { PageProps, Query } from './meta';
import StoreList from './StoreList';
import StorePager from './StorePager';

type Store = Query['allStores'][number];

// Sized so the longest store keeps the pager above the fold on a 730px-tall screen
const DESCRIPTION =
  'mt-6 max-w-[36em] text-md text-pretty text-ink-2 lg:text-base 2xl:[@media(min-height:56.25rem)]:text-md';
const MAPS_LINK =
  'btn mt-6 w-full sm:w-auto 2xl:[@media(min-height:56.25rem)]:mt-8';

// An invisible copy of a store's text that only reserves its height. stripStega keeps it from
// creating duplicate visual-editing overlays
function StoreHeightCopy({
  store,
  findOnMaps,
}: {
  store: Store;
  findOnMaps: string | null | undefined;
}) {
  return (
    <div
      aria-hidden="true"
      className="col-start-1 row-start-1 max-md:hidden md:invisible"
    >
      <p className="eyebrow">{stripStega(store.country)}</p>
      <p className="title-display mt-4 2xl:-mr-8">
        {stripStega(store.storeName)}
      </p>
      <div className={DESCRIPTION}>
        <StructuredText data={stripStega(store.storeDescription)} />
      </div>
      <span className={MAPS_LINK}>
        {stripStega(findOnMaps)}
        <ArrowUpRightIcon className="stroke-2" />
      </span>
    </div>
  );
}

const Content: ContentPage<PageProps, Query> = ({ data }) => {
  const [currentStore, setCurrentStore] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const allStores = data.allStores;
  const store = allStores[currentStore];

  if (!store) return null;

  const image = store.storeImage?.responsiveImage;
  const findOnMaps = data.generalInterface?.findOnMaps;

  const { width, height } = image
    ? readFragment(ResponsiveImageFragment, image)
    : { width: 1, height: 1 };
  const ratio = width / height;

  const step = (by: number) => {
    setCurrentStore(
      (currentStore) =>
        (currentStore + by + allStores.length) % allStores.length,
    );
  };

  // Moves focus (and the view, if needed) to the store's name. From lg it skips that while the
  // name, or for a click enough of the text, is in view, so the list stays under the pointer
  const showStore = (index: number, event: MouseEvent) => {
    setCurrentStore(index);
    const heading = headingRef.current;
    const text = textRef.current;
    if (!heading || !text) return;
    const headerOffset =
      Number.parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
      ) || 0;
    const { top, bottom } = heading.getBoundingClientRect();
    const inView = top >= headerOffset && bottom <= window.innerHeight;
    const textBox = text.getBoundingClientRect();
    const textShown =
      Math.min(textBox.bottom, window.innerHeight) -
        Math.max(textBox.top, headerOffset) >=
      (window.innerHeight - headerOffset) / 4;
    if (
      window.matchMedia('(min-width: 64rem)').matches && // lg
      // event.detail is 0 when the button is activated from the keyboard
      (inView || (event.detail > 0 && textShown))
    ) {
      return;
    }
    heading.focus({ preventScroll: true });
    if (!inView) heroRef.current?.scrollIntoView({ block: 'start' });
  };

  return (
    <div className={PAGE_VARS}>
      <section
        ref={heroRef}
        className="shell grid lg:min-h-(--hero-h) lg:grid-cols-12 lg:gap-4"
      >
        <div
          className={`${MEDIA} -mx-(--gutter) aspect-[4/3] lg:order-last lg:col-span-6 lg:mx-0 lg:aspect-auto lg:bleed-r 2xl:col-span-7`}
        >
          {image && (
            <DatoImage
              key={store.id}
              fragment={image}
              layout="fill"
              objectFit="cover"
              sizes={heroImageSizes(ratio)}
              priority
            />
          )}
        </div>

        <div
          ref={textRef}
          aria-live="polite"
          className="flex flex-col pt-4 md:pt-8 lg:col-span-6 lg:py-8 lg:pr-10 xl:py-10 xl:pr-14 2xl:col-span-5 2xl:[@media(min-height:56.25rem)]:py-12"
        >
          <StorePager
            current={currentStore}
            total={allStores.length}
            onStep={step}
            className="border-b pb-4 md:hidden"
          />
          {/* From md every store shares one grid cell (only the current one visible), so the
              column keeps the tallest height and the pager never jumps */}
          <div className="grid grow max-md:mt-8">
            {/* Parts are keyed by store, so they replay enter on a switch; the h1 isn't, so it
                keeps focus */}
            <div className="quick col-start-1 row-start-1 [--rise:0px]">
              <p key={`${store.id}-country`} className="eyebrow enter">
                {store.country}
              </p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                // 2xl:-mr-8 lets the longest name run into the padding and stay on one line
                className="title-display mt-4 focus:outline-hidden 2xl:-mr-8"
              >
                <span key={store.id} className="enter block">
                  {store.storeName}
                </span>
              </h1>
              <DatoStructuredText
                key={`${store.id}-text`}
                data={store.storeDescription}
                className={`${DESCRIPTION} enter`}
              />
              <a
                key={`${store.id}-map`}
                href={`https://www.google.com/maps/?q=${store.storeLocation?.latitude},${store.storeLocation?.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${MAPS_LINK} enter`}
              >
                {findOnMaps}
                <ArrowUpRightIcon aria-hidden="true" className="stroke-2" />
              </a>
            </div>
            {allStores.map((item, index) =>
              index === currentStore ? null : (
                <StoreHeightCopy
                  key={item.id}
                  store={item}
                  findOnMaps={findOnMaps}
                />
              ),
            )}
          </div>

          <StorePager
            current={currentStore}
            total={allStores.length}
            onStep={step}
            className="mt-8 border-t pt-5 max-md:hidden 2xl:[@media(min-height:56.25rem)]:mt-10"
          />
        </div>
      </section>

      <StoreList
        stores={allStores}
        current={currentStore}
        onSelect={showStore}
      />
    </div>
  );
};

export default Content;
