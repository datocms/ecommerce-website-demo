import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { IMG_ZOOM, MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import type { BlockBoundaryProps } from '@/components/DatoStructuredText';
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
} & BlockBoundaryProps;

export default function ProductInfoSection({
  fragment,
  material,
  labels,
  lng,
  ...rest
}: Props) {
  const {
    material: materialLabel,
    style: styleLabel,
    weather: weatherLabel,
    occasions: occasionsLabel,
    more,
  } = readFragment(ProductPageLabelsFragment, labels) ?? {};

  // The block's own spec values; fabric is free text, unlike the linked material record below
  const { fabric, style, weather, occasions } = readFragment(
    ProductInfoSectionFragment,
    fragment,
  );

  // The product's linked material record: its name, photo and listing link
  const materialRecord = readFragment(ProductMaterialFragment, material);
  const { image, name, id } = materialRecord ?? {};

  const specs = [
    { key: 'material', label: materialLabel, value: fabric },
    { key: 'style', label: styleLabel, value: style },
    { key: 'weather', label: weatherLabel, value: weather },
    { key: 'occasions', label: occasionsLabel, value: occasions },
  ];

  // Specs beside the material photo. The photo's lg:ml-12 mirrors BUY_BOX_COLUMN's lg:pl-12, so it
  // starts on the buy box's line, and the specs' lg:-mr-12 meets it; without a material they run
  // full width
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
          {image?.responsiveImage && (
            <DatoImage
              fragment={image.responsiveImage}
              layout="fill"
              objectFit="cover"
              sizes="(min-width: 1440px) 560px, (min-width: 1280px) 40vw, (min-width: 1024px) 42vw, 100vw"
              className={IMG_ZOOM}
            />
          )}
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
