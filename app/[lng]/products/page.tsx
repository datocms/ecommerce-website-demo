import { draftMode } from 'next/headers';
import { ViewTransition } from 'react';
import PageTransition from '@/components/Motion/PageTransition';
import ProductCard from '@/components/ProductCard';
import EmptyResults from '@/components/ProductListing/EmptyResults';
import FilterDetail from '@/components/ProductListing/FilterDetail';
import FilterPanel from '@/components/ProductListing/FilterPanel';
import {
  FilterOptionsFragment,
  ProductListingLabelsFragment,
} from '@/components/ProductListing/fragments';
import ListingToolbar from '@/components/ProductListing/ListingToolbar';
import Pagination from '@/components/ProductListing/Pagination';
import SearchChip from '@/components/ProductListing/SearchChip';
import SortTabs from '@/components/ProductListing/SortTabs';
import { readFragment } from '@/lib/datocms/graphql';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import { getFallbackLocale, type SiteLocale } from '@/lib/i18n';
import { productPath } from '@/lib/productPath';
import {
  filterOptionsQuery,
  PAGE_SIZE,
  type PageProps,
  type ProductModelOrderBy,
  productsQuery,
} from './meta';

// Reads search params, so it renders per request and runs its own queries: no generateWrapper
// and no RealTime view
export const dynamic = 'force-dynamic';

// A missing param means every option; an empty one means none
const selectedIds = (param: string | undefined, options: { id: string }[]) =>
  param === undefined
    ? options.map((option) => option.id)
    : param.split('|').filter(Boolean);

// As in FilterPanel: a group narrows the listing unless every option is on
const isNarrowed = (selected: string[], options: { id: string }[]) =>
  options.some((option) => !selected.includes(option.id));

export default async function Page({ params, searchParams }: PageProps) {
  const { lng } = await params;
  const resolvedSearchParams = await searchParams;
  const { isEnabled: isDraft } = await draftMode();
  const fallbackLocale = await getFallbackLocale();
  // Out-of-range values like ?page=0 would make `skip` negative and fail the query
  const pageNumber = Math.max(
    1,
    Number.parseInt(resolvedSearchParams.page ?? '1', 10) || 1,
  );
  const orderBy: ProductModelOrderBy =
    resolvedSearchParams.orderBy ?? '_createdAt_ASC';
  const nameSearch = resolvedSearchParams.productName ?? '';

  const filterOptions = await queryDatoCMS(
    filterOptionsQuery,
    {
      locale: lng as SiteLocale,
      fallbackLocale: [fallbackLocale],
    },
    isDraft,
  );

  const { allBrands, allCollections, allMaterials } = readFragment(
    FilterOptionsFragment,
    filterOptions,
  );

  const collections = selectedIds(
    resolvedSearchParams.collections,
    allCollections,
  );
  const brands = selectedIds(resolvedSearchParams.brands, allBrands);
  const materials = selectedIds(resolvedSearchParams.materials, allMaterials);

  const data = await queryDatoCMS(
    productsQuery,
    {
      locale: lng as SiteLocale,
      fallbackLocale: [fallbackLocale],
      first: PAGE_SIZE,
      skip: (pageNumber - 1) * PAGE_SIZE,
      orderBy: [orderBy],
      collections,
      brands,
      materials,
      nameSearch,
    },
    isDraft,
  );

  // A lone selected material, collection or brand (checked in that order) gets a FilterDetail
  // header
  const headerFilter =
    materials.length === 1
      ? allMaterials.find((material) => material.id === materials[0])
      : collections.length === 1
        ? allCollections.find((collection) => collection.id === collections[0])
        : brands.length === 1
          ? allBrands.find((brand) => brand.id === brands[0])
          : undefined;

  const labels = readFragment(
    ProductListingLabelsFragment,
    data.generalInterface,
  );
  const filterLabel = headerFilter ? labels?.[headerFilter.__typename] : null;

  const activeFilterCount = [
    isNarrowed(collections, allCollections),
    isNarrowed(materials, allMaterials),
    isNarrowed(brands, allBrands),
  ].filter(Boolean).length;

  const count = data._allProductsMeta.count;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  const hrefWithout = (...keys: string[]) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (!keys.includes(key) && value !== undefined) params.set(key, value);
    }
    const query = params.toString();
    return `/${lng}/products${query ? `?${query}` : ''}`;
  };

  return (
    <PageTransition>
      {headerFilter ? (
        // Keyed by record, so switching filters replays its entrance
        <FilterDetail
          key={headerFilter.id}
          lng={lng}
          eyebrow={filterLabel}
          record={headerFilter}
          logo={headerFilter.__typename === 'BrandRecord'}
        />
      ) : (
        <h1 className="sr-only">Products</h1>
      )}
      <ListingToolbar
        count={count}
        lng={lng}
        activeFilterCount={activeFilterCount}
        hasFilterDetail={Boolean(headerFilter)}
        sort={<SortTabs labels={data.generalInterface} />}
        searchChip={
          nameSearch ? (
            <SearchChip
              query={nameSearch}
              clearHref={hrefWithout('productName', 'page')}
            />
          ) : undefined
        }
      >
        <FilterPanel
          filterOptions={filterOptions}
          labels={data.generalInterface}
          selectedCollections={collections}
          selectedBrands={brands}
          selectedMaterials={materials}
        />
      </ListingToolbar>
      {/* Keyed by the query, so old and new results swap as separate groups; drawer ("filter")
          changes skip the swap */}
      <ViewTransition
        key={JSON.stringify(resolvedSearchParams)}
        enter={{ filter: 'none', default: 'swap' }}
        exit={{ filter: 'none', default: 'swap' }}
        default="none"
      >
        {/* pending-dim sits on the section itself: a view-transition snapshot ignores an ancestor's
            opacity. From lg, scroll-mt keeps focused links clear of the stuck toolbar */}
        <section className="pending-dim shell pt-8 lg:pt-10 lg:[&_a]:scroll-mt-[calc(3.5rem+1px)]">
          {data.allProducts.length > 0 ? (
            <div className="-mb-(--card-row-gap) grid grid-cols-2 gap-x-3 [--card-row-gap:2.5rem] md:grid-cols-3 md:gap-x-4 lg:[--card-row-gap:3.5rem] xl:grid-cols-4">
              {data.allProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  href={productPath(lng, product.slug)}
                  name={product.name}
                  brand={product.brand.name}
                  image={product.productImages[0]?.responsiveImage}
                  hoverImage={product.productImages[1]?.responsiveImage}
                  price={product.price}
                  salePrice={product.salePrice}
                  onSale={product.onSale}
                  currencySymbol={labels?.currencySymbol ?? ''}
                  saleLabel={labels?.sale}
                  sizes="(min-width: 1440px) 330px, (min-width: 1280px) 23vw, (min-width: 768px) 31vw, 46vw"
                  priority={!headerFilter && index < 4}
                  titleAs="h2"
                />
              ))}
            </div>
          ) : (
            <EmptyResults
              count={count}
              totalPages={totalPages}
              lng={lng}
              firstPageHref={hrefWithout('page')}
            />
          )}
        </section>
      </ViewTransition>
      <Pagination
        totalCount={count}
        currentPage={pageNumber}
        pageSize={PAGE_SIZE}
      />
    </PageTransition>
  );
}
