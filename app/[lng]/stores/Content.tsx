'use client';

import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { type MouseEvent, useRef, useState } from 'react';
import { IMG_ZOOM, MEDIA, PAGE_VARS } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { readFragment } from '@/lib/datocms/graphql';
import { heroImageSizes } from './imageSizes';
import type { PageProps, Query } from './meta';
import StorePager from './StorePager';

// The copy is 16px from lg, with a tight rhythm, so even the longest store keeps the pager above
// the fold of a 730px-tall screen; once the hero reaches its full 780px (2xl, 900px tall) the copy
// grows to 17px and the rhythm opens up
const DESCRIPTION =
  'mt-6 max-w-[36em] text-md text-pretty text-ink-2 lg:text-base 2xl:[@media(min-height:56.25rem)]:text-md';
const MAPS = 'btn mt-6 w-full sm:w-auto 2xl:[@media(min-height:56.25rem)]:mt-8';

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

  // Below lg the index sits under the store, so picking one there takes focus (and the view, when
  // the name is out of it) up to its name. From lg a click leaves the page where it is while a
  // good part of the text column shows, so the index stays under the pointer; a key press only
  // moves on when the name is out of view
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
          {/* From md every store's text is stacked in one grid cell (only the current one
              visible), so the column keeps the tallest store's height and the pager and list
              below never jump. Below md only the current store renders, with the pager above it.
              The current store renders first, so the h1 keeps its DOM node, and focus, between
              stores. */}
          <StorePager
            current={currentStore}
            total={allStores.length}
            onStep={step}
            className="border-b pb-4 md:hidden"
          />
          <div className="grid grow max-md:mt-8">
            {/* Each part is keyed by store, so it remounts and enters again on a switch (quick,
                sharpening in place). The h1 is not keyed, only its text, so it keeps focus. */}
            <div className="quick col-start-1 row-start-1 [--rise:0px]">
              <p key={`${store.id}-country`} className="eyebrow enter">
                {store.country}
              </p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="title-display mt-4 focus:outline-hidden 2xl:-mr-8"
              >
                <span key={store.id} className="enter block">
                  {store.storeName}
                </span>
              </h1>
              <p key={`${store.id}-text`} className={`${DESCRIPTION} enter`}>
                {store.storeDescription}
              </p>
              <a
                key={`${store.id}-map`}
                href={`https://www.google.com/maps/?q=${store.storeLocation?.latitude},${store.storeLocation?.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${MAPS} enter`}
              >
                {findOnMaps}
                <ArrowUpRightIcon aria-hidden="true" className="stroke-2" />
              </a>
            </div>
            {allStores.map((item, index) =>
              index === currentStore ? null : (
                // Invisible copies that only reserve height: stripStega keeps them from creating
                // duplicate visual-editing overlays
                <div
                  key={item.id}
                  aria-hidden="true"
                  className="col-start-1 row-start-1 max-md:hidden md:invisible"
                >
                  <p className="eyebrow">{stripStega(item.country)}</p>
                  <p className="title-display mt-4 2xl:-mr-8">
                    {stripStega(item.storeName)}
                  </p>
                  <p className={DESCRIPTION}>
                    {stripStega(item.storeDescription)}
                  </p>
                  <span className={MAPS}>
                    {stripStega(findOnMaps)}
                    <ArrowUpRightIcon className="stroke-2" />
                  </span>
                </div>
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

      <ol className="shell grid pt-16 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 lg:pt-24">
        {allStores.map((item, index) => {
          const thumbnail = item.thumbnail?.responsiveImage;
          // Each row draws its own rules, so the index ends with its last row; between sm and lg
          // an odd last store takes the whole row, so its rules run the full width
          return (
            <li
              key={item.id}
              className="-mt-px border-y sm:max-lg:odd:last:col-span-2"
            >
              <button
                type="button"
                aria-current={index === currentStore ? 'true' : undefined}
                onClick={(event) => showStore(index, event)}
                className="group flex w-full items-center gap-4 py-4 text-left"
              >
                <span
                  aria-hidden="true"
                  className={`${MEDIA} size-18 shrink-0`}
                >
                  {thumbnail && (
                    <span className={`absolute inset-0 ${IMG_ZOOM}`}>
                      <DatoImage
                        fragment={thumbnail}
                        layout="fill"
                        objectFit="cover"
                        sizes="72px"
                      />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="title-item block text-pretty decoration-1 underline-offset-4 group-hover:underline">
                    {item.storeName}
                  </span>
                  <span className="mt-1 block text-sm text-mute">
                    {item.country}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center text-ink-2 transition-colors duration-150 group-hover:bg-ink group-hover:text-white group-aria-[current=true]:bg-ink group-aria-[current=true]:text-white"
                >
                  <ArrowRightIcon className="size-4.5 stroke-2" />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Content;
