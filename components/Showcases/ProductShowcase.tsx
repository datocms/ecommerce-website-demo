import {
  CollectionCardRecord,
  ProductRecord,
  ResponsiveImage,
  SiteLocale,
} from '@/graphql/generated';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Image as DatoImage, ResponsiveImageType } from 'react-datocms';

type PropTypes = {
  collectionCards: CollectionCardRecord[];
  lng: SiteLocale;
};

const ProductShowcase = ({ collectionCards, lng }: PropTypes) => {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 grid-rows-2 gap-4 p-4 md:h-screen md:grid-cols-5">
      <a
        href="#"
        className="group relative block overflow-hidden rounded-xl bg-black text-white transition-all duration-150 md:col-span-2"
      >
        <div className="relative z-10 p-12">
          <h3 className="font-display text-6xl opacity-0 transition-all duration-150 group-hover:opacity-100">
            {collectionCards[0].title}
          </h3>
          <p className="mt-2 text-xl opacity-0 transition-all duration-150 group-hover:opacity-100">
            {collectionCards[0].subtitle}
          </p>
        </div>
        <div className="absolute inset-0 h-full w-full object-cover opacity-100 transition-all duration-150 group-hover:opacity-75">
          <DatoImage
            data={
              collectionCards[0].collection.image
                .responsiveImage as ResponsiveImageType
            }
            className="h-full w-full object-contain"
            layout="fill"
            objectFit="cover"
            objectPosition="50% 50%"
          />
        </div>
      </a>
      <a
        href="#"
        className="relative block overflow-hidden rounded-xl bg-black text-white transition-all duration-150 hover:z-10   md:col-span-3 lg:col-span-1"
      >
        <div className="relative z-10 p-12">
          {/* <h3 className="font-display text-2xl">{collectionCards[1].title}</h3>
          <p className="mt-2 text-sm">{collectionCards[1].subtitle}</p> */}
        </div>
        <div className="absolute inset-0 h-full w-full object-cover opacity-100">
          <DatoImage
            data={
              collectionCards[1].collection.image
                .responsiveImage as ResponsiveImageType
            }
            className="h-full w-full object-contain"
            layout="fill"
            objectFit="cover"
            objectPosition="50% 50%"
          />
        </div>
      </a>
      <a
        href="#"
        className="relative block overflow-hidden rounded-xl bg-black text-white md:col-span-3 lg:col-span-2 lg:row-span-2"
      >
        <div className="relative z-10 p-12">
          <h3 className="text-6xl font-bold">{collectionCards[2].title}</h3>
          <p className="mt-2 text-2xl">{collectionCards[2].subtitle}</p>
        </div>
        <div className="absolute inset-0 h-full w-full object-cover opacity-100">
          <DatoImage
            data={
              collectionCards[2].collection.image
                .responsiveImage as ResponsiveImageType
            }
            className="h-full w-full object-contain"
            layout="fill"
            objectFit="cover"
            objectPosition="50% 50%"
          />
        </div>
      </a>
      <a
        href="#"
        className="relative block overflow-hidden rounded-xl bg-black text-white transition-all duration-150 hover:z-10   md:col-span-2 lg:col-span-1"
      >
        <div className="relative z-10 p-12">
          {/* <h3 className="font-display text-2xl">{collectionCards[3].title}</h3>
          <p className="mt-2 text-sm">{collectionCards[3].subtitle}</p> */}
        </div>
        <div className="absolute inset-0 h-full w-full object-cover opacity-100">
          <DatoImage
            data={
              collectionCards[3].collection.image
                .responsiveImage as ResponsiveImageType
            }
            className="h-full w-full object-contain"
            layout="fill"
            objectFit="cover"
            objectPosition="50% 50%"
          />
        </div>
      </a>
      <a
        href="#"
        className="relative block overflow-hidden rounded-xl bg-black text-white transition-all duration-150 hover:z-10   md:col-span-5 lg:col-span-2"
      >
        <div className="relative z-10 p-12">
          {/* <h3 className="font-display text-2xl">{collectionCards[4].title}</h3>
          <p className="mt-2 text-sm">{collectionCards[4].subtitle}</p> */}
        </div>
        <div className="absolute inset-0 h-full w-full object-cover opacity-100">
          <DatoImage
            data={
              collectionCards[4].collection.image
                .responsiveImage as ResponsiveImageType
            }
            className="h-full w-full object-contain"
            layout="fill"
            objectFit="cover"
            objectPosition="50% 50%"
          />
        </div>
      </a>
    </div>
  );
};

export default ProductShowcase;
