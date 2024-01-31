import {
  CollectionCardShowcaseSectionRecord,
  ProductRecord,
  ResponsiveImage,
  SiteLocale,
} from '@/graphql/generated';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Image as DatoImage, ResponsiveImageType } from 'react-datocms';

type PropTypes = {
  collectionCards: CollectionCardShowcaseSectionRecord;
  lng: SiteLocale;
};

const ProductShowcase = ({ collectionCards, lng }: PropTypes) => {
  const left = collectionCards.direction === 'left';

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:h-screen md:grid-cols-4 md:grid-rows-2">
      <div
        className={`hidden items-center justify-center text-center text-gray-700 md:col-span-2 ${
          left && 'md:flex'
        }`}
      >
        <div className="relative z-10 p-12">
          <div className="text-sm uppercase tracking-widest text-gray-700">
            {collectionCards.pretitle}
          </div>
          <h3 className="font-display mt-2 text-3xl font-semibold">
            {collectionCards.title}
          </h3>
          <div className="mx-auto mt-3 max-w-md">
            {collectionCards.description}
          </div>
          <Link
            href={`/${lng}/${collectionCards.button[0].slug}`}
            className="font-heading mt-6 inline-block rounded-lg bg-primary/80 px-8 py-4 text-sm tracking-widest text-white"
          >
            {collectionCards.button[0].label}
          </Link>
        </div>
      </div>

      <div className="relative h-[700px] md:col-span-2 md:row-span-2 md:h-auto">
        {collectionCards.collection[0].details.image.responsiveImage && (
          <div className="absolute inset-0 h-full w-full rounded-lg object-cover">
            <DatoImage
              data={collectionCards.collection[0].details.image.responsiveImage}
              className="h-full w-full rounded-lg object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
        )}
      </div>

      <div
        className={`flex items-center justify-center text-center text-gray-700 md:col-span-2 ${
          left && 'md:hidden'
        }`}
      >
        <div className="relative z-10 p-12">
          <div className="text-sm uppercase tracking-widest text-gray-700">
            {collectionCards.pretitle}
          </div>
          <h3 className="font-display mt-2 text-3xl font-semibold">
            {collectionCards.title}
          </h3>
          <p className="mx-auto mt-3 max-w-md">{collectionCards.description}</p>
          <Link
            href={`/${lng}/${collectionCards.button[0].slug}`}
            className="font-heading mt-6 inline-block rounded-lg bg-primary/80 px-8 py-4 text-sm tracking-widest text-white"
          >
            {collectionCards.button[0].label}
          </Link>
        </div>
      </div>
      {collectionCards.collection[1].details.image.responsiveImage && (
        <div className="relative col-span-1 row-span-1 hidden h-64 md:block md:h-auto">
          <div className="absolute inset-0 h-full w-full rounded-lg object-cover">
            <DatoImage
              data={collectionCards.collection[1].details.image.responsiveImage}
              className="h-full w-full rounded-lg object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
        </div>
      )}
      {collectionCards.collection[2].details.image.responsiveImage && (
        <div className="relative col-span-1 row-span-1 hidden h-64 md:block md:h-auto">
          <div className="absolute inset-0 h-full w-full rounded-lg object-cover">
            <DatoImage
              data={collectionCards.collection[2].details.image.responsiveImage}
              className="h-full w-full rounded-lg object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductShowcase;
