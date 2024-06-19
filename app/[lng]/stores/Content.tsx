'use client';

import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { useState } from 'react';
import { Image as DatoImage, type ResponsiveImageType } from 'react-datocms';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({ data }) => {
  const [currentStore, setCurrentStore] = useState(0);

  const allStores = data.allStores;

  return (
    <div className="mx-auto -mb-8  flex w-full max-w-7xl flex-wrap py-24 lg:h-screen lg:pt-24">
      <div className="-mb-56 -mt-80 flex h-screen w-full items-center justify-center lg:m-0 lg:block lg:h-full lg:w-1/2 lg:items-start lg:justify-start">
        <div className="flex h-full max-w-xl flex-col justify-center px-12 text-center lg:px-32 lg:text-left">
          <p className="mb-4 font-sans text-xs uppercase tracking-wide text-gray-600">
            {allStores[currentStore].country}
          </p>

          <h1 className="mb-8 font-serif text-2xl leading-normal md:text-4xl">
            {allStores[currentStore].storeName}
          </h1>

          <div className="flex flex-col items-center justify-center">
            <div className="h-48 pr-6 text-xs leading-normal text-gray-900 md:pr-0 md:leading-loose lg:mb-6 lg:h-64">
              {allStores[currentStore].storeDescription}
            </div>

            <a
              href={`https://www.google.com/maps/?q=${allStores[currentStore].storeLocation?.latitude},${allStores[currentStore].storeLocation?.longitude}`}
              target="__blank"
              className="cursor-pointer text-xs uppercase text-black"
            >
              {data.generalInterface?.findOnMaps}{' '}
              <span className="border-gray-light ml-4 inline-block h-1 w-24 border-t" />
            </a>
            <div className="pin-l pin-b -ml-6 flex w-32 justify-around bg-white px-4 py-6">
              <button
                className="text-gray-600er cursor-pointer text-xs no-underline hover:text-gray-900"
                onClick={() => {
                  setCurrentStore((currentStore) => {
                    if (currentStore === 0) return allStores.length - 1;
                    return currentStore - 1;
                  });
                }}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    setCurrentStore((currentStore) => {
                      if (currentStore === 0) return allStores.length - 1;
                      return currentStore - 1;
                    });
                  }
                }}
                tabIndex={0}
                type="button"
              >
                &larr;
              </button>
              <span className="text-gray-600er text-xs">
                {currentStore + 1}/{allStores.length}
              </span>
              <button
                className="text-gray-600er cursor-pointer text-xs no-underline hover:text-gray-900"
                onClick={() => {
                  setCurrentStore((currentStore) => {
                    if (currentStore === allStores.length - 1) return 0;
                    return currentStore + 1;
                  });
                }}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    setCurrentStore((currentStore) => {
                      if (currentStore === allStores.length - 1) return 0;
                      return currentStore + 1;
                    });
                  }
                }}
                tabIndex={0}
                type="button"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-8 h-screen w-full lg:mx-0 lg:h-full lg:w-1/2">
        <div className="h-full w-full bg-cover bg-center bg-no-repeat">
          <DatoImage
            data={
              allStores[currentStore].storeImage
                ?.responsiveImage as ResponsiveImageType
            }
            className="h-full w-full rounded-lg object-contain"
            layout="fill"
            objectFit="cover"
            objectPosition="70% 30%"
          />
        </div>
      </div>
    </div>
  );
};

export default Content;
