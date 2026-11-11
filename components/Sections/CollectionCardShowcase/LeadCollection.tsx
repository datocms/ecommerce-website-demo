import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { productsPath } from '@/lib/routes';
import type { Collection } from './types';

export default function LeadCollection({
  collection,
  preTitle,
  lng,
}: {
  collection: Collection;
  preTitle: string | null;
  lng: string;
}) {
  return (
    <Link
      href={productsPath(lng, { collections: collection.id })}
      className={`group block ${MEDIA} aspect-[4/5] outline-offset-4`}
      data-datocms-content-link-group
    >
      {collection.image.responsiveImage && (
        <DatoImage
          fragment={collection.image.responsiveImage}
          className={IMG_ZOOM}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 30%"
          sizes="(min-width: 1440px) 310px, (min-width: 1024px) 22vw, (min-width: 640px) 44vw, 80vw"
        />
      )}
      {/* Its own Content Link target (the preTitle belongs to the showcase block); top-3.5 offsets
          the 28px tag on its 24px line so it sits 12px in like the other tags */}
      {preTitle && (
        <span className="absolute top-3.5 left-3 max-w-[calc(100%-1.5rem)] text-xs leading-6 text-balance">
          <span
            className="tag inline box-decoration-clone py-1.25 leading-6 whitespace-normal"
            data-datocms-content-link-boundary
          >
            {preTitle}
          </span>
        </span>
      )}
      {/* Dark and tall enough to keep the white caption at AA on the lightest photos */}
      <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-linear-to-t from-ink/75 to-transparent px-4 pt-20 pb-4 text-sm font-semibold text-white">
        {collection.name}
        <ArrowRightIcon
          aria-hidden="true"
          className="size-4 shrink-0 stroke-2 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
