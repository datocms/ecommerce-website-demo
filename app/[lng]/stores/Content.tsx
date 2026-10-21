'use client';

import { stripStega } from '@datocms/content-link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline';
import { type MouseEvent, useRef, useState } from 'react';
import { IMG_ZOOM, MEDIA, PAGE_VARS } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { readFragment } from '@/lib/datocms/graphql';
import type { PageProps, Query } from './meta';

const pad = (value: number) => String(value).padStart(2, '0');

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

  // The photo covers its box, so it renders at the box's width or at its height × the photo's
  // ratio, whichever is wider. Below lg the box is full width and 4:3; from lg it is 6 of 12
  // columns plus the right gutter (50vw - 8px), 7 from 2xl (50vw + 107px), and at most 780px
  // tall (--hero-h), unless a long description makes the text column taller
  const { width, height } = image
    ? readFragment(ResponsiveImageFragment, image)
    : { width: 1, height: 1 };
  const ratio = width / height;
  const cover = (
    from: number,
    to: number,
    vw: number,
    offset: number,
    boxHeight: number,
  ) => {
    const px = Math.round(boxHeight * ratio);
    const box = `calc(${vw}vw ${offset < 0 ? '-' : '+'} ${Math.abs(offset)}px)`;
    const crossing = Math.ceil(((px - offset) * 100) / vw);
    if (crossing <= from) return `(min-width: ${from}px) ${box}`;
    if (crossing >= to) return `(min-width: ${from}px) ${px}px`;
    return `(min-width: ${crossing}px) ${box}, (min-width: ${from}px) ${px}px`;
  };
  const sizes = [
    cover(1440, Number.POSITIVE_INFINITY, 50, 107, 780),
    cover(1024, 1440, 50, -8, 780),
    `${Math.round(Math.max(100, 75 * ratio))}vw`,
  ].join(', ');

  const step = (by: number) => {
    setCurrentStore(
      (currentStore) =>
        (currentStore + by + allStores.length) % allStores.length,
    );
  };

  // Phones show the pager above the store, wider screens under it: each layout gets its own copy
  // (the other one is display: none), so the tab and reading order always follow what is seen
  const pager = (className: string) => (
    <div className={`flex items-center justify-between gap-6 ${className}`}>
      <p className="text-sm font-semibold tabular-nums">
        {pad(currentStore + 1)}{' '}
        <span className="font-normal text-mute">/ {pad(allStores.length)}</span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Previous store"
          className="rail-btn"
          onClick={() => step(-1)}
        >
          <ArrowLeftIcon aria-hidden="true" className="stroke-2" />
        </button>
        <button
          type="button"
          aria-label="Next store"
          className="rail-btn"
          onClick={() => step(1)}
        >
          <ArrowRightIcon aria-hidden="true" className="stroke-2" />
        </button>
      </div>
    </div>
  );

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
      window.matchMedia('(min-width: 64rem)').matches &&
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
              sizes={sizes}
              priority
            />
          )}
        </div>

        <div
          ref={textRef}
          aria-live="polite"
          className="flex flex-col pt-4 md:pt-8 lg:col-span-6 lg:py-8 lg:pr-10 xl:py-10 xl:pr-14 2xl:col-span-5 2xl:[@media(min-height:56.25rem)]:py-12"
        >
          {/* From md every store's text shares one cell, so the column keeps the longest store's
              height: the pager under it and the index below stay put, and the spare room goes
              under the shorter stores' link. Below md only the current store renders and the
              pager sits above it, so the arrows never move under the thumb. Until 2xl the text
              takes half the row; from 2xl it takes 5 columns, and only the name may run 32px into
              the right padding, so the longest store name keeps one line while the copy, link
              and pager keep their distance from the photo. The copy is 16px from lg, with a
              tight rhythm, so even the longest store keeps the pager above the fold of a
              730px-tall screen; once the hero reaches its full 780px (2xl, 900px tall) the copy
              grows to 17px and the rhythm opens up. The current store always comes first, so
              the h1 keeps its node (and focus) from one store to the next */}
          {pager('border-b pb-4 md:hidden')}
          <div className="grid grow max-md:mt-8">
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

          {pager(
            'mt-8 border-t pt-5 max-md:hidden 2xl:[@media(min-height:56.25rem)]:mt-10',
          )}
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
