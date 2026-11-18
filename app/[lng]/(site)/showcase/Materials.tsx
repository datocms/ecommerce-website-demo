import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import DatoStructuredText from '@/components/DatoStructuredText';
import { productsPath } from '@/lib/routes';
import { coverSizes, FRAMES, imageRatio, type Photo } from './imageSizes';
import type { Showcase } from './meta';

type Props = {
  lng: string;
  title: Showcase['materialsTitle'];
  description: Showcase['materialsDescription'];
  /** One or two */
  photos: Photo[];
  shopNow: string | null | undefined;
};

export default function Materials({
  lng,
  title,
  description,
  photos,
  shopNow,
}: Props) {
  const hasPhotos = photos.length > 0;
  const lonePhoto = photos.length === 1;

  return (
    <section
      aria-labelledby="materials-title"
      className="shell pt-(--section-gap)"
    >
      {/* From lg the photos stretch to the copy column; the title has its own row until xl */}
      <div
        className={
          hasPhotos
            ? 'grid gap-y-6 lg:grid-cols-12 lg:gap-x-4 lg:gap-y-12 xl:grid-rows-[auto_1fr] xl:gap-y-6'
            : 'max-w-[45rem]'
        }
      >
        {/* Whole words only from sm: "Qualitätsmaterialien" fits the column at every width */}
        <h2
          id="materials-title"
          className={`title-section sm:hyphens-manual ${hasPhotos ? 'lg:col-span-12 xl:col-span-5 xl:pr-8' : ''}`}
        >
          {title}
        </h2>
        {(description || shopNow) && (
          <div
            className={`flex max-w-[36rem] flex-col items-start gap-8 ${
              hasPhotos
                ? 'lg:col-span-5 lg:max-w-none lg:pr-8 xl:col-start-1 xl:row-start-2'
                : 'mt-6'
            }`}
          >
            {description && (
              <DatoStructuredText
                data={description}
                className="text-md leading-[1.65] text-pretty text-ink-2"
              />
            )}
            {shopNow && (
              <Link href={productsPath(lng)} className="btn">
                {shopNow}
                <ArrowRightIcon aria-hidden="true" className="stroke-2" />
              </Link>
            )}
          </div>
        )}
        {hasPhotos && (
          <div
            className={`reveal-stagger mt-4 grid gap-3 lg:col-span-7 lg:mt-0 lg:gap-4 xl:col-start-6 xl:row-span-2 xl:row-start-1 ${lonePhoto ? '' : 'grid-cols-2'}`}
          >
            {/* w-full: a stretched photo would otherwise widen with its ratio */}
            {photos.map(({ id, responsiveImage }) => (
              <div
                key={id}
                className={`${MEDIA} w-full lg:self-stretch ${lonePhoto ? 'aspect-[4/3] lg:aspect-[5/2]' : 'aspect-[4/5] lg:aspect-[4/3]'}`}
              >
                <DatoImage
                  fragment={responsiveImage}
                  layout="fill"
                  objectFit="cover"
                  sizes={coverSizes(
                    FRAMES[lonePhoto ? 'loneMaterial' : 'material'],
                    imageRatio(responsiveImage),
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
