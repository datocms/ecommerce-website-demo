import DatoImage from '@/components/DatoImage';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { MaterialShowcaseFragmentDoc } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { extractDatoFieldPath } from '@/utils/datocmsVisualEditing';
import { decodeStega, stripStega } from 'datocms-visual-editing';
import Link from 'next/link';

type Props = {
  fragment: FragmentType<typeof MaterialShowcaseFragmentDoc>;
  globalPageProps: GlobalPageProps;
};

const MaterialShowcase = ({ fragment, globalPageProps }: Props) => {
  const { title, description, subDescription, materials } = getFragmentData(
    MaterialShowcaseFragmentDoc,
    fragment,
  );

  if (process.env.NODE_ENV !== 'production') {
    const entries = materials
      .map((material, index) => {
        const image = material.details.image;
        if (!image || !image.alt) return null;

        const rawAlt = image.alt;
        const metadata = decodeStega(rawAlt);
        const translatedAlt = stripStega(rawAlt);
        const datoUrl = image._editingUrl ?? metadata?.editUrl ?? null;

        return {
          index,
          materialId: material.id,
          datoUrl,
          fieldPath:
            metadata?.fieldPath ??
            extractDatoFieldPath(datoUrl) ??
            `materials.${index}.details.image`,
          locale: metadata?.locale ?? null,
          environment: metadata?.environment ?? null,
          itemId: metadata?.itemId ?? null,
          itemTypeId: metadata?.itemTypeId ?? null,
          stega: rawAlt,
          translatedAlt,
        };
      })
      .filter(Boolean);

    if (entries.length > 0) {
      console.debug('[visual-editing][MaterialShowcase]', entries);
    }
  }
  return (
    <div className="mx-auto mb-12 max-w-7xl bg-white px-12 lg:px-24">
      <div className="mb-12">
        <h1 className="font-display mt-3 text-center text-3xl font-semibold md:text-4xl">
          {title}
        </h1>

        <p className="text-md mx-auto mb-6 max-w-xl py-4 text-center leading-relaxed">
          {description}
        </p>

        <p className="mx-auto max-w-3xl text-center text-sm leading-loose tracking-wide text-gray-600">
          {subDescription}
        </p>
      </div>

      <div className="-mx-2 flex flex-col flex-wrap lg:flex-row">
        {materials.map((material, index) => {
          return (
            <Link
              href={`/${globalPageProps.params.lng}/products?materials=${material.id}`}
              className="p-2 transition-all hover:scale-95 lg:w-1/3"
              key={material.id}
            >
              {material.details.image.responsiveImage && (
                <div
                  data-datocms-field-path={`materials.${index}.details.image`}
                  className="opacity-85 relative mb-8 block h-[300px] rounded-lg bg-black hover:bg-gray-700 md:h-[500px]"
                >
                  <DatoImage
                    fragment={material.details.image.responsiveImage}
                    assetAlt={material.details.image.alt}
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
