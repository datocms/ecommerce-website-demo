export const dynamic = 'force-dynamic';

import { getFallbackLocale } from '@/app/i18n/settings';
import SideFilter from '@/components/Common/SideFilter';
import DatoImage from '@/components/DatoImage';
import FilterDetail from '@/components/Products/FilterDetail';
import Pagination from '@/components/Products/Pagination';
import { getFragmentData } from '@/graphql/types';
import {
  InitialParamsDocument,
  InitialParamsFragmentDoc,
  ProductModelOrderBy,
  ProductsDocument,
  ProductsGeneralInterfaceFragmentDoc,
} from '@/graphql/types/graphql';
import '@/styles/global.css';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { Record, StructuredText } from 'datocms-structured-text-utils';
import { draftMode } from 'next/headers';
import Link from 'next/link';

type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    orderBy?: ProductModelOrderBy;
    productName?: string;
    collections?: string;
    brands?: string;
    materials?: string;
  };
};

const Page = async ({ params: { lng }, searchParams }: PageProps) => {
  const { isEnabled } = draftMode();
  const fallbackLng = await getFallbackLocale();
  const pageNumber = Number.parseInt(searchParams?.page ?? '1');
  const orderBy: ProductModelOrderBy =
    searchParams?.orderBy ?? ProductModelOrderBy.CreatedAtAsc;
  const nameSearch = searchParams?.productName ?? '';

  const initialParams = await queryDatoCMS(
    InitialParamsDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled,
  );

  const { allBrands, allCollections, allMaterials } =
    getFragmentData(InitialParamsFragmentDoc, initialParams) ?? {};

  const collectionParams = searchParams?.collections
    ?.split('|')
    .filter((collection) => collection.length);

  const collections =
    collectionParams === undefined
      ? allCollections.map((collection) => collection.id)
      : collectionParams;

  const brandParams = searchParams?.brands
    ?.split('|')
    .filter((brand) => brand.length);

  const brands =
    brandParams === undefined
      ? allBrands.map((brand) => brand.id)
      : brandParams;

  const materialParams = searchParams?.materials
    ?.split('|')
    .filter((material) => material.length);
  const materials =
    materialParams === undefined
      ? allMaterials.map((material) => material.id)
      : materialParams;

  const data = await queryDatoCMS(
    ProductsDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
      skip: (pageNumber - 1) * 12,
      orderBy: orderBy,
      collections,
      brands,
      materials,
      nameSearch,
    },
    isEnabled,
  );

  let singleFilter = null;

  if (materials.length === 1) {
    singleFilter = allMaterials.filter(
      (material) => material.id === materials[0],
    )[0];
  } else if (collections.length === 1) {
    singleFilter = allCollections.filter(
      (collection) => collection.id === collections[0],
    )[0];
  } else if (brands.length === 1) {
    singleFilter = allBrands.filter((brand) => brand.id === brands[0])[0];
  }

  const {
    sale,
    currencySymbol,
    BrandRecord,
    CollectionRecord,
    MaterialRecord,
  } =
    getFragmentData(
      ProductsGeneralInterfaceFragmentDoc,
      data.generalInterface,
    ) ?? {};

  const type =
    singleFilter?.__typename === 'BrandRecord'
      ? BrandRecord
      : singleFilter?.__typename === 'CollectionRecord'
        ? CollectionRecord
        : singleFilter?.__typename === 'MaterialRecord'
          ? MaterialRecord
          : null;

  return (
    <>
      {singleFilter && (
        <FilterDetail
          type={type}
          name={singleFilter.name}
          subtitle={singleFilter.details.subtitle ?? ''}
          description={
            singleFilter.details.description as StructuredText<Record, Record>
          }
          image={singleFilter.details.image.responsiveImage}
        />
      )}
      <div
        className={`mx-auto max-w-7xl grid-cols-5 bg-white pt-8 lg:grid${
          singleFilter ? ' border-t-2' : ''
        }`}
      >
        <div className="col-span-1 ml-4  p-4">
          <SideFilter
            initialParams={initialParams}
            generalInterface={data.generalInterface}
            paramaterCollections={collections}
            parameterBrands={brands}
            parameterMaterials={materials}
          />
        </div>
        <div className="col-span-4 ml-4 bg-white px-16 md:px-0 lg:ml-0">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {data.allProducts.map((product) => {
                const isOnSale = product.sale === 'on_sale';
                return (
                  <div
                    key={product.id}
                    className="group rounded-lg opacity-95 shadow-lg transition duration-200 hover:scale-105 hover:cursor-pointer hover:opacity-100"
                  >
                    <Link
                      href={`/${lng}/product/${product.slug}`}
                      className="relative block h-96 overflow-hidden rounded-t-lg bg-gray-100"
                    >
                      {product.productImages[0].responsiveImage && (
                        <DatoImage
                          fragment={product.productImages[0].responsiveImage}
                          className="h-full w-full object-contain"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="50% 50%"
                        />
                      )}

                      {isOnSale && (
                        <span className="absolute left-0 top-3 rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
                          {sale}
                        </span>
                      )}
                    </Link>

                    <div className="flex h-24 w-full items-center justify-between gap-2 overflow-hidden rounded-b-lg bg-primary/5 p-4">
                      <div className="flex flex-col justify-center">
                        <a
                          href="#"
                          className="lg:text-md overflow-hidden font-bold text-gray-800 transition duration-100 hover:text-gray-500"
                        >
                          {product.name}
                        </a>
                        <span className="text-sm text-gray-500">
                          {product.brand.name}
                        </span>
                      </div>

                      {isOnSale && (
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xl font-bold text-gray-800 md:text-xl">
                            {currencySymbol}
                            {product.salePrice}
                          </span>
                          <span className="mb-0.5 text-red-500 line-through">
                            {currencySymbol}
                            {product.price}
                          </span>
                        </div>
                      )}

                      {!isOnSale && (
                        <div className="flex items-end gap-2">
                          <span className="text-xl font-bold text-gray-800 md:text-xl">
                            {currencySymbol}
                            {product.price}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Pagination
        numberOfProducts={data._allProductsMeta.count}
        currentPage={pageNumber}
      />
    </>
  );
};

export default Page;
