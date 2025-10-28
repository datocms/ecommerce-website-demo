/**
 * Three-up grid of materials with image tiles and links to
 * filtered product listings.
 */
import Link from 'next/link';
import DatoImage from '@/components/DatoImage';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { MaterialShowcaseFragmentDoc } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { imageFillCoverProps } from '@/utils/imageProps';

export type Props = {
  /** Material showcase fragment content. */
  fragment: FragmentType<typeof MaterialShowcaseFragmentDoc>;
  /** Locale-aware page props for building links. */
  globalPageProps: GlobalPageProps;
};

/** Render a grid of CMS-configured materials pointing to product filters. */
const MaterialShowcase = ({ fragment, globalPageProps }: Props) => {
  const { title, description, subDescription, materials } = getFragmentData(
    MaterialShowcaseFragmentDoc,
    fragment,
  );

  return (
    <div className="mx-auto mb-12 max-w-7xl bg-white px-12 lg:px-24">
      <div className="mb-12">
        <h1 className="font-display mt-3 text-center text-3xl font-semibold md:text-4xl">
          {title}
        </h1>

        <p className="mx-auto mb-6 max-w-xl py-4 text-center leading-relaxed text-base">
          {description}
        </p>

        <p className="mx-auto max-w-3xl text-center text-sm leading-loose tracking-wide text-gray-600">
          {subDescription}
        </p>
      </div>

      <div className="-mx-2 flex flex-col flex-wrap lg:flex-row">
        {materials.map((material, _index) => {
          return (
            <Link
              href={`/${globalPageProps.params.lng}/products?materials=${material.id}`}
              className="p-2 transition-all hover:scale-95 lg:w-1/3"
              key={material.id}
            >
              {material.details.image.responsiveImage && (
                <div className="opacity-85 relative mb-8 block h-[300px] rounded-lg bg-black hover:bg-gray-700 md:h-[500px]">
                  <DatoImage
                    fragment={material.details.image.responsiveImage}
                    altOverride={material.details.image.alt}
                    className="h-full w-full rounded-lg object-contain"
                    {...imageFillCoverProps()}
                  />
                </div>
              )}
              <div className="block text-center text-xl font-medium">
                {material.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialShowcase;
