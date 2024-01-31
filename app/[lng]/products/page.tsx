export const dynamic = 'force-dynamic';

import '@/styles/global.css';
import { draftMode } from 'next/headers';
import {
  BrandRecord,
  CollectionRecord,
  FilterDetailModelDescriptionField,
  GeneralInterfaceRecord,
  ImageFileField,
  InitialParamsDocument,
  MaterialRecord,
  ProductModelOrderBy,
  ProductsDocument,
  SiteLocale,
} from '@/graphql/generated';
import getAvailableLocales, { getFallbackLocale } from '@/app/i18n/settings';
import queryDatoCMS from '@/utils/queryDatoCMS';
import Link from 'next/link';
import { Image as DatoImage, ResponsiveImageType } from 'react-datocms';
import SideFilter from '@/components/Common/SideFilter';
import Pagination from '@/components/Products/Pagination';
import FilterDetail from '@/components/Products/FilterDetail';


type PropTypes = {
  params: {
    lng: SiteLocale;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateStaticParams() {
  const languages = await getAvailableLocales();
  return languages.map((language) => {
    language;
  });
}

export default async function Products({
  params: { lng },
  searchParams,
}: PropTypes) {
  const { isEnabled } = draftMode();
  const fallbackLng = await getFallbackLocale();
  const pageNumber = parseInt((searchParams?.page as string) ?? '1');
  const orderBy = (searchParams?.orderBy as string) ?? '_publishedAt_DESC';
  const nameSearch = (searchParams?.productName as string) ?? '';

  const initialParams = await queryDatoCMS(
    InitialParamsDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  const collectionParams = (searchParams?.collections as string)
    ?.split('|')
    .filter((collection) => collection.length);

  const collections =
    collectionParams === undefined
      ? initialParams.allCollections.map((collection) => collection.id)
      : collectionParams;

  const brandParams = (searchParams?.brands as string)
    ?.split('|')
    .filter((brand) => brand.length);

  const brands =
    brandParams === undefined
      ? initialParams.allBrands.map((brand) => brand.id)
      : brandParams;

  const materialParams = (searchParams?.materials as string)
    ?.split('|')
    .filter((material) => material.length);
  const materials =
    materialParams === undefined
      ? initialParams.allMaterials.map((material) => material.id)
      : materialParams;

  const data = await queryDatoCMS(
    ProductsDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
      skip: (pageNumber - 1) * 12,
      orderBy: orderBy as ProductModelOrderBy,
      collections,
      brands,
      materials,
      nameSearch,
    },
    isEnabled
  );

  let singleFilter;

  if (materials.length === 1) {
    singleFilter = initialParams.allMaterials.filter(
      (material) => material.id == materials[0]
    )[0];
  } else if (collections.length === 1) {
    singleFilter = initialParams.allCollections.filter(
      (collection) => collection.id == collections[0]
    )[0];
  } else if (brands.length === 1) {
    singleFilter = initialParams.allBrands.filter(
      (brand) => brand.id == brands[0]
    )[0];
  }

  return (
    <>
      {singleFilter && (
        <FilterDetail
          type={(data.generalInterface as any)[singleFilter._modelApiKey]}
          name={singleFilter.name}
          subtitle={singleFilter.details.subtitle ?? ''}
          description={
            singleFilter.details
              .description as FilterDetailModelDescriptionField
          }
          image={singleFilter.details.image as ImageFileField}
        />
      )}
      <div
        className={
          'mx-auto max-w-7xl grid-cols-5 bg-white pt-8 lg:grid' +
          (singleFilter ? ' border-t-2' : '')
        }
      >
        <div className="col-span-1 ml-4  p-4">
          <SideFilter
            collections={initialParams.allCollections as CollectionRecord[]}
            brands={initialParams.allBrands as BrandRecord[]}
            materials={initialParams.allMaterials as MaterialRecord[]}
            paramaterCollections={collections}
            parameterBrands={brands}
            parameterMaterials={materials}
            generalInterface={data.generalInterface as GeneralInterfaceRecord}
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
                      <DatoImage
                        data={
                          product.productImages[0]
                            .responsiveImage as ResponsiveImageType
                        }
                        className="h-full w-full object-contain"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="50% 50%"
                      />

                      {isOnSale && (
                        <span className="absolute left-0 top-3 rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
                          {data.generalInterface?.sale}
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
                            {data.generalInterface?.currencySymbol}
                            {product.salePrice}
                          </span>
                          <span className="mb-0.5 text-red-500 line-through">
                            {data.generalInterface?.currencySymbol}
                            {product.price}
                          </span>
                        </div>
                      )}

                      {!isOnSale && (
                        <div className="flex items-end gap-2">
                          <span className="text-xl font-bold text-gray-800 md:text-xl">
                            {data.generalInterface?.currencySymbol}
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
}
