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
import { getInitialParamsPublishedCached } from '@/utils/cachedQueries';
import { getProductPriceEditAttributes } from '@/utils/datocmsVisualEditing';
import type {
  AsyncGlobalPageProps,
  GlobalPageProps,
} from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type {
  StructuredText,
  Record as StructuredTextRecord,
} from 'datocms-structured-text-utils';
import { stripStega } from 'datocms-visual-editing';
import { draftMode } from 'next/headers';
import Link from 'next/link';

type PageProps = GlobalPageProps & {
  searchParams: {
    page?: string;
    orderBy?: ProductModelOrderBy;
    productName?: string;
    collections?: string;
    brands?: string;
    materials?: string;
  };
};

type ProductsSearchParams =
  | URLSearchParams
  | {
      page?: string;
      orderBy?: ProductModelOrderBy;
      productName?: string;
      collections?: string;
      brands?: string;
      materials?: string;
    };

const Page = async ({
  params,
  searchParams,
}: AsyncGlobalPageProps<PageProps, ProductsSearchParams>) => {
  const resolvedParams = await params;

  if (!resolvedParams?.lng) {
    throw new Error('Missing locale parameter in products page.');
  }

  const lng = resolvedParams.lng as PageProps['params']['lng'];
  const resolvedSearchParams = await searchParams;
  const searchParamsRecord =
    resolvedSearchParams instanceof URLSearchParams
      ? (Object.fromEntries(resolvedSearchParams.entries()) as Record<
          string,
          string
        >)
      : ((resolvedSearchParams ?? {}) as Record<
          string,
          string | string[] | undefined
        >);

  const firstValue = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const { isEnabled } = await draftMode();
  const fallbackLng = await getFallbackLocale();
  const pageNumber = Number.parseInt(
    firstValue(searchParamsRecord?.page) ?? '1',
  );
  const orderBy: ProductModelOrderBy =
    (firstValue(searchParamsRecord?.orderBy) as
      | ProductModelOrderBy
      | undefined) ?? ProductModelOrderBy.CreatedAtAsc;
  const nameSearch = firstValue(searchParamsRecord?.productName) ?? '';

  const includeVisualEditingMetadata = isEnabled;

  const initialParams = isEnabled
    ? await queryDatoCMS(
        InitialParamsDocument,
        {
          locale: lng,
          fallbackLocale: [fallbackLng],
        },
        { isDraft: isEnabled },
      )
    : await getInitialParamsPublishedCached(lng, fallbackLng);

  const { allBrands, allCollections, allMaterials } =
    getFragmentData(InitialParamsFragmentDoc, initialParams) ?? {};

  const rawCollections = searchParamsRecord?.collections;
  const collectionParams =
    typeof rawCollections === 'string'
      ? rawCollections.split('|').filter((collection) => collection.length)
      : rawCollections;

  const collections =
    collectionParams === undefined
      ? allCollections.map((collection) => collection.id)
      : collectionParams;

  const rawBrands = searchParamsRecord?.brands;
  const brandParams =
    typeof rawBrands === 'string'
      ? rawBrands.split('|').filter((brand) => brand.length)
      : rawBrands;

  const brands =
    brandParams === undefined
      ? allBrands.map((brand) => brand.id)
      : brandParams;

  const rawMaterials = searchParamsRecord?.materials;
  const materialParams =
    typeof rawMaterials === 'string'
      ? rawMaterials.split('|').filter((material) => material.length)
      : rawMaterials;
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
      ...(includeVisualEditingMetadata ? { visualEditing: true } : {}),
    },
    { isDraft: isEnabled, visualEditing: includeVisualEditingMetadata },
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
            singleFilter.details.description as StructuredText<
              StructuredTextRecord,
              StructuredTextRecord
            >
          }
          image={singleFilter.details.image.responsiveImage}
          imageAlt={singleFilter.details.image.alt}
          descriptionEditingUrl={
            (singleFilter.details as { _editingUrl?: string | null })
              ?._editingUrl ?? null
          }
          locale={lng}
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
                const firstProductImage = product.productImages[0];
                const saleStatus = stripStega(product.sale ?? '');
                const isOnSale = saleStatus === 'on_sale';
                const editingUrl = (product as { _editingUrl?: string | null })
                  ._editingUrl;
                const priceEditAttributes = getProductPriceEditAttributes(
                  editingUrl,
                  lng,
                );
                const salePriceEditAttributes = getProductPriceEditAttributes(
                  editingUrl,
                  lng,
                  { fieldPath: 'sale_price' },
                );
                return (
                  <div
                    key={product.id}
                    className="group rounded-lg opacity-95 shadow-lg transition duration-200 hover:scale-105 hover:cursor-pointer hover:opacity-100"
                  >
                    <Link
                      href={`/${lng}/product/${product.slug}`}
                      className="relative block h-96 overflow-hidden rounded-t-lg bg-gray-100"
                    >
                      {firstProductImage?.responsiveImage && (
                        <DatoImage
                          fragment={firstProductImage.responsiveImage}
                          altOverride={firstProductImage.alt ?? null}
                          className="h-full w-full object-contain"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="50% 50%"
                        />
                      )}

                      {isOnSale && (
                        <span className="absolute left-0 top-3 rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
                          {sale ?? ''}
                        </span>
                      )}
                    </Link>

                    <div className="flex h-24 w-full items-center justify-between gap-2 overflow-hidden rounded-b-lg bg-primary/5 p-4">
                      <div className="flex flex-col justify-center">
                        <a
                          href="#"
                          className="lg:text-md overflow-hidden font-bold text-gray-800 transition duration-100 hover:text-gray-500"
                        >
                          {product.name ?? ''}
                        </a>
                        <span className="text-sm text-gray-500">
                          {product.brand?.name ?? ''}
                        </span>
                      </div>

                      {isOnSale && (
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className="text-xl font-bold text-gray-800 md:text-xl"
                            {...salePriceEditAttributes}
                            data-datocms-edit-target
                          >
                            {`${currencySymbol ?? ''}${
                              product.salePrice ?? ''
                            }`}
                          </span>
                          <span
                            className="mb-0.5 text-red-500 line-through"
                            {...priceEditAttributes}
                            data-datocms-edit-target
                          >
                            {`${currencySymbol ?? ''}${product.price ?? ''}`}
                          </span>
                        </div>
                      )}

                      {!isOnSale && (
                        <div className="flex items-end gap-2">
                          <span
                            className="text-xl font-bold text-gray-800 md:text-xl"
                            {...priceEditAttributes}
                            data-datocms-edit-target
                          >
                            {`${currencySymbol ?? ''}${product.price ?? ''}`}
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
