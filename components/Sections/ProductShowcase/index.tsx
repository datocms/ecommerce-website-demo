import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DatoImage from '@/components/DatoImage';
import {
  type FragmentOf,
  type ResultOf,
  readFragment,
} from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { seasonTint } from '../season';
import { CollectionCardShowcaseFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof CollectionCardShowcaseFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Season bands alternate between a white card and the bare page */
  filled?: boolean;
};

type Collection = ResultOf<
  typeof CollectionCardShowcaseFragment
>['collection'][number];

// Grid slots in the sm+ mosaic (3 columns, 2 rows): the lead photo takes two columns on the
// outer edge of the band, the other two stack beside it, next to the copy.
const SLOTS = {
  left: {
    lead: 'sm:col-span-2 sm:col-start-2 sm:row-span-2 sm:row-start-1',
    side: ['sm:col-start-1 sm:row-start-1', 'sm:col-start-1 sm:row-start-2'],
  },
  right: {
    lead: 'sm:col-span-2 sm:col-start-1 sm:row-span-2 sm:row-start-1',
    side: ['sm:col-start-3 sm:row-start-1', 'sm:col-start-3 sm:row-start-2'],
  },
};

function MosaicTile({
  item,
  lng,
  lead,
  className,
  sizes,
}: {
  item: Collection;
  lng: string;
  lead?: boolean;
  className: string;
  sizes: string;
}) {
  return (
    <Link
      href={`/${lng}/products?collections=${item.id}`}
      className={`group @container relative block overflow-hidden rounded-nav bg-oat ${className}`}
      data-datocms-content-link-group
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      >
        {item.details.image.responsiveImage && (
          <DatoImage
            fragment={item.details.image.responsiveImage}
            layout="fill"
            objectFit="cover"
            objectPosition="50% 30%"
            sizes={sizes}
          />
        )}
      </div>
      {lead ? (
        <span className="absolute bottom-4 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-full bg-white py-2 pr-2 pl-5 text-md font-bold shadow-card">
          <span className="truncate">{item.name}</span>
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-cream"
          >
            <ArrowRightIcon className="size-4 stroke-[2.4]" />
          </span>
        </span>
      ) : (
        // Narrow tiles get a compact tag without the disc, so one long word still fits (on the
        // smallest phones it hyphenates); a name that wraps keeps soft corners
        <span className="absolute bottom-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs leading-tight font-semibold shadow-card @min-[12rem]:rounded-card @min-[12rem]:pr-1.5 @min-[12rem]:pl-3.5 @min-[12rem]:text-sm">
          <span className="min-w-0 wrap-break-word hyphens-auto">
            {item.name}
          </span>
          <span
            aria-hidden="true"
            className="hidden size-8 shrink-0 place-items-center rounded-full bg-ink text-cream @min-[12rem]:grid"
          >
            <ArrowRightIcon className="size-[0.9375rem] stroke-[2.4]" />
          </span>
        </span>
      )}
    </Link>
  );
}

const ProductShowcase = ({ fragment, globalPageProps, filled }: Props) => {
  const { id, direction, pretitle, title, description, button, collection } =
    readFragment(CollectionCardShowcaseFragment, fragment);
  const { lng } = globalPageProps.params;

  /**
   * DatoCMS Content Link can add invisible editing markers to draft text.
   * Keep those markers when rendering content, but strip them before exact
   * string logic, URL building, metadata, IDs, or third-party payloads.
   */
  const textLeft = stripStega(direction || '') === 'left';
  const slots = SLOTS[textLeft ? 'left' : 'right'];
  const [lead, ...rest] = collection;
  const side = rest.slice(0, 2);
  // Collections past the third continue under the mosaic as a row of small tiles
  const extra = rest.slice(2);
  const tint = seasonTint(lead?.slug);
  const cta = button[0];
  const titleId = `${id}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className={`@container grid grid-cols-1 gap-8 rounded-card p-(--card-pad) sm:gap-10 xl:items-center xl:gap-12 ${lead ? (textLeft ? 'xl:grid-cols-[minmax(min-content,4fr)_minmax(0,8fr)]' : 'xl:grid-cols-[minmax(0,8fr)_minmax(min-content,4fr)]') : ''}${filled ? ' bg-white' : ''}`}
    >
      {/* From md to xl the title and the copy sit side by side above the mosaic. The title column
          is never narrower than the longest word, so a long season name never breaks mid-word. On
          small phones the title scales with the card so a nine-letter word (Printemps) still fits. */}
      <div
        className={`md:grid md:grid-cols-[minmax(min-content,1fr)_minmax(0,1fr)] md:items-end md:gap-10 xl:block ${textLeft ? '' : 'xl:order-2'}`}
      >
        <div>
          {pretitle && (
            <p
              className={`pretitle ${tint ?? (filled ? 'bg-cream' : 'bg-white')}`}
            >
              {!tint && (
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full bg-butter"
                />
              )}
              {pretitle}
            </p>
          )}
          <h2
            id={titleId}
            className={`season-title wrap-break-word max-sm:text-[min(3.75rem,21cqw)] ${pretitle ? 'mt-5' : ''}`}
          >
            {title}
          </h2>
        </div>
        {(description || cta) && (
          <div className="mt-5 md:mt-0 xl:mt-6">
            {description && (
              <p className="max-w-[24em] text-lg text-pretty text-ink/80 xl:text-[1.1875rem] xl:leading-[1.5]">
                {description}
              </p>
            )}
            {cta && (
              <Link
                href={`/${lng}/${stripStega(cta.slug ?? '')}`}
                className={`btn-primary ${description ? 'mt-6' : ''}`}
              >
                {cta.label}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </div>

      {lead && (
        <div className={`grid gap-3 lg:gap-4 ${textLeft ? '' : 'xl:order-1'}`}>
          <div className="grid grid-cols-2 gap-3 sm:h-[clamp(26.25rem,56vw,35rem)] sm:grid-cols-3 sm:grid-rows-2 lg:gap-4 xl:h-[clamp(31.25rem,40vw,36.25rem)]">
            <MosaicTile
              item={lead}
              lng={lng}
              lead
              className={`col-span-2 aspect-[5/6] sm:aspect-auto ${side.length > 0 ? slots.lead : 'sm:col-span-3 sm:row-span-2'}`}
              sizes="(min-width: 1280px) 38vw, (min-width: 640px) 60vw, 92vw"
            />
            {side.map((item, index) => (
              <MosaicTile
                key={item.id}
                item={item}
                lng={lng}
                className={`sm:aspect-auto ${slots.side[index]} ${side.length === 1 ? 'col-span-2 aspect-[2/1] sm:col-span-1 sm:row-span-2' : 'aspect-square'}`}
                sizes="(min-width: 1280px) 19vw, (min-width: 640px) 30vw, 46vw"
              />
            ))}
          </div>
          {extra.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
              {extra.map((item, index) => (
                <MosaicTile
                  key={item.id}
                  item={item}
                  lng={lng}
                  className={`sm:col-span-1 sm:aspect-[4/3] ${index === extra.length - 1 && extra.length % 2 === 1 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}`}
                  sizes="(min-width: 1280px) 19vw, (min-width: 640px) 30vw, 46vw"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductShowcase;
