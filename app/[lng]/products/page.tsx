// The catalog depends on search params, so it renders on every request and runs its
// queries here instead of through generateWrapper; there is no RealTime view. It wraps
// itself in PageTransition, as generateWrapper does for the other routes.

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
import { ViewTransition } from 'react';
import LinkPending from '@/components/Motion/LinkPending';
import PageTransition from '@/components/Motion/PageTransition';
import ProductCard from '@/components/ProductCard';
import FilterDetail from '@/components/ProductListing/FilterDetail';
import FilterPanel from '@/components/ProductListing/FilterPanel';
import {
  FilterOptionsFragment,
  ProductListingLabelsFragment,
} from '@/components/ProductListing/fragments';
import ListingToolbar from '@/components/ProductListing/ListingToolbar';
import Pagination from '@/components/ProductListing/Pagination';
import SortTabs from '@/components/ProductListing/SortTabs';
import { readFragment } from '@/lib/datocms/graphql';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import { getFallbackLocale, type SiteLocale } from '@/lib/i18n';
import {
  filterOptionsQuery,
  PAGE_SIZE,
  type PageProps,
  type ProductModelOrderBy,
  productsQuery,
} from './meta';

export const dynamic = 'force-dynamic';

export default async function Page({ params, searchParams }: PageProps) {
  const { lng } = await params;
  const resolvedSearchParams = await searchParams;
  const { isEnabled } = await draftMode();
  const fallbackLng = await getFallbackLocale();
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
      fallbackLocale: [fallbackLng],
    },
    isEnabled,
  );

  const { allBrands, allCollections, allMaterials } =
    readFragment(FilterOptionsFragment, filterOptions) ?? {};

  // A missing param means every option; an empty one means none
  const selectedIds = (param: string | undefined, options: { id: string }[]) =>
    param === undefined
      ? options.map((option) => option.id)
      : param.split('|').filter(Boolean);

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
      fallbackLocale: [fallbackLng],
      first: PAGE_SIZE,
      skip: (pageNumber - 1) * PAGE_SIZE,
      orderBy: [orderBy],
      collections,
      brands,
      materials,
      nameSearch,
    },
    isEnabled,
  );

  // A header for a lone material, collection or brand, checked in that order. The
  // first group with exactly one selected id decides, even if no record has that id
  // (then there is no header)
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

  // Mirrors FilterPanel: a group narrows the listing unless every option is on
  const isNarrowed = (selected: string[], options: { id: string }[]) =>
    options.some((option) => !selected.includes(option.id));
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
    <PageTransition>
      {headerFilter ? (
        // Keyed by the record, so moving from one brand, collection or material to another
        // remounts it and its arrival (settle, enter-stagger) plays again
        <FilterDetail
          key={headerFilter.id}
          lng={lng}
          eyebrow={filterLabel}
          name={headerFilter.name}
          subtitle={headerFilter.details.subtitle ?? ''}
          description={
            headerFilter.details.description as StructuredText<Record, Record>
          }
          image={headerFilter.details.image.responsiveImage}
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
            // 36px on the toolbar's 56px row; the pseudo-element makes the hit area 44px.
            // On phones and beside the tabs at lg the magnifier gives its room to the query
            <Link
              href={hrefWithout('productName', 'page')}
              aria-label={`Clear search “${nameSearch}”`}
              className="relative inline-flex h-9 min-w-0 items-center gap-2 bg-mist pr-1 pl-3 text-sm font-medium press after:absolute after:inset-x-0 after:-inset-y-1 hover:bg-line"
            >
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="size-4 shrink-0 stroke-2 text-mute max-sm:hidden lg:max-xl:hidden"
              />
              <span className="min-w-0 truncate">“{nameSearch}”</span>
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center [&>svg]:size-4 [&>svg]:stroke-2"
              >
                <XMarkIcon />
              </span>
              <LinkPending />
            </Link>
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
      {/* On a query change the results swap in place (swap in global.css). Keyed by the
          query, so the old and new lists are separate groups that never travel, even when
          ListingToolbar rewinds the scroll. Changes made in the drawer carry the "filter"
          type and skip the swap: the grid updates behind the scrim */}
      <ViewTransition
        key={JSON.stringify(resolvedSearchParams)}
        enter={{ filter: 'none', default: 'swap' }}
        exit={{ filter: 'none', default: 'swap' }}
        default="none"
      >
        {/* Focus scrolls links clear of the header and, from lg, of the stuck toolbar too.
            pending-dim sits here, not on a wrapper: a snapshot carries its element's own
            opacity but not an ancestor's */}
        <section className="pending-dim shell pt-8 lg:pt-10 lg:[&_a]:scroll-mt-[calc(3.5rem+1px)]">
          {data.allProducts.length > 0 ? (
            // Cards space their rows with --card-row-gap; the negative margin
            // takes the last row's back
            <div className="-mb-(--card-row-gap) grid grid-cols-2 gap-x-3 [--card-row-gap:2.5rem] md:grid-cols-3 md:gap-x-4 lg:[--card-row-gap:3.5rem] xl:grid-cols-4">
              {data.allProducts.map((product, index) => {
                return (
                  <ProductCard
                    key={product.id}
                    href={`/${lng}/product/${product.slug}`}
                    name={product.name}
                    brand={product.brand.name}
                    image={product.productImages[0]?.responsiveImage}
                    hoverImage={product.productImages[1]?.responsiveImage}
                    price={product.price}
                    salePrice={product.salePrice}
                    onSale={stripStega(product.sale) === 'on_sale'}
                    currencySymbol={labels?.currencySymbol ?? ''}
                    saleLabel={labels?.sale}
                    sizes="(min-width: 1440px) 330px, (min-width: 1280px) 23vw, (min-width: 768px) 31vw, 46vw"
                    priority={!headerFilter && index < 4}
                    titleAs="h2"
                    data-datocms-content-link-group
                  />
                );
              })}
            </div>
          ) : (
            // A mist well where the grid would be
            <div className="flex flex-col items-center bg-mist px-6 py-20 text-center lg:py-28">
              <span
                aria-hidden="true"
                className="grid size-16 place-items-center bg-white [&>svg]:size-6.5"
              >
                <MagnifyingGlassIcon />
              </span>
              <h2 className="title-card mt-8 max-w-[14em] text-balance">
                {emptyState.title}
              </h2>
              <p className="mt-4 max-w-[40ch] text-md text-pretty text-ink-2 tabular-nums">
                {emptyState.body}
              </p>
              <Link href={emptyState.href} className="btn mt-8">
                {count > 0 && <ArrowLeftIcon aria-hidden="true" />}
                {emptyState.cta}
                {count === 0 && <ArrowRightIcon aria-hidden="true" />}
                <LinkPending />
              </Link>
            </div>
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
