import { ArrowRightIcon } from '@heroicons/react/24/outline';
import OptionalLink from '@/components/Common/OptionalLink';
import DatoStructuredText from '@/components/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { linkHref } from '@/lib/datocms/linkHref';
import EmptyRow from './EmptyRow';
import { CollectionCardShowcaseFragment } from './fragments';
import LeadCollection from './LeadCollection';
import MoreCollections from './MoreCollections';

type Props = {
  fragment: FragmentOf<typeof CollectionCardShowcaseFragment>;
  lng: string;
  className: string;
};

export default function ShowcaseColumn({ fragment, lng, className }: Props) {
  const {
    id,
    preTitle,
    title,
    description,
    button: cta,
    collection,
  } = readFragment(CollectionCardShowcaseFragment, fragment);
  const [lead, ...rest] = collection;
  const titleId = `${id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={`row-span-4 grid snap-start grid-rows-subgrid ${className}`}
    >
      {lead ? (
        <LeadCollection collection={lead} preTitle={preTitle} lng={lng} />
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
          <OptionalLink href={linkHref(lng, cta)} className="tlink">
            {cta.label}
            <ArrowRightIcon aria-hidden="true" className="stroke-2" />
          </OptionalLink>
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
