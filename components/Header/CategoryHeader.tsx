'use client';

import { stripStega } from '@datocms/content-link';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  ArrowRightIcon,
  Bars3BottomLeftIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, Suspense, useState } from 'react';
import { RSCImage } from 'react-datocms/rsc-image';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import type { SiteLocale } from '@/app/i18n/settings';
import Drawer from '@/components/Common/Drawer';
import SvgRenderer from '@/components/Common/SvgRenderer';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import Cart from './Cart';
import HoveringSearch from './HoveringSearch';
import LanguageSelector from './LanguageSelector';

type MenuItem = NonNullable<LayoutQuery['layout']>['menu'][number];
type LinkItem = Extract<MenuItem, { __typename: 'LinkItemRecord' }>;
type DropdownMenu = Extract<MenuItem, { __typename: 'DropdownMenuRecord' }>;
type FeaturedItem = DropdownMenu['newArrival'] | DropdownMenu['trending'];

type PropTypes = {
  languages: SiteLocale[];
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
  /** Show the language switch in the bar below xl (the strip carries it while it is shown) */
  showLocale?: boolean;
};

// Pills in the bar: cream when hovered, open or current
const NAV_LINK =
  'inline-flex h-11 items-center gap-1 rounded-full px-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-150 hover:bg-cream aria-[current=page]:bg-cream data-open:bg-cream xl:px-3 2xl:px-4';

// Display rows of the mobile menu
const MENU_ROW =
  'title-sm flex h-17 w-full items-center justify-between gap-4 px-5 text-left text-[1.5rem] focus-visible:outline-offset-[-2px]';

type FeatureTileProps = {
  item: FeaturedItem;
  href: string;
  tag: string | null | undefined;
  tagClassName: string;
  shopNow: string | null | undefined;
  sizes: string;
  className: string;
  onNavigate: () => void;
};

