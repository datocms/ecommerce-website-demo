import { ArrowRightIcon } from '@heroicons/react/24/outline';
import {
  type CdaStructuredTextValue,
  hasChildren,
} from 'datocms-structured-text-utils';
import Link from 'next/link';
import { Fragment } from 'react';
import { renderNodeRule, StructuredText } from 'react-datocms/structured-text';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import DatoStructuredText from '@/components/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import { MaterialShowcaseFragment } from './fragments';

// Every node with children (paragraphs, headings, lists, links) unwraps to its content
const INLINE_ONLY = [
  renderNodeRule(hasChildren, ({ children, key }) => (
    <Fragment key={key}>{children}</Fragment>
  )),
];

type Props = {
  fragment: FragmentOf<typeof MaterialShowcaseFragment>;
  globalPageProps: ResolvedGlobalPageProps;
};

const GRID_COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

const SIZES = {
  2: '(min-width: 1440px) 680px, (min-width: 640px) 48vw, 100vw',
  3: '(min-width: 1440px) 450px, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw',
  4: '(min-width: 1440px) 340px, (min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw',
} as const;

// Title and copy on top, then a grid of material photo links (2, 3 or 4 columns), each with its
// name and subtitle.
export default function MaterialShowcase({ fragment, globalPageProps }: Props) {
  const { id, title, description, subDescription, materials } = readFragment(
    MaterialShowcaseFragment,
    fragment,
  );
  const { lng } = globalPageProps.params;
  const titleId = `${id}-title`;
  // Four columns only when the count fills rows of four but not rows of three (4, 8, 16…)
  const columns =
    materials.length <= 2
      ? 2
      : materials.length % 4 === 0 && materials.length % 3 !== 0
        ? 4
        : 3;

  return (
    <section aria-labelledby={titleId} className="shell pt-(--section-gap)">
      <div className="max-w-[44rem]">
        <h2 id={titleId} className="title-section">
          {title}
        </h2>
        {description && (
          <DatoStructuredText
            data={description as CdaStructuredTextValue}
            className="mt-5 text-lg leading-[1.5] text-pretty"
          />
        )}
        {subDescription && (
          <DatoStructuredText
            data={subDescription as CdaStructuredTextValue}
            className="mt-3 text-base leading-[1.65] text-pretty text-ink-2"
          />
        )}
      </div>

      {materials.length > 0 && (
        <ul
          className={`reveal-stagger mt-10 grid gap-x-4 gap-y-10 lg:mt-14 ${GRID_COLUMNS[columns]}`}
        >
          {materials.map((material) => (
            <li key={material.id}>
              <Link
                href={`/${lng}/products?materials=${material.id}`}
                className="group flex flex-col outline-offset-4"
                data-datocms-content-link-group
              >
                <div className={`${MEDIA} aspect-[4/3]`}>
                  {material.details.image.responsiveImage && (
                    <DatoImage
                      fragment={material.details.image.responsiveImage}
                      className={IMG_ZOOM}
                      layout="fill"
                      objectFit="cover"
                      sizes={SIZES[columns]}
                    />
                  )}
                </div>
                <h3 className="title-item mt-4 inline-flex items-center gap-2">
                  {material.name}
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-[1.125rem] shrink-0 stroke-2 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </h3>
                {material.details.subtitle && (
                  <p className="mt-1.5 max-w-[26rem] text-sm text-pretty text-mute">
                    {/* The listing header renders the whole subtitle; here it is inline marks
                        only, inside this one line of the card's link */}
                    <StructuredText
                      data={material.details.subtitle as CdaStructuredTextValue}
                      customNodeRules={INLINE_ONLY}
                    />
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
