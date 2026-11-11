import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import DatoStructuredText from '@/components/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { productsPath } from '@/lib/routes';
import { MaterialShowcaseFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof MaterialShowcaseFragment>;
  lng: string;
};

const GRID_COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

const IMAGE_SIZES = {
  2: '(min-width: 1440px) 680px, (min-width: 640px) 48vw, 100vw',
  3: '(min-width: 1440px) 450px, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw',
  4: '(min-width: 1440px) 340px, (min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw',
} as const;

// Four columns only when the count fills rows of four but not rows of three (4, 8, 16…)
function columnCount(materials: number): 2 | 3 | 4 {
  if (materials <= 2) return 2;
  if (materials % 4 === 0 && materials % 3 !== 0) return 4;
  return 3;
}

export default function MaterialShowcase({ fragment, lng }: Props) {
  const { id, title, description, subDescription, materials } = readFragment(
    MaterialShowcaseFragment,
    fragment,
  );
  const titleId = `${id}-title`;
  const columns = columnCount(materials.length);

  return (
    <section aria-labelledby={titleId} className="shell pt-(--section-gap)">
      <div className="max-w-[44rem]">
        <h2 id={titleId} className="title-section">
          {title}
        </h2>
        {description && (
          <DatoStructuredText
            data={description}
            className="mt-5 text-lg leading-[1.5] text-pretty"
          />
        )}
        {subDescription && (
          <DatoStructuredText
            data={subDescription}
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
                href={productsPath(lng, { materials: material.id })}
                className="group flex flex-col outline-offset-4"
                data-datocms-content-link-group
              >
                <div className={`${MEDIA} aspect-[4/3]`}>
                  {material.image.responsiveImage && (
                    <DatoImage
                      fragment={material.image.responsiveImage}
                      className={IMG_ZOOM}
                      layout="fill"
                      objectFit="cover"
                      sizes={IMAGE_SIZES[columns]}
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
                {material.subtitle && (
                  <p className="mt-1.5 max-w-[26rem] text-sm text-pretty text-mute">
                    {material.subtitle}
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
