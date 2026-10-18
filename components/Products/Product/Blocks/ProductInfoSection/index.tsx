import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import DatoImage from '@/components/DatoImage';
import { ProductGeneralInterfaceFragment } from '@/components/Products/Product/GeneralInferface/fragments';
import { MaterialProductFragment } from '@/components/Products/Product/Material/fragments';
import { IMG_ZOOM, MEDIA } from '@/components/Sections/ui';
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
          href={`/${globalPageProps.params.lng}/products?materials=${id}`}
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
};

export default ProductInfoSection;
