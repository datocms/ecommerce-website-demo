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

// A statement on the grid: pre-title, big title, lead and the CMS button next to a photo when there
// is one (under it on phones), on its own otherwise. From sm the photo is a 4:5 portrait beside the
// text, its top on the text's first line, so it never grows into a screen-sized square; from lg it
// is square and the text sits at its foot.
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
    <div
      className={
        image
          ? 'sm:col-span-7 sm:pl-6 lg:pb-2 lg:pl-12 xl:pl-20'
          : 'max-w-[50rem]'
      }
    >
      {preTitle && <p className="eyebrow">{preTitle}</p>}
      <h2 id={titleId} className={`title-statement ${preTitle ? 'mt-4' : ''}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-6 max-w-[40rem] text-xl leading-[1.42] text-pretty text-ink-2 xl:text-2xl xl:leading-[1.42]">
          {subtitle}
        </p>
      )}
      {cta && (
        <Link
          href={`/${lng}/${stripStega(cta.slug ?? '')}`}
          className="btn mt-10"
        >
          {cta.label}
          <ArrowRightIcon aria-hidden="true" className="stroke-2" />
        </Link>
      )}
    </div>
  );

  return (
    <section aria-labelledby={titleId} className="shell pt-(--section-gap)">
      {image ? (
        <div className="grid gap-10 sm:grid-cols-12 sm:items-start sm:gap-4 lg:items-end">
          <div
            className={`${MEDIA} aspect-square sm:col-span-5 sm:aspect-[4/5] lg:aspect-square`}
          >
            <DatoImage
              fragment={image}
              layout="fill"
              objectFit="cover"
              sizes="(min-width: 1440px) 560px, (min-width: 640px) 40vw, 100vw"
            />
          </div>
          {text}
        </div>
      ) : (
        text
      )}
    </section>
  );
}
