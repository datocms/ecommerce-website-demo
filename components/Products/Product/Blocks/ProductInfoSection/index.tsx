import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import DatoImage from '@/components/DatoImage';
import { ProductGeneralInterfaceFragment } from '@/components/Products/Product/GeneralInferface/fragments';
import { MaterialProductFragment } from '@/components/Products/Product/Material/fragments';
import { IMG_ZOOM, TILE_LINK } from '@/components/Sections/ui';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { ProductInfoSectionFragment } from './fragments';

type Props = {
  ProductInfoFragment: FragmentOf<typeof ProductInfoSectionFragment>;
  MaterialFragment:
    | FragmentOf<typeof MaterialProductFragment>
    | null
    | undefined;
  globalPageProps: ResolvedGlobalPageProps;
  generalInterfaceFragment:
    | FragmentOf<typeof ProductGeneralInterfaceFragment>
    | null
    | undefined;
} & Omit<ComponentPropsWithoutRef<'section'>, 'children'>;

const ProductInfoSection = ({
  ProductInfoFragment,
  MaterialFragment,
  globalPageProps,
  generalInterfaceFragment,
  ...rest
}: Props) => {
  const {
    materials,
    style: styleString,
    weather: weatherString,
    occasions: occasionsString,
    more,
  } = readFragment(ProductGeneralInterfaceFragment, generalInterfaceFragment) ??
  {};

  const { material, style, weather, occasions } = readFragment(
    ProductInfoSectionFragment,
    ProductInfoFragment,
  );

  const { details, name, id } =
    readFragment(MaterialProductFragment, MaterialFragment) ?? {};

  const specs = [
    { key: 'material', label: materials, value: material },
    { key: 'style', label: styleString, value: style },
    { key: 'weather', label: weatherString, value: weather },
    { key: 'occasions', label: occasionsString, value: occasions },
  ];

  return (
    <section {...rest} className="grid gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5">
      <dl
        className={`surface-forest grid grid-cols-2 gap-x-6 gap-y-7 rounded-card p-(--card-pad) sm:gap-x-10 lg:p-(--panel-pad) ${id ? 'lg:col-span-8' : 'lg:col-span-full'}`}
      >
        {specs.map((spec) => (
          <div
            key={spec.key}
            className="min-w-0 border-t border-white/15 pt-5 [&:nth-child(-n+2)]:border-t-0 [&:nth-child(-n+2)]:pt-0"
          >
            <dt className="eyebrow text-butter">{spec.label}</dt>
            <dd className="title-sm mt-2 leading-[1.1] wrap-break-word hyphens-auto [hyphenate-limit-chars:12_4_4] sm:text-[1.75rem] lg:text-[1.5rem] xl:text-[2rem] [&_p]:m-0">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      {id && (
        <Link
          href={`/${globalPageProps.params.lng}/products?materials=${id}`}
          className={`${TILE_LINK} lg:col-span-4`}
        >
          {/* The photo matches the spec card's corners; the link's focus ring is drawn on it */}
          <div className="@container relative aspect-[4/3] overflow-hidden rounded-card bg-oat group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ink group-focus-visible:outline-solid md:aspect-[16/9] lg:aspect-auto lg:h-full">
            {details?.image.responsiveImage && (
              <DatoImage
                fragment={details.image.responsiveImage}
                layout="fill"
                objectFit="cover"
                sizes="(min-width: 1440px) 450px, (min-width: 1024px) 32vw, 100vw"
                className={IMG_ZOOM}
              />
            )}
            {/* Fits its content: a pill with More beside the name, or More under it on narrow photos */}
            <span className="absolute bottom-4 left-4 z-10 grid max-w-[calc(100%-2rem)] grid-cols-[minmax(0,1fr)] items-center justify-items-start gap-x-1.5 gap-y-1 rounded-sheet bg-white p-1.5 text-md font-bold shadow-card @min-[20.5rem]:grid-flow-col">
              <span className="flex min-h-9 items-center pr-1.5 pl-3.5 leading-snug wrap-anywhere hyphens-auto [hyphenate-limit-chars:12_4_4] last:pr-3.5">
                {name}
              </span>
              {more && (
                <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink pr-3 pl-3.5 text-xs whitespace-nowrap text-cream">
                  {more}
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-[0.9375rem] stroke-[2.4]"
                  />
                </span>
              )}
            </span>
          </div>
        </Link>
      )}
    </section>
  );
};

export default ProductInfoSection;
