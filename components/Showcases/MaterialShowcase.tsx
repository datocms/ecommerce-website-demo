import { MaterialShowcaseSectionRecord, SiteLocale } from '@/graphql/generated';
import Link from 'next/link';
import { Image as DatoImage, ResponsiveImageType } from 'react-datocms';

type PropTypes = {
  materialSection: MaterialShowcaseSectionRecord;
  lng: SiteLocale;
};

const MaterialShowcase = ({ materialSection, lng }: PropTypes) => {
  return (
    <div className="mx-auto mb-12 max-w-7xl bg-white px-12 lg:px-24">
      <div className="mb-12">
        <h1 className="font-display mt-3 text-center text-3xl font-semibold md:text-4xl">
          {materialSection.title}
        </h1>

        <p className="text-md mx-auto mb-6 max-w-xl py-4 text-center leading-relaxed">
          {materialSection.description}
        </p>

        <p className="mx-auto max-w-3xl text-center text-sm leading-loose tracking-wide text-gray-600">
          {materialSection.subDescription}
        </p>
      </div>

      <div className="-mx-2 flex flex-col flex-wrap lg:flex-row">
        {materialSection.materials.map((material) => {
          return (
            <Link
              href={`/${lng}/products?materials=${material.id}`}
              className="p-2 transition-all hover:scale-95 lg:w-1/3"
              key={material.id}
            >
              {material.details.image.responsiveImage && (
                <div className="opacity-85 relative mb-8 block h-[300px] rounded-lg bg-black hover:bg-gray-700 md:h-[500px]">
                  <DatoImage
                    data={material.details.image.responsiveImage}
                    className="h-full w-full rounded-lg object-contain"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="50% 50%"
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
