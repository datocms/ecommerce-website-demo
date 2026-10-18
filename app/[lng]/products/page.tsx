export const dynamic = 'force-dynamic';

import { stripStega } from '@datocms/content-link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { Record, StructuredText } from 'datocms-structured-text-utils';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { getFallbackLocale, type SiteLocale } from '@/app/i18n/settings';
import ProductCard from '@/components/Common/ProductCard';
import SideFilter, { SortChips } from '@/components/Common/SideFilter';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import FilterDetail from '@/components/Products/FilterDetail';
import { ProductsGeneralInterfaceFragment } from '@/components/Products/GeneralInterface/fragments';
import { InitialParamsFragment } from '@/components/Products/InitialParams/fragments';
import Pagination from '@/components/Products/Pagination';
import ProductFilters from '@/components/Products/ProductFilters';
import { graphql, readFragment } from '@/lib/datocms/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';

type ProductModelOrderBy = ReturnType<
  typeof graphql.scalar<'ProductModelOrderBy'>
>;

// Must match `first` in the products query below
const PAGE_SIZE = 12;

const productsQuery = graphql(
  /* GraphQL */ `
    query Products(
      $locale: SiteLocale
      $fallbackLocale: [SiteLocale!]
      $skip: IntType
      $orderBy: [ProductModelOrderBy]
      $collections: [ItemId]
      $brands: [ItemId]
      $materials: [ItemId]
      $nameSearch: String!
    ) {
      allProducts(
        first: 12
        locale: $locale
        fallbackLocales: $fallbackLocale
        skip: $skip
        orderBy: $orderBy
        filter: {
          collections: { anyIn: $collections }
          AND: {
            brand: { in: $brands }
            AND: {
              material: { in: $materials }
              AND: { name: { matches: { pattern: $nameSearch } } }
            }
          }
        }
      ) {
        id
        slug
        sale
        salePrice
        productImages {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        price
        name
        brand {
          name
        }
      }
      _allProductsMeta(
        locale: $locale
        filter: {
          collections: { anyIn: $collections }
          AND: {
            brand: { in: $brands }
            AND: {
              material: { in: $materials }
              AND: { name: { matches: { pattern: $nameSearch } } }
            }
          }
        }
      ) {
        count
      }
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        ...ProductsGeneralInterfaceFragment
      }
    }
  `,
  [ResponsiveImageFragment, ProductsGeneralInterfaceFragment],
);

const initialParamsQuery = graphql(
  /* GraphQL */ `
    query InitialParams($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      ...InitialParamsFragment
    }
  `,
  [InitialParamsFragment],
);

