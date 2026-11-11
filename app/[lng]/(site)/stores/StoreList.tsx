'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { MouseEvent } from 'react';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import type { Query } from './meta';

type Props = {
  stores: Query['allStores'];
  /** Zero-based index of the store on show */
  current: number;
  onSelect: (index: number, event: MouseEvent) => void;
  /** Called on hover or focus, so the store's photo can load before the click */
  onPreload: (index: number) => void;
};

// Each row draws its own rules, so the list ends with its last row; between sm and lg an odd last
// store spans both columns, so its rules run full width
export default function StoreList({
  stores,
  current,
  onSelect,
  onPreload,
}: Props) {
  return (
    <ol className="shell grid pt-16 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 lg:pt-24">
      {stores.map((store, index) => {
        const thumbnail = store.thumbnail?.responsiveImage;
        return (
          <li
            key={store.id}
            className="reveal -mt-px border-y sm:max-lg:odd:last:col-span-2"
          >
            <button
              type="button"
              aria-current={index === current ? 'true' : undefined}
              onClick={(event) => onSelect(index, event)}
              onPointerEnter={() => onPreload(index)}
              onFocus={() => onPreload(index)}
              className="group flex w-full items-center gap-4 py-4 text-left"
            >
              <span aria-hidden="true" className={`${MEDIA} size-18 shrink-0`}>
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
                  {store.storeName}
                </span>
                <span className="mt-1 block text-sm text-mute">
                  {store.country}
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
  );
}
