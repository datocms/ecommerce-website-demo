'use client';

import { stripStega } from '@datocms/content-link/stega';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { type MouseEvent, useRef, useState } from 'react';
import { StructuredText } from 'react-datocms/structured-text';
import { PAGE_VARS } from '@/components/Common/styles';
import DatoStructuredText from '@/components/DatoStructuredText';
import Rise from '@/components/Motion/Rise';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { getScrollPaddingTop, LG_MEDIA_QUERY } from '@/lib/scrollPadding';
import type { PageProps, Query } from './meta';
import StoreList from './StoreList';
import StoreMap from './StoreMap';
import StorePager from './StorePager';
import StorePhotos from './StorePhotos';

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

// Whether the store's name is fully in view, and whether at least a quarter of the visible area
// below the sticky header is taken by its text
function measureVisibility(heading: HTMLElement, text: HTMLElement) {
  const headerOffset = getScrollPaddingTop();
  const { top, bottom } = heading.getBoundingClientRect();
  const inView = top >= headerOffset && bottom <= window.innerHeight;
  const textBox = text.getBoundingClientRect();
  const textShown =
    Math.min(textBox.bottom, window.innerHeight) -
      Math.max(textBox.top, headerOffset) >=
    (window.innerHeight - headerOffset) / 4;
  return { inView, textShown };
}

// Whether at least half of the element is in view below the sticky header
function isMostlyInView(element: HTMLElement) {
  const headerOffset = getScrollPaddingTop();
  const { top, bottom, height } = element.getBoundingClientRect();
  const shown =
    Math.min(bottom, window.innerHeight) - Math.max(top, headerOffset);
  return shown >= height / 2;
}

const Content: ContentPage<PageProps, Query> = ({ data }) => {
  const [currentStore, setCurrentStore] = useState(0);
  // The first store arrives like any page title; later ones swap in place, quicker
  const [hasSwitched, setHasSwitched] = useState(false);
  const [upcomingStore, setUpcomingStore] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mapRef = useRef<HTMLElement>(null);

  const allStores = data.allStores;
  const store = allStores[currentStore];

  if (!store) return null;

  const findOnMaps = data.generalInterface?.findOnMaps;
  const previousStore = data.generalInterface?.previousStore;
  const nextStore = data.generalInterface?.nextStore;
  const { storeLocation } = store;
  const mapsHref = storeLocation
    ? `https://www.google.com/maps/?q=${storeLocation.latitude},${storeLocation.longitude}`
    : null;

  const step = (by: number) => {
    setHasSwitched(true);
    setCurrentStore(
      (index) => (index + by + allStores.length) % allStores.length,
    );
  };

  // Moves focus (and the view, if needed) to the store's name. From lg it skips that while the
  // name is in view, or for a click while enough of the text or of the map is, so the list stays
  // under the pointer
  const showStore = (index: number, event: MouseEvent) => {
    setHasSwitched(true);
    setCurrentStore(index);
    const heading = headingRef.current;
    const text = textRef.current;
    if (!heading || !text) return;
    const { inView, textShown } = measureVisibility(heading, text);
    const mapShown = mapRef.current ? isMostlyInView(mapRef.current) : false;
    if (
      window.matchMedia(LG_MEDIA_QUERY).matches &&
      // event.detail is 0 when the button is activated from the keyboard
      (inView || (event.detail > 0 && (textShown || mapShown)))
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
        <StorePhotos
          stores={allStores}
          current={currentStore}
          upcoming={upcomingStore}
          className="-mx-(--gutter) aspect-[4/3] lg:order-last lg:col-span-6 lg:mx-0 lg:aspect-auto lg:bleed-r 2xl:col-span-7"
        />

        <div
          ref={textRef}
          aria-live="polite"
          className="flex flex-col pt-4 md:pt-8 lg:col-span-6 lg:py-8 lg:pr-10 xl:py-10 xl:pr-14 2xl:col-span-5 2xl:[@media(min-height:56.25rem)]:py-12"
        >
          <StorePager
            current={currentStore}
            total={allStores.length}
            onStep={step}
            previousLabel={previousStore}
            nextLabel={nextStore}
            className="border-b pb-4 md:hidden"
          />
          {/* From md every store shares one grid cell (only the current one visible), so the
              column keeps the tallest height and the pager never jumps */}
          <div className="grid grow max-md:mt-8">
            {/* Parts are keyed by store, so they replay enter on a switch; the h1 isn't, so it
                keeps focus. On arrival they follow the title's rise, as on the home Hero */}
            <div
              className={`col-start-1 row-start-1 ${hasSwitched ? 'quick [--rise:0px]' : '[--delay:200ms]'}`}
            >
              <p key={`${store.id}-country`} className="eyebrow enter">
                {store.country}
              </p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                // 2xl:-mr-8 lets the longest name run into the padding and stay on one line
                className="title-display mt-4 focus:outline-hidden 2xl:-mr-8"
              >
                {hasSwitched ? (
                  <span key={store.id} className="enter block">
                    {store.storeName}
                  </span>
                ) : (
                  <span className="block">
                    <Rise>{store.storeName}</Rise>
                  </span>
                )}
              </h1>
              <DatoStructuredText
                key={`${store.id}-text`}
                data={store.storeDescription}
                className={`${DESCRIPTION} enter`}
              />
              {mapsHref && (
                <a
                  key={`${store.id}-map`}
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${MAPS_LINK} enter`}
                >
                  {findOnMaps}
                  <ArrowUpRightIcon aria-hidden="true" className="stroke-2" />
                </a>
              )}
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
            previousLabel={previousStore}
            nextLabel={nextStore}
            className="mt-8 border-t pt-5 max-md:hidden 2xl:[@media(min-height:56.25rem)]:mt-10"
          />
        </div>
      </section>

      <StoreMap
        ref={mapRef}
        stores={allStores}
        current={currentStore}
        onSelect={(index) => {
          setHasSwitched(true);
          setCurrentStore(index);
        }}
        label={data.generalInterface?.stores}
        findOnMaps={findOnMaps}
        mapsHref={mapsHref}
      />

      <StoreList
        stores={allStores}
        current={currentStore}
        onSelect={showStore}
        onPreload={setUpcomingStore}
      />
    </div>
  );
};

export default Content;