type PageProps = {
  params: Promise<{
    lng: string;
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    orderBy?: ProductModelOrderBy;
    productName?: string;
    collections?: string;
    brands?: string;
    materials?: string;
  }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { lng } = await params;
  const resolvedSearchParams = await searchParams;
  const { isEnabled } = await draftMode();
  const fallbackLng = await getFallbackLocale();
  // Out-of-range values like ?page=0 would make `skip` negative and fail the query
  const pageNumber = Math.max(
    1,
    Number.parseInt(resolvedSearchParams?.page ?? '1', 10) || 1,
  );
  const orderBy: ProductModelOrderBy =
    resolvedSearchParams?.orderBy ?? '_createdAt_ASC';
  const nameSearch = resolvedSearchParams?.productName ?? '';

  const initialParams = await queryDatoCMS(
    initialParamsQuery,
    {
      locale: lng as SiteLocale,
      fallbackLocale: [fallbackLng],
    },
    isEnabled,
  );

  const { allBrands, allCollections, allMaterials } =
    readFragment(InitialParamsFragment, initialParams) ?? {};

  const collectionParams = resolvedSearchParams?.collections
    ?.split('|')
    .filter((collection) => collection.length);

  const collections =
    collectionParams === undefined
      ? allCollections.map((collection) => collection.id)
      : collectionParams;

  const brandParams = resolvedSearchParams?.brands
    ?.split('|')
    .filter((brand) => brand.length);

  const brands =
    brandParams === undefined
      ? allBrands.map((brand) => brand.id)
      : brandParams;

  const materialParams = resolvedSearchParams?.materials
    ?.split('|')
    .filter((material) => material.length);
  const materials =
    materialParams === undefined
      ? allMaterials.map((material) => material.id)
      : materialParams;

  const data = await queryDatoCMS(
    productsQuery,
    {
      locale: lng as SiteLocale,
      fallbackLocale: [fallbackLng],
      skip: (pageNumber - 1) * PAGE_SIZE,
      orderBy: [orderBy],
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
    readFragment(ProductsGeneralInterfaceFragment, data.generalInterface) ?? {};

  const type =
    singleFilter?.__typename === 'BrandRecord'
      ? BrandRecord
      : singleFilter?.__typename === 'CollectionRecord'
        ? CollectionRecord
        : singleFilter?.__typename === 'MaterialRecord'
          ? MaterialRecord
          : null;

  // Mirrors SideFilter: a group narrows the listing unless every option is on
  const isNarrowed = (selected: string[], options: { id: string }[]) =>
    options.some((option) => !selected.includes(option.id));
  const narrowed = [
    isNarrowed(collections, allCollections),
    isNarrowed(materials, allMaterials),
    isNarrowed(brands, allBrands),
  ].filter(Boolean).length;

  const count = data._allProductsMeta.count;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  const hrefWithout = (...keys: string[]) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearchParams ?? {})) {
      if (!keys.includes(key) && value !== undefined) params.set(key, value);
    }
    const query = params.toString();
    return `/${lng}/products${query ? `?${query}` : ''}`;
  };

  const emptyState =
    count === 0
      ? {
          title: 'No products match these filters',
          body: 'Try removing a filter or searching for something else.',
          href: `/${lng}/products`,
          cta: 'View all products',
        }
      : {
          title: 'This page is empty',
          body: `These results end on page ${totalPages}.`,
          href: hrefWithout('page'),
          cta: 'Back to the first page',
        };

  return (
    <>
      {singleFilter ? (
        <FilterDetail
          lng={lng}
          type={type}
          name={singleFilter.name}
          subtitle={singleFilter.details.subtitle ?? ''}
          description={
            singleFilter.details.description as StructuredText<Record, Record>
          }
          image={singleFilter.details.image.responsiveImage}
          logo={singleFilter.__typename === 'BrandRecord'}
        />
      ) : (
        <h1 className="sr-only">Products</h1>
      )}
      <ProductFilters
        count={count}
        lng={lng}
        narrowed={narrowed}
        framed={Boolean(singleFilter)}
        sort={<SortChips generalInterface={data.generalInterface} />}
        searchChip={
          nameSearch ? (
            <Link
              href={hrefWithout('productName', 'page')}
              aria-label={`Clear search “${nameSearch}”`}
              className="chip min-w-0 gap-2 pr-1.5 pl-4"
            >
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="stroke-[2.4] text-muted"
              />
              <span className="min-w-0 truncate">“{nameSearch}”</span>
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-cream [&>svg]:size-[0.9375rem] [&>svg]:stroke-[2.6]"
              >
                <XMarkIcon />
              </span>
            </Link>
          ) : undefined
        }
      >
        <SideFilter
          initialParams={initialParams}
          generalInterface={data.generalInterface}
          paramaterCollections={collections}
          parameterBrands={brands}
          parameterMaterials={materials}
        />
      </ProductFilters>
      <section className="shell mt-5 lg:mt-6">
        {data.allProducts.length > 0 ? (
          // Cards space their rows with --card-row-gap; the negative margin
          // takes the last row's back
          <div className="-mb-(--card-row-gap) grid grid-cols-2 gap-x-3 [--card-row-gap:0.75rem] sm:gap-x-4 sm:[--card-row-gap:1rem] md:grid-cols-3 xl:grid-cols-4">
            {data.allProducts.map((product, index) => {
              return (
                <ProductCard
                  key={product.id}
                  href={`/${lng}/product/${product.slug}`}
                  name={product.name}
                  brand={product.brand?.name}
                  image={product.productImages[0]?.responsiveImage}
                  hoverImage={product.productImages[1]?.responsiveImage}
                  price={product.price}
                  salePrice={product.salePrice}
                  onSale={stripStega(product.sale) === 'on_sale'}
                  currencySymbol={currencySymbol ?? ''}
                  saleLabel={sale}
                  sizes="(min-width: 1440px) 320px, (min-width: 1280px) 23vw, (min-width: 768px) 31vw, 46vw"
                  priority={!singleFilter && index < 4}
                  titleAs="h2"
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-card bg-white px-6 py-16 text-center sm:py-24">
            <span
              aria-hidden="true"
              className="grid size-18 place-items-center rounded-full bg-oat [&>svg]:size-7"
            >
              <MagnifyingGlassIcon />
            </span>
            <h2 className="title-md mt-7 max-w-[16em]">{emptyState.title}</h2>
            <p className="mt-4 max-w-[40ch] text-md text-pretty text-muted tabular-nums sm:text-lg">
              {emptyState.body}
            </p>
            <Link href={emptyState.href} className="btn-primary mt-8">
              {count > 0 && <ArrowLeftIcon aria-hidden="true" />}
              {emptyState.cta}
              {count === 0 && <ArrowRightIcon aria-hidden="true" />}
            </Link>
          </div>
        )}
      </section>
      <Pagination
        numberOfProducts={count}
        currentPage={pageNumber}
        pageSize={PAGE_SIZE}
      />
    </>
  );
};

export default Page;
