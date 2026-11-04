import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import DatoStructuredText from '@/components/DatoStructuredText';
import {
  type FragmentOf,
  type ResultOf,
  readFragment,
} from '@/lib/datocms/graphql';
import { CollectionCardShowcaseFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof CollectionCardShowcaseFragment>;
  lng: string;
  className: string;
};

type Collection = ResultOf<
  typeof CollectionCardShowcaseFragment
>['collection'][number];

// Keeps a column on the shared four subgrid rows when a row is empty
function EmptyRow() {
  return <span aria-hidden="true" />;
}

function LeadCollection({
  collection,
  pretitle,
  lng,
}: {
  collection: Collection;
  pretitle: string | null;
  lng: string;
}) {
  return (
    <Link
      href={`/${lng}/products?collections=${collection.id}`}
      className={`group block ${MEDIA} aspect-[4/5] outline-offset-4`}
      data-datocms-content-link-group
    >
      {collection.details.image.responsiveImage && (
        <DatoImage
          fragment={collection.details.image.responsiveImage}
          className={IMG_ZOOM}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 30%"
          sizes="(min-width: 1440px) 310px, (min-width: 1024px) 22vw, (min-width: 640px) 44vw, 80vw"
        />
      )}
      {/* Its own Content Link target: the pretitle belongs to the showcase block, not the collection.
          A long one wraps into one tag per line (box-decoration-clone); top-3.5 offsets the 28px
          tag on its 24px line so it sits 12px in like the other tags */}
      {pretitle && (
        <span className="absolute top-3.5 left-3 max-w-[calc(100%-1.5rem)] text-xs leading-6 text-balance">
          <span
            className="tag inline box-decoration-clone py-1.25 leading-6 whitespace-normal"
            data-datocms-content-link-boundary
          >
            {pretitle}
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

function MoreCollections({
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
            href={`/${lng}/products?collections=${item.id}`}
            className="group block outline-offset-4"
            data-datocms-content-link-group
          >
            <div className={`${MEDIA} aspect-[4/5]`}>
              {item.details.image.responsiveImage && (
                <DatoImage
                  fragment={item.details.image.responsiveImage}
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

export default function ShowcaseColumn({ fragment, lng, className }: Props) {
  const { id, pretitle, title, description, button, collection } = readFragment(
    CollectionCardShowcaseFragment,
    fragment,
  );
  const [lead, ...rest] = collection;
  const cta = button[0];
  const titleId = `${id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={`row-span-4 grid snap-start grid-rows-subgrid ${className}`}
    >
      {lead ? (
        <LeadCollection collection={lead} pretitle={pretitle} lng={lng} />
      ) : (
        <EmptyRow />
      )}
      <div className="mt-5">
        <h3 id={titleId} className="title-card">
          {title}
        </h3>
        {description && (
          <DatoStructuredText
            data={description}
            className="mt-3 text-sm leading-[1.5] text-pretty text-ink-2"
          />
        )}
      </div>
      {cta ? (
        <div className="mt-4">
          <Link
            href={`/${lng}/${stripStega(cta.slug ?? '')}`}
            className="tlink"
          >
            {cta.label}
            <ArrowRightIcon aria-hidden="true" className="stroke-2" />
          </Link>
        </div>
      ) : (
        <EmptyRow />
      )}
      {rest.length > 0 ? (
        <MoreCollections collections={rest} lng={lng} />
      ) : (
        <EmptyRow />
      )}
    </article>
  );
}
