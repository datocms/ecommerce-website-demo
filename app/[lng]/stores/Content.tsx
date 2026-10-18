'use client';

import { stripStega } from '@datocms/content-link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline';
import { type MouseEvent, useRef, useState } from 'react';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { FOREST_CARD, PAGE_VARS } from '@/components/Sections/ui';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { readFragment } from '@/lib/datocms/graphql';
import type { PageProps, Query } from './meta';

const pad = (value: number) => String(value).padStart(2, '0');

const DESCRIPTION =
  'mt-6 max-w-[36em] text-md leading-[1.6] text-pretty text-cream/85 xl:mt-8 2xl:text-lg 2xl:leading-[1.6]';

const Content: ContentPage<PageProps, Query> = ({ data }) => {
  const [currentStore, setCurrentStore] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const allStores = data.allStores;
  const store = allStores[currentStore];

  if (!store) return null;

  const image = store.storeImage?.responsiveImage;
  const findOnMaps = data.generalInterface?.findOnMaps;

  // The photo covers its box, so it renders at the box's width or at its height × the photo's
  // ratio, whichever is wider. The box is 4:3 below lg; from lg the forest card sets its height
  // (about 660-810px, by locale) while its column is 50vw, then 58vw, then 790px wide
  const { width, height } = image
    ? readFragment(ResponsiveImageFragment, image)
    : { width: 1, height: 1 };
  const ratio = width / height;
  const cover = (from: number, to: number, vw: number, boxHeight: number) => {
    const px = Math.round(boxHeight * ratio);
    const vwFrom = Math.round((px * 100) / vw);
    if (vwFrom <= from) return `(min-width: ${from}px) ${vw}vw`;
    if (vwFrom >= to) return `(min-width: ${from}px) ${px}px`;
    return `(min-width: ${vwFrom}px) ${vw}vw, (min-width: ${from}px) ${px}px`;
  };
  const sizes = [
    `(min-width: 1440px) ${Math.max(790, Math.round(750 * ratio))}px`,
    cover(1280, 1440, 58, 750),
    cover(1024, 1280, 50, 780),
    `${Math.round(Math.max(100, 75 * ratio))}vw`,
  ].join(', ');

  const step = (by: number) => {
    setCurrentStore(
      (currentStore) =>
        (currentStore + by + allStores.length) % allStores.length,
    );
  };

  // Below lg the index sits under the store, so picking one there takes focus (and the view, when
  // the name is out of it) up to its name. From lg a click leaves the page where it is while a
  // good part of the card shows, so the index stays under the pointer; a key press only moves on
  // when the name is out of view
  const showStore = (index: number, event: MouseEvent) => {
    setCurrentStore(index);
    const heading = headingRef.current;
    const card = cardRef.current;
    if (!heading || !card) return;
    const headerOffset =
      Number.parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
      ) || 0;
    const { top, bottom } = heading.getBoundingClientRect();
    const inView = top >= headerOffset && bottom <= window.innerHeight;
    const cardBox = card.getBoundingClientRect();
    const cardShown =
      Math.min(cardBox.bottom, window.innerHeight) -
        Math.max(cardBox.top, headerOffset) >=
      (window.innerHeight - headerOffset) / 4;
    if (
      window.matchMedia('(min-width: 64rem)').matches &&
      (inView || (event.detail > 0 && cardShown))
    ) {
      return;
    }
    heading.focus({ preventScroll: true });
    if (!inView) heroRef.current?.scrollIntoView({ block: 'start' });
  };

  return (
    <div className={`${PAGE_VARS} pt-1`}>
      <div
        ref={heroRef}
        className="shell grid gap-3 sm:gap-4 lg:grid-cols-12 xl:min-h-(--hero-h)"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-oat lg:order-last lg:col-span-6 lg:aspect-auto xl:col-span-7">
          {image && (
            <DatoImage
              key={store.id}
              fragment={image}
              layout="fill"
              objectFit="cover"
              sizes={sizes}
              priority
            />
          )}
        </div>

        <div
          ref={cardRef}
          aria-live="polite"
          className={`${FOREST_CARD} relative mx-2 -mt-16 flex flex-col shadow-pop sm:mx-0 sm:mt-0 sm:shadow-none lg:col-span-6 xl:col-span-5`}
        >
          {/* The pager keeps the top right corner: a country too long to sit beside it wraps
              onto the row below, so the arrows never move under the thumb */}
          <div className="flex flex-wrap-reverse items-center gap-4">
            <p className="pretitle bg-butter">{store.country}</p>
            <div className="-mr-1 ml-auto flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous store"
                className="icon-btn ring-1 ring-white/25 hover:bg-butter hover:bg-none hover:text-ink hover:ring-butter"
                onClick={() => step(-1)}
              >
                <ArrowLeftIcon aria-hidden="true" className="stroke-[2.4]" />
              </button>
              <span className="min-w-14 text-center text-sm font-bold tabular-nums">
                {pad(currentStore + 1)}{' '}
                <span className="text-cream/70">/ {pad(allStores.length)}</span>
              </span>
              <button
                type="button"
                aria-label="Next store"
                className="icon-btn ring-1 ring-white/25 hover:bg-butter hover:bg-none hover:text-ink hover:ring-butter"
                onClick={() => step(1)}
              >
                <ArrowRightIcon aria-hidden="true" className="stroke-[2.4]" />
              </button>
            </div>
          </div>

          {/* From md every store's name and text share one cell, so the card keeps the longest
              store's height and the index stays put under the pointer; the spare room goes above
              the link. Below md only the current store renders. The current store always comes
              first, so the h1 keeps its node (and focus) from one store to the next */}
          <div className="mt-8 grid grow sm:mt-10">
            <div className="col-start-1 row-start-1">
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="sc-title focus:outline-hidden"
              >
                {store.storeName}
              </h1>
              <p className={DESCRIPTION}>{store.storeDescription}</p>
            </div>
            {allStores.map((item, index) =>
              index === currentStore ? null : (
                <div
                  key={item.id}
                  aria-hidden="true"
                  className="col-start-1 row-start-1 max-md:hidden md:invisible"
                >
                  <p className="sc-title">{stripStega(item.storeName)}</p>
                  <p className={DESCRIPTION}>
                    {stripStega(item.storeDescription)}
                  </p>
                </div>
              ),
            )}
          </div>

          <a
            href={`https://www.google.com/maps/?q=${store.storeLocation?.latitude},${store.storeLocation?.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-butter mt-8 self-start"
          >
            {findOnMaps}
            <ArrowUpRightIcon aria-hidden="true" />
          </a>
        </div>
      </div>

      <ol className="shell relative mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {allStores.map((item, index) => {
          const current = index === currentStore;
          const thumbnail = item.thumbnail?.responsiveImage;
          return (
            <li key={item.id} className="grid sm:max-lg:odd:last:col-span-2">
              <button
                type="button"
                aria-current={current ? 'true' : undefined}
                onClick={(event) => showStore(index, event)}
                className="group flex w-full items-center gap-4 rounded-card bg-white p-2 pr-4 text-left transition-shadow duration-200 hover:shadow-card focus-visible:outline-offset-4 aria-[current=true]:inset-ring-2 aria-[current=true]:inset-ring-ink"
              >
                <span
                  aria-hidden="true"
                  className="relative size-17 shrink-0 overflow-hidden rounded-image bg-oat"
                >
                  {thumbnail && (
                    <DatoImage
                      fragment={thumbnail}
                      layout="fill"
                      objectFit="cover"
                      sizes="68px"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="title-sm block text-pretty">
                    {item.storeName}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-muted">
                    {item.country}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-cream sm:max-md:hidden lg:max-xl:hidden transition-colors duration-150 group-hover:bg-ink group-hover:text-cream group-aria-[current=true]:bg-ink group-aria-[current=true]:text-cream"
                >
                  <ArrowRightIcon className="size-4 stroke-[2.4]" />
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