// Trending / New tile: a photo with its labels on it, or a brand logo on a cream mat
const FeatureTile = ({
  item,
  href,
  tag,
  tagClassName,
  shopNow,
  sizes,
  className,
  onNavigate,
}: FeatureTileProps) => {
  const image = item.details.image.responsiveImage;

  if (item._modelApiKey === 'brand') {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={`group flex min-w-0 flex-col rounded-image bg-cream p-2 ${className}`}
      >
        <span className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-white">
          {image && (
            <span className="absolute inset-[18%] transition-transform duration-500 ease-out group-hover:scale-[1.04]">
              <DatoImage
                fragment={image}
                layout="fill"
                objectFit="contain"
                placeholderStyle={{
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                }}
                sizes={sizes}
              />
            </span>
          )}
          {tag && (
            <span className={`badge absolute top-2.5 left-2.5 ${tagClassName}`}>
              {tag}
            </span>
          )}
        </span>
        <span className="flex items-center justify-between gap-2 px-2 pt-3 pb-1.5">
          <span className="title-sm min-w-0 text-[1.25rem] wrap-break-word">
            {item.name}
          </span>
          <span
            aria-hidden="true"
            className="hidden size-8 shrink-0 place-items-center rounded-full bg-ink text-cream xl:grid"
          >
            <ArrowRightIcon className="size-3.75 stroke-[2.4]" />
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group relative block min-w-0 overflow-hidden rounded-image bg-oat ${className}`}
    >
      {image && (
        <DatoImage
          fragment={image}
          layout="fill"
          objectFit="cover"
          // Portraits keep their faces in the tile
          objectPosition="50% 25%"
          sizes={sizes}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/60 to-transparent"
      />
      {tag && (
        <span className={`badge absolute top-3 left-3 ${tagClassName}`}>
          {tag}
        </span>
      )}
      <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 text-white">
        <span className="min-w-0">
          <span className="title-sm block text-[1.25rem] xl:text-[1.5rem]">
            {item.name}
          </span>
          {shopNow && (
            <span className="mt-2 block text-xs font-semibold text-white/90">
              {shopNow}
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="hidden size-9 shrink-0 place-items-center rounded-full bg-white text-ink xl:grid"
        >
          <ArrowRightIcon className="size-4 stroke-[2.4]" />
        </span>
      </span>
    </Link>
  );
};

type SearchFieldProps = {
  lng: string;
  placeholder: string;
  defaultValue?: string;
};

// The bar's own search field (from xl); below xl a button opens the search sheet
const SearchField = ({ lng, placeholder, defaultValue }: SearchFieldProps) => {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('productName');
    router.push(
      `/${lng}/products?productName=${encodeURIComponent(String(value ?? ''))}`,
    );
  };

  return (
    <search className="hidden w-58 min-w-0 xl:block 2xl:w-68">
      <form
        onSubmit={handleSubmit}
        className="flex h-11 w-full items-center gap-2.5 rounded-full bg-cream px-4 text-muted transition-shadow duration-150 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ink"
      >
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="size-4.5 shrink-0 stroke-[2.2]"
        />
        <label htmlFor="header-search" className="sr-only">
          {placeholder}
        </label>
        <input
          id="header-search"
          name="productName"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none"
        />
      </form>
    </search>
  );
};

// Prefills the field with the current query. Its own Suspense boundary keeps
// useSearchParams from opting the header out of server rendering.
const SearchFieldWithQuery = (props: SearchFieldProps) => {
  const query = useSearchParams().get('productName') ?? '';
  return <SearchField key={query} {...props} defaultValue={query} />;
};

export default function CategoryHeader({
  globalPageProps,
  languages,
  data,
  showLocale = false,
}: PropTypes) {
  const lng = globalPageProps.params.lng;
  const pathname = usePathname();
  const router = useRouter();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [cartIsOpen, setCartIsOpen] = useState(false);

  const menu = data.layout?.menu ?? [];
  const links = menu.filter(
    (item) => item._modelApiKey === 'link_item',
  ) as LinkItem[];
  const categories = menu.filter(
    (item) => item._modelApiKey === 'dropdown_menu',
  ) as DropdownMenu[];

  const generalInterface = data.generalInterface;
  const searchPlaceholder = generalInterface?.searchPlaceholder || 'Search';
  const socials = data.layout?.socialMediaLinks ?? [];
  const closeMenu = () => setMenuIsOpen(false);

  const productsHref = (item: { _modelApiKey: string; id: string }) =>
    `/${lng}/products?${item._modelApiKey}s=${item.id}`;
  const linkHref = (link: LinkItem) => `/${lng}/${stripStega(link.slug)}`;
  const isCurrent = (link: LinkItem) => pathname === linkHref(link);

  const logo = data.layout?.logo.responsiveImage;
  const logoData = logo && readFragment(ResponsiveImageFragment, logo);
  const wordmark = data.layout?.footerTitle;
  const lockup = (
    <>
      {logoData && (
        <RSCImage
          data={wordmark ? { ...logoData, alt: '' } : logoData}
          usePlaceholder={false}
          sizes="36px"
          imgClassName="rounded-xs mix-blend-multiply"
          imgStyle={{ height: '2.25rem', width: 'auto' }}
        />
      )}
      {wordmark && (
        // Steps down on narrow phones so it clears the search and bag buttons
        <span className="min-w-0 truncate py-1 font-display text-[clamp(1.125rem,5.4vw,1.3125rem)] leading-none font-bold tracking-[-0.02em] xl:text-[1.375rem]">
          {wordmark}
        </span>
      )}
    </>
  );

  // Trending first (butter tag), then New
  const featured = (
    category: DropdownMenu,
    className: string,
    sizes: string,
    close: () => void,
  ) => {
    const brand = category.newArrival._modelApiKey === 'brand';
    return (
      <>
        <FeatureTile
          item={category.trending}
          href={productsHref(category.trending)}
          tag={generalInterface?.trending}
          tagClassName="bg-butter"
          shopNow={generalInterface?.shopNow}
          sizes={sizes}
          className={className}
          onNavigate={close}
        />
        <FeatureTile
          item={category.newArrival}
          href={productsHref(category.newArrival)}
          tag={generalInterface?.new}
          tagClassName={brand ? 'bg-cream' : ''}
          shopNow={generalInterface?.shopNow}
          sizes={sizes}
          className={className}
          onNavigate={close}
        />
      </>
    );
  };

  const handleMenuSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('productName');
    router.push(
      `/${lng}/products?productName=${encodeURIComponent(String(value ?? ''))}`,
    );
    closeMenu();
  };

  const searchFieldProps = { lng, placeholder: searchPlaceholder };

  return (
    <>
      <Cart
        open={cartIsOpen}
        onClose={() => setCartIsOpen(false)}
        currencySymbol={generalInterface?.currencySymbol}
      />

      {/* Own boundary: its useSearchParams must not opt the whole header out of SSR */}
      <Suspense>
        <HoveringSearch
          lng={lng}
          open={searchIsOpen}
          onClose={() => setSearchIsOpen(false)}
          placeholder={searchPlaceholder}
        />
      </Suspense>

      {/* Mobile menu: a cream sheet of white cards */}
      <Drawer
        open={menuIsOpen}
        onClose={closeMenu}
        side="left"
        tone="cream"
        closeLabel="Close menu"
        title={lockup}
      >
        {/* Cards run 8px from the sheet's edges: on the viewport's 16px gutter, like the bar */}
        <div className="-mx-4 flex flex-col">
          <search>
            <form onSubmit={handleMenuSearch} className="relative">
              <label htmlFor="menu-search" className="sr-only">
                {searchPlaceholder}
              </label>
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 stroke-[2.2] text-muted"
              />
              <input
                id="menu-search"
                name="productName"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder={searchPlaceholder}
                className="input-field pl-12 [&::-webkit-search-cancel-button]:appearance-none"
              />
            </form>
          </search>

          {categories.length > 0 && (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-card bg-white">
              {categories.map((category, index) => (
                <li key={category.id}>
                  <Disclosure defaultOpen={index === 0}>
                    <DisclosureButton className={`group ${MENU_ROW}`}>
                      {category.label}
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream transition-transform duration-200 group-data-open:rotate-180">
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-4.5 stroke-[2.4]"
                        />
                      </span>
                    </DisclosureButton>
                    <DisclosurePanel className="grid gap-6 px-5 pb-6">
                      {category.column.map((column) => (
                        <div key={column.id}>
                          <p
                            id={`${category.id}-${column.id}-heading-mobile`}
                            className="eyebrow"
                          >
                            {column.label}
                          </p>
                          <ul
                            aria-labelledby={`${category.id}-${column.id}-heading-mobile`}
                            className="mt-3 flex flex-wrap gap-2"
                          >
                            {column.item.map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={productsHref(item)}
                                  onClick={closeMenu}
                                  className="chip bg-cream shadow-none"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-2">
                        {featured(
                          category,
                          'h-52.5',
                          '(min-width: 640px) 13rem, 45vw',
                          closeMenu,
                        )}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </li>
              ))}
            </ul>
          )}

          {links.length > 0 && (
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card bg-white">
              {links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={linkHref(link)}
                    onClick={closeMenu}
                    aria-current={isCurrent(link) ? 'page' : undefined}
                    className={`group ${MENU_ROW}`}
                  >
                    {link.label}
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream group-aria-[current=page]:bg-butter">
                      <ArrowRightIcon
                        aria-hidden="true"
                        className="size-4.25 stroke-[2.4]"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Suspense>
              <LanguageSelector
                languages={languages}
                currencySymbol={generalInterface?.currencySymbol}
                placement="above-start"
                className="h-11 rounded-full bg-white px-4 text-sm font-bold hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]"
                onNavigate={closeMenu}
              />
            </Suspense>
            {socials.length > 0 && (
              <div className="flex gap-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={
                      stripStega(social.name ?? '') || stripStega(social.url)
                    }
                    className="icon-btn bg-white"
                  >
                    <SvgRenderer url={social.icon.url} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* Above the floating controls (z-40), so the mega menu's scrim dims them like the
          dialogs' scrims do. While a menu is open the backing drops its colour and blur, so
          the scrim below dims the strip behind the bar too. */}
      <header className="peer sticky top-0 z-45 bg-cream/85 backdrop-blur-md has-[[data-open],[data-leave]]:bg-transparent has-[[data-open],[data-leave]]:backdrop-blur-none">
        <div className="shell py-3">
          {/* Positions the mega menu under the whole bar */}
          <div className="relative">
            <nav
              aria-label="Main"
              className="grid h-16 grid-cols-[1fr_auto] items-center rounded-nav bg-white pr-2 pl-2 shadow-card nav:h-18 nav:grid-cols-[auto_1fr_auto] nav:pl-5 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-x-3"
            >
              <div className="flex min-w-0 items-center gap-1 justify-self-start">
                <button
                  type="button"
                  aria-label="Menu"
                  aria-haspopup="dialog"
                  aria-expanded={menuIsOpen}
                  onClick={() => setMenuIsOpen(true)}
                  className="icon-btn nav:hidden [&>svg]:size-5.5"
                >
                  <Bars3BottomLeftIcon aria-hidden="true" />
                </button>

                <Link
                  href={`/${lng}/home`}
                  className="flex min-w-0 items-center gap-2.5 rounded-xs"
                >
                  {lockup}
                  {!wordmark && <span className="sr-only">Home</span>}
                </Link>
              </div>

              <PopoverGroup
                as="ul"
                className="hidden items-center justify-self-center nav:flex"
              >
                {menu.map((item) => {
                  if (item.__typename === 'LinkItemRecord') {
                    return (
                      <li key={item.id}>
                        <Link
                          href={linkHref(item)}
                          aria-current={isCurrent(item) ? 'page' : undefined}
                          className={NAV_LINK}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  const category = item;
                  return (
                    <li key={category.id}>
                      <Popover>
                        {/* Headless focuses the button on click: keep the ring for keyboard focus only */}
                        <PopoverButton
                          className={`group ${NAV_LINK} not-data-focus:outline-0`}
                        >
                          {category.label}
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="size-4 stroke-[2.4] opacity-60 transition duration-200 group-data-open:rotate-180 group-data-open:opacity-100"
                          />
                        </PopoverButton>

                        <PopoverPanel
                          transition
                          className="absolute inset-x-0 top-full pt-2 transition duration-200 ease-out data-closed:-translate-y-1 data-closed:opacity-0"
                        >
                          {({ close }) => (
                            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 rounded-card bg-white p-3 shadow-pop">
                              {/* Lists of up to 210px each; the tiles take the rest */}
                              <div className="grid auto-cols-[minmax(9.375rem,13.125rem)] grid-flow-col content-start gap-2">
                                {category.column.map((column) => (
                                  <div
                                    key={column.id}
                                    className="min-w-0 px-2 py-5"
                                  >
                                    <p
                                      id={`${category.id}-${column.id}-heading`}
                                      className="eyebrow px-3"
                                    >
                                      {column.label}
                                    </p>
                                    <ul
                                      aria-labelledby={`${category.id}-${column.id}-heading`}
                                      className="mt-3 grid gap-0.5"
                                    >
                                      {column.item.map((menuItem) => (
                                        <li key={menuItem.id}>
                                          <Link
                                            href={productsHref(menuItem)}
                                            onClick={() => close()}
                                            className="group/link relative block rounded-md py-2 pr-6 pl-3 text-md font-medium transition-colors duration-150 hover:bg-cream focus-visible:bg-cream"
                                          >
                                            {menuItem.name}
                                            <ArrowRightIcon
                                              aria-hidden="true"
                                              className="absolute top-1/2 right-2 size-4 -translate-x-1 -translate-y-1/2 stroke-[2.2] opacity-0 transition duration-150 group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100"
                                            />
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                              <div className="grid h-75 grid-cols-2 gap-3 xl:h-85">
                                {featured(
                                  category,
                                  'h-full',
                                  '(min-width: 1440px) 21rem, 24vw',
                                  () => close(),
                                )}
                              </div>
                            </div>
                          )}
                        </PopoverPanel>
                      </Popover>
                    </li>
                  );
                })}
              </PopoverGroup>

              {/* From xl the cluster fills its column, so the field gives way to long nav labels */}
              <div className="flex min-w-0 items-center justify-end gap-2 justify-self-end xl:w-full">
                {/* The field takes this room from xl; the footer carries the switch there */}
                {showLocale && (
                  <div className="hidden text-sm nav:block xl:hidden">
                    <Suspense>
                      <LanguageSelector
                        languages={languages}
                        currencySymbol={generalInterface?.currencySymbol}
                        className="h-11 rounded-full px-3 hover:bg-cream aria-expanded:bg-cream"
                      />
                    </Suspense>
                  </div>
                )}

                <Suspense fallback={<SearchField {...searchFieldProps} />}>
                  <SearchFieldWithQuery {...searchFieldProps} />
                </Suspense>

                <button
                  type="button"
                  aria-label={searchPlaceholder}
                  aria-haspopup="dialog"
                  onClick={() => setSearchIsOpen(true)}
                  className="icon-btn bg-cream xl:hidden [&>svg]:size-4.75 [&>svg]:stroke-[2.2]"
                >
                  <MagnifyingGlassIcon aria-hidden="true" />
                </button>

                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setCartIsOpen(true)}
                  className="icon-btn relative bg-ink text-cream [&>svg]:size-4.75"
                >
                  <ShoppingBagIcon aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-butter px-1 text-xs font-bold text-ink tabular-nums ring-2 ring-white">
                    0
                  </span>
                  <span className="sr-only"> items in bag</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* The mega menu's scrim. It lives outside the sticky header, where its blur can reach
          the page; a click on it is a click outside the menu, which closes it. */}
      <div
        aria-hidden="true"
        className="invisible fixed inset-0 z-44 bg-ink/30 opacity-0 backdrop-blur-xs transition-[opacity,visibility] duration-300 ease-out peer-has-[[data-open]]:visible peer-has-[[data-open]]:opacity-100"
      />
    </>
  );
}
