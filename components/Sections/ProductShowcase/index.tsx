import DatoImage from '@/components/DatoImage';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { CollectionCardShowcaseFragmentDoc } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import Link from 'next/link';

type Props = {
  fragment: FragmentType<typeof CollectionCardShowcaseFragmentDoc>;
  globalPageProps: GlobalPageProps;
};

const ProductShowcase = ({ fragment, globalPageProps }: Props) => {
  const { direction, pretitle, title, description, button, collection } =
    getFragmentData(CollectionCardShowcaseFragmentDoc, fragment);

  const left = direction === 'left';

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:h-screen md:grid-cols-4 md:grid-rows-2">
      <div
        className={`hidden items-center justify-center text-center text-gray-700 md:col-span-2 ${
          left && 'md:flex'
        }`}
      >
        <div className="relative z-10 p-12">
          <div className="text-sm uppercase tracking-widest text-gray-700">
            {pretitle}
          </div>
          <h3 className="font-display mt-2 text-3xl font-semibold">{title}</h3>
          <div className="mx-auto mt-3 max-w-md">{description}</div>
          <Link
            href={`/${globalPageProps.params.lng}/${button[0].slug}`}
            className="font-heading mt-6 inline-block rounded-lg bg-primary/80 px-8 py-4 text-sm tracking-widest text-white"
          >
            {button[0].label}
          </Link>
        </div>
      </div>

      <div className="relative h-[700px] md:col-span-2 md:row-span-2 md:h-auto">
        {collection[0].details.image.responsiveImage && (
          <div className="absolute inset-0 h-full w-full rounded-lg object-cover">
            <DatoImage
              fragment={collection[0].details.image.responsiveImage}
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
            {pretitle}
          </div>
          <h3 className="font-display mt-2 text-3xl font-semibold">{title}</h3>
          <p className="mx-auto mt-3 max-w-md">{description}</p>
          <Link
            href={`/${globalPageProps.params.lng}/${button[0].slug}`}
            className="font-heading mt-6 inline-block rounded-lg bg-primary/80 px-8 py-4 text-sm tracking-widest text-white"
          >
            {button[0].label}
          </Link>
        </div>
      </div>
      {collection[1].details.image.responsiveImage && (
        <div className="relative col-span-1 row-span-1 hidden h-64 md:block md:h-auto">
          <div className="absolute inset-0 h-full w-full rounded-lg object-cover">
            <DatoImage
              fragment={collection[1].details.image.responsiveImage}
              className="h-full w-full rounded-lg object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
        </div>
      )}
      {collection[2].details.image.responsiveImage && (
        <div className="relative col-span-1 row-span-1 hidden h-64 md:block md:h-auto">
          <div className="absolute inset-0 h-full w-full rounded-lg object-cover">
            <DatoImage
              fragment={collection[2].details.image.responsiveImage}
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
