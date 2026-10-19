import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DatoImage from '@/components/DatoImage';
import type { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { MEDIA } from '../ui';
import { DividerSectionFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof DividerSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** The hero's second photo, shown beside the first divider only */
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
};

// A short statement: pre-title, title, lead and the CMS button. With the hero's second photo it
// is a full-width band, half photo and half mist panel edge to edge (photo on top on phones);
// without one it is a plain text block on the grid.
export default function DividerSection({
  fragment,
  globalPageProps,
  image,
}: Props) {
  const { id, preTitle, subtitle, title, button } = readFragment(
    DividerSectionFragment,
    fragment,
  );
  const { lng } = globalPageProps.params;
  const cta = button[0];
  const titleId = `${id}-title`;

  const text = (
    <div className="max-w-[34rem]">
      {preTitle && <p className="eyebrow text-mute">{preTitle}</p>}
      <h2 id={titleId} className={`title-section ${preTitle ? 'mt-3' : ''}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base leading-[1.6] text-pretty text-ink-2 lg:text-lg">
          {subtitle}
        </p>
      )}
      {cta && (
        <Link
          href={`/${lng}/${stripStega(cta.slug ?? '')}`}
          className="btn mt-8 w-full sm:w-auto"
        >
          {cta.label}
          <ArrowRightIcon aria-hidden="true" className="stroke-2" />
        </Link>
      )}
    </div>
  );

  if (!image) {
    return (
      <section aria-labelledby={titleId} className="shell pt-(--section-gap)">
        {text}
      </section>
    );
  }

  return (
    <section
      aria-labelledby={titleId}
      className="mt-(--section-gap) grid md:grid-cols-2"
    >
      <div
        className={`${MEDIA} aspect-[4/3] md:aspect-auto md:min-h-[32rem] lg:min-h-[40rem]`}
      >
        <DatoImage
          fragment={image}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 15%"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
      {/* The text keeps the page gutter on the outer edge and centres in the panel's height */}
      <div className="flex items-center bg-mist px-(--gutter) py-14 md:px-12 md:py-16 lg:px-20 xl:px-28">
        {text}
      </div>
    </section>
  );
}
