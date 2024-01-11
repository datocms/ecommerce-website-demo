'use client';

import { StoreRecord } from '@/graphql/generated';
import { Maybe } from 'graphql/jsutils/Maybe';
import { useState } from 'react';
import { Image as DatoImage, ResponsiveImageType } from 'react-datocms';

type PropTypes = {
  allStores: StoreRecord[];
  translationString: Maybe<string>;
};

const StoreShowcase = ({ allStores, translationString }: PropTypes) => {
  const [currentStore, setCurrentStore] = useState(0);

  return (
    <div className="-mb-8 -mt-24 flex w-full flex-wrap lg:h-screen lg:pt-24">
      <div className="flex h-screen w-full items-center justify-center lg:h-full lg:w-1/2">
        <div className="max-w-xl px-12 lg:px-32">
          <p className="mb-4 font-sans text-xs uppercase tracking-wide text-gray-600">
            {allStores[currentStore].country}
          </p>

          <h1 className="mb-8 font-serif text-2xl leading-normal md:text-4xl">
            {allStores[currentStore].storeName}
          </h1>

          <div className="">
            <div className="mb-6 pr-6 text-xs leading-normal text-gray-900 md:pr-0 md:leading-loose">
              {allStores[currentStore].storeDescription}
            </div>

            <a
              href={`https://www.google.com/maps/?q=${allStores[currentStore].storeLocation?.latitude},${allStores[currentStore].storeLocation?.longitude}`}
              target="__blank"
              className="cursor-pointer text-xs uppercase text-black"
            >
              {translationString}{' '}
              <span className="border-gray-light ml-4 inline-block h-1 w-24 border-t"></span>
            </a>
            <div className="pin-l pin-b absolute -ml-6 flex w-32 justify-around bg-white px-4 py-6">
              <div
                className="text-gray-600er cursor-pointer text-xs no-underline hover:text-gray-900"
                onClick={() => {
                  setCurrentStore((currentStore) => {
                    if (currentStore === 0) return allStores.length - 1;
                    return currentStore - 1;
                  });
                }}
              >
                &larr;
              </div>
              <span className="text-gray-600er text-xs">
                {currentStore + 1}/{allStores.length}
              </span>
              <div
                className="text-gray-600er cursor-pointer text-xs no-underline hover:text-gray-900"
                onClick={() => {
                  setCurrentStore((currentStore) => {
                    if (currentStore === allStores.length - 1) return 0;
                    return currentStore + 1;
                  });
                }}
              >
                &rarr;
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-screen w-full lg:h-full lg:w-1/2">
        <div className="h-full w-full bg-cover bg-center bg-no-repeat">
          <DatoImage
            data={
              allStores[currentStore].storeImage
                ?.responsiveImage as ResponsiveImageType
            }
            className="h-full w-full object-contain"
            layout="fill"
            objectFit="cover"
            objectPosition="70% 30%"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreShowcase;
