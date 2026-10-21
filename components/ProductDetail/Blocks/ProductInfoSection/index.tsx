import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import {
  type ProductPageLabels,
  ProductPageLabelsFragment,
} from '@/components/ProductDetail/fragments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import {
  ProductInfoSectionFragment,
  ProductMaterialFragment,
} from './fragments';

type Props = {
  fragment: FragmentOf<typeof ProductInfoSectionFragment>;
  material: FragmentOf<typeof ProductMaterialFragment> | null | undefined;
  labels: ProductPageLabels;
  lng: string;
  // rest carries data-datocms-content-link-boundary, which DatoStructuredText adds to every block
} & Omit<ComponentPropsWithoutRef<'section'>, 'children'>;

export default function ProductInfoSection({
  fragment,
  material,
  labels,
  lng,
  ...rest
}: Props) {
  const {
    materials: materialLabel,
    style: styleLabel,
    weather: weatherLabel,
    occasions: occasionsLabel,
    more,
  } = readFragment(ProductPageLabelsFragment, labels) ?? {};

  // The block's own spec values; materialSpec is free text, unlike the linked record below
  const {
    material: materialSpec,
    style,
    weather,
    occasions,
  } = readFragment(ProductInfoSectionFragment, fragment);

  // The product's linked material record: its name, photo and listing link
  const materialRecord = readFragment(ProductMaterialFragment, material);
  const { details, name, id } = materialRecord ?? {};

  const specs = [
    { key: 'material', label: materialLabel, value: materialSpec },
    { key: 'style', label: styleLabel, value: style },
    { key: 'weather', label: weatherLabel, value: weather },
    { key: 'occasions', label: occasionsLabel, value: occasions },
  ];

  // Specs on a mist well beside the material photo, both the same height so the row tiles.
  // Without a material the specs run the full width, four across from lg. At lg the photo starts
  // on the buy box's line (column 7 plus 48px) and the specs grow by the same 48px to meet it.
  return (
    <section {...rest} className="grid gap-3 lg:grid-cols-12 lg:gap-4">
      <dl
        className={`grid grid-cols-2 gap-x-8 gap-y-6 bg-mist p-6 sm:p-10 xl:gap-x-12 xl:p-14 ${id ? 'lg:col-span-6 lg:-mr-12 xl:col-span-7 xl:mr-0' : 'lg:col-span-full lg:grid-cols-4'}`}
      >
        {specs.map((spec) => (
          <div
            key={spec.key}
            className={`min-w-0 border-t border-ink/15 pt-6 [&:nth-child(-n+2)]:border-t-0 [&:nth-child(-n+2)]:pt-0 ${id ? '' : 'lg:border-t-0 lg:pt-0'}`}
          >
            <dt className="text-sm text-mute">{spec.label}</dt>
            <dd
              className={`title-item mt-2 leading-[1.1] wrap-break-word hyphens-auto [hyphenate-limit-chars:12_4_4] sm:title-card [&_p]:m-0 ${id ? 'lg:title-item xl:title-card' : ''}`}
            >
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      {id && (
        <Link
          href={`/${lng}/products?materials=${id}`}
          className={`group ${MEDIA} block aspect-[4/3] md:aspect-[16/9] lg:col-span-6 lg:ml-12 lg:aspect-auto xl:col-span-5 xl:ml-0`}
        >
          {details?.image.responsiveImage && (
            <DatoImage
              fragment={details.image.responsiveImage}
              layout="fill"
              objectFit="cover"
              sizes="(min-width: 1440px) 560px, (min-width: 1280px) 40vw, (min-width: 1024px) 42vw, 100vw"
              className={IMG_ZOOM}
            />
          )}
          {/* The material name and More share one white label on the photo, so nothing hangs
              under it and the row stays one clean edge */}
          <span className="absolute bottom-3 left-3 z-10 inline-flex min-h-11 max-w-[calc(100%-1.5rem)] items-center gap-3 bg-white px-4 py-2 text-sm font-semibold">
            <span className="min-w-0 wrap-break-word">{name}</span>
            {more && (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-px shrink-0 bg-line"
                />
                <span className="inline-flex shrink-0 items-center gap-1.5">
                  {more}
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-4 stroke-2 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </>
            )}
          </span>
        </Link>
      )}
    </section>
  );
}
