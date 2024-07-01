import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Image as DatoImage, type ResponsiveImageType } from 'react-datocms';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.showcase) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl bg-white font-sans antialiased">
      <div className="bg-opacity-50">
        <div className="px-12 py-16 md:-mt-8 md:py-32">
          <h1 className="font-display mx-auto max-w-2xl text-center text-4xl font-semibold leading-tight text-gray-800 md:text-5xl">
            {data.showcase.title}
          </h1>
        </div>
        <div className="container relative mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 md:px-12">
          <div className="relative h-screen w-full object-cover">
            <DatoImage
              data={
                data.showcase.displays[0].responsiveImage as ResponsiveImageType
              }
              className="h-full w-full rounded-lg object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
          <div className="relative hidden h-screen w-full object-cover md:mt-32 md:block">
            <DatoImage
              data={
                data.showcase.displays[1].responsiveImage as ResponsiveImageType
              }
              className="h-full w-full rounded-lg object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
        </div>
        <div className="container mx-auto grid grid-cols-1 gap-12 px-12 md:-mt-32 md:grid-cols-2">
          <div className="flex flex-col items-center py-6 md:block md:p-16">
            <p className="mb-8 text-center leading-relaxed text-gray-700 md:mb-12 md:text-left">
              {data.showcase.description}
            </p>
            <Link
              href={`/${globalPageProps.params.lng}/${data.showcase.cta[0].slug}`}
              className="border-b border-gray-700 text-gray-700"
            >
              {data.showcase.cta[0].label}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-12 px-20 pb-16 pt-8 md:grid-cols-3 md:pb-32 md:pt-16">
          {data.showcase.collections.map((collection) => {
            return (
              <Link
                href={`/${globalPageProps.params.lng}/${data.showcase?.collectionsCta[0].slug}${collection.id}`}
                className="relative block h-72 items-end justify-end pb-12 pr-12 text-right hover:opacity-75"
                key={collection.id}
              >
                <div className="relative z-10">
                  <h3 className="font-display mb-6 text-3xl font-semibold text-white">
                    {collection.name}
                  </h3>
                  <span className="border-b border-white pb-1 text-white">
                    {data.showcase?.collectionsCta[0].label}
                  </span>
                </div>
                {collection.details.image.responsiveImage && (
                  <div className="absolute inset-0 h-full w-full rounded-lg object-cover object-right brightness-75">
                    <DatoImage
                      data={
                        collection.details.image
                          .responsiveImage as ResponsiveImageType
                      }
                      className="h-full w-full rounded-lg object-contain"
                      layout="fill"
                      objectFit="cover"
                      objectPosition="70% 30%"
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
        <div className="container mx-auto px-12 pb-16 md:pb-24">
          <h2 className="font-display px-12 text-center text-4xl font-semibold leading-tight text-gray-800 md:text-left md:text-5xl">
            {data.showcase.newProductsTitle}
          </h2>
        </div>
        <div className="container mx-auto grid grid-cols-1 gap-12 px-12 pb-24 md:grid-cols-2">
          <Link
            href={`/${globalPageProps.params.lng}/product/${data.showcase.newProducts[0].slug}`}
            className="block hover:opacity-75"
          >
            <div className="relative h-96 w-full object-cover md:h-screen">
              <DatoImage
                data={
                  data.showcase.newProducts[0].productImages[0]
                    .responsiveImage as ResponsiveImageType
                }
                className="h-full w-full rounded-lg object-contain"
                layout="fill"
                objectFit="cover"
                objectPosition="70% 30%"
              />
            </div>
            <div className="pt-6">
              <h3>{data.showcase.newProducts[0].name}</h3>
              <div className="">
                {data.generalInterface?.currencySymbol}
                {data.showcase.newProducts[0].sale !== 'not_on_sale'
                  ? data.showcase.newProducts[0].salePrice
                  : data.showcase.newProducts[0].price}
                {data.showcase.newProducts[0].sale !== 'not_on_sale' && (
                  <span className="ml-4 text-red-400 line-through">
                    {data.generalInterface?.currencySymbol}
                    {data.showcase.newProducts[0].price}
                  </span>
                )}
              </div>
            </div>
          </Link>
          <Link
            href={`/${globalPageProps.params.lng}/product/${data.showcase.newProducts[1].slug}`}
            className="block hover:opacity-75 md:-mt-32"
          >
            <div className="relative h-96 w-full object-cover md:h-screen">
              <DatoImage
                data={
                  data.showcase.newProducts[1].productImages[0]
                    .responsiveImage as ResponsiveImageType
                }
                className="h-full w-full rounded-lg object-contain"
                layout="fill"
                objectFit="cover"
                objectPosition="70% 30%"
              />
            </div>
            <div className="pt-6">
              <h3>{data.showcase.newProducts[1].name}</h3>
              <div className="">
                {data.generalInterface?.currencySymbol}
                {data.showcase.newProducts[1].sale !== 'not_on_sale'
                  ? data.showcase.newProducts[1].salePrice
                  : data.showcase.newProducts[1].price}
                {data.showcase.newProducts[1].sale !== 'not_on_sale' && (
                  <span className="ml-4 text-red-400 line-through">
                    {data.generalInterface?.currencySymbol}
                    {data.showcase.newProducts[1].price}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="bg-white">
        <div className="container mx-auto grid grid-cols-1 gap-32 px-12 md:grid-cols-2">
          <div>
            <h2 className="font-display px-12 pb-24 text-center text-4xl font-semibold leading-tight text-gray-800 md:text-left md:text-5xl">
              {data.showcase.materialsTitle}
            </h2>
            <div className="relative h-96 w-full object-cover">
              <DatoImage
                data={
                  data.showcase.materialsDisplay[0]
                    .responsiveImage as ResponsiveImageType
                }
                className="h-full w-full rounded-lg object-contain"
                layout="fill"
                objectFit="cover"
                objectPosition="50% 50%"
              />
            </div>
          </div>
          <div className="md:pt-32">
            <div className="relative hidden h-96 w-full object-cover md:block">
              <DatoImage
                data={
                  data.showcase.materialsDisplay[1]
                    .responsiveImage as ResponsiveImageType
                }
                className="h-full w-full rounded-lg object-contain"
                layout="fill"
                objectFit="cover"
                objectPosition="50% 50%"
              />
            </div>
            <div className="-mt-14 px-12 md:mt-0 md:py-24">
              <div className="mb-12 text-center leading-relaxed text-gray-700 md:text-left">
                {data.showcase.materialsDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
