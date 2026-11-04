import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import type { Showcase } from './meta';

type Props = {
  lng: string;
  /** The section's accessible name */
  label: string | null | undefined;
  collections: Showcase['collections'];
  cta: Showcase['collectionsCta'][number];
};

export default function CollectionLinks({
  lng,
  label,
  collections,
  cta,
}: Props) {
  return (
    <section
      aria-label={stripStega(label ?? '') || undefined}
      className="shell pt-16 lg:pt-20"
    >
      {/* Snap rail on phones, three columns from md. py-2 keeps the focus rings inside the
          scroller; overflow-y-hidden stops the taller hit areas from scrolling it */}
      <ul className="reveal-stagger no-scrollbar -mx-(--gutter) -my-2 flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto overflow-y-hidden px-(--gutter) py-2 md:mx-0 md:my-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:py-0">
        {collections.map((collection) => (
          <li
            key={collection.id}
            className="flex w-[78%] shrink-0 snap-start sm:w-[44%] md:w-auto"
          >
            {/* cta.slug is a catalog filter prefix ("products?collections="); the id
                completes it */}
            <Link
              href={`/${lng}/${stripStega(cta.slug)}${collection.id}`}
              className="group flex flex-col w-full outline-offset-4"
              data-datocms-content-link-group
            >
              <div aria-hidden="true" className={`${MEDIA} aspect-[4/5]`}>
                {collection.details.image.responsiveImage && (
                  <DatoImage
                    fragment={collection.details.image.responsiveImage}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="50% 30%"
                    sizes="(min-width: 1440px) 443px, (min-width: 768px) 31vw, (min-width: 640px) 42vw, 72vw"
                    className={IMG_ZOOM}
                  />
                )}
              </div>
              {/* hyphens-manual: localized names wrap between words only ("Geschäftlich"
                  at md) */}
              <div className="flex flex-col items-start gap-2 pt-5 flex-1">
                <h2 className="title-card hyphens-manual">{collection.name}</h2>
                <span className="tlink mt-auto">
                  {cta.label}
                  <ArrowRightIcon aria-hidden="true" className="stroke-2" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
