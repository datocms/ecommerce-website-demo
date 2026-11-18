import Link from 'next/link';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { productsPath } from '@/lib/routes';
import type { Collection } from './types';

export default function MoreCollections({
  collections,
  lng,
}: {
  collections: Collection[];
  lng: string;
}) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5">
      {collections.map((item) => (
        <li key={item.id}>
          <Link
            href={productsPath(lng, { collections: item.id })}
            className="group block outline-offset-4"
            data-datocms-content-link-group
          >
            <div className={`${MEDIA} aspect-[4/5]`}>
              {item.image.responsiveImage && (
                <DatoImage
                  fragment={item.image.responsiveImage}
                  className={IMG_ZOOM}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="50% 30%"
                  sizes="(min-width: 1440px) 150px, (min-width: 1024px) 11vw, (min-width: 640px) 22vw, 40vw"
                />
              )}
            </div>
            <p className="mt-2.5 text-sm leading-tight font-medium underline-offset-4 group-hover:underline">
              {item.name}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
