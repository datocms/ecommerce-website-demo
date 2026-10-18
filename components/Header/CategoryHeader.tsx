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
  Bars2Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type FormEvent, Suspense, useRef, useState } from 'react';
import { RSCImage } from 'react-datocms/rsc-image';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import type { SiteLocale } from '@/app/i18n/settings';
import Drawer from '@/components/Common/Drawer';
import SvgRenderer from '@/components/Common/SvgRenderer';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { IMG_ZOOM, MEDIA } from '@/components/Sections/ui';
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
};

// Bar items: full bar height, with a 2px ink bar on the header's bottom edge when hovered,
// open or current. Their sides (--nav-x, set per cluster) grow with the viewport up to 14px
// at xl, so the spacing never jumps.
const NAV_ITEM =
  'relative inline-flex h-18 items-center gap-1 px-(--nav-x) text-xs font-medium whitespace-nowrap after:absolute after:inset-x-(--nav-x) after:-bottom-px after:h-0.5 after:bg-ink after:opacity-0 after:transition-opacity after:duration-150 hover:after:opacity-100 focus-visible:outline-offset-[-2px] aria-[current=page]:after:opacity-100 data-open:after:opacity-100 xl:text-sm';

// Header icon buttons: 40px, so the glyphs sit on the content edges with -mx-2.5
const BAR_ICON = 'icon-btn size-10 [&>svg]:size-5.5';

// Rows of the mobile menu
const MENU_ROW =
  'title-item flex h-16 w-full items-center justify-between gap-4 text-left text-[1.375rem] tracking-[-0.03em] focus-visible:outline-offset-[-2px]';

type FeatureTileProps = {
  item: FeaturedItem;
  href: string;
  tag: string | null | undefined;
  shopNow: string | null | undefined;
  sizes: string;
  onNavigate: () => void;
  /** The other tile's name, so both captions lay out the same */
  partnerName?: string;
  /** The mega menu shows "Shop now" beside the name; the mobile menu only the name */
  compact?: boolean;
};

// Trending / New: a 4:3 photo (or a brand logo on mist) with its tag, the name under it.
// In the mega menu the pair shares two subgrid rows: when the link columns run longer, both
// photos grow together to end with them, and a caption that wraps keeps both photos equal.
const FeatureTile = ({
  item,
  href,
  tag,
  shopNow,
  sizes,
  onNavigate,
  partnerName,
  compact = false,
}: FeatureTileProps) => {
  const image = item.details.image.responsiveImage;
  const brand = item._modelApiKey === 'brand';

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group min-w-0 outline-offset-4 ${compact ? 'flex flex-col' : 'row-span-2 grid grid-rows-subgrid'}`}
    >
      <span
        // Stretched in the mega menu: w-full, or the ratio would size the width from the height
        className={`${MEDIA} block aspect-[4/3] ${compact ? '' : 'w-full self-stretch'}`}
      >
        {image &&
          (brand ? (
            // The logo stays under the tag (12px in, 28px tall) with the 8px gap it has at 1440:
            // on smaller tiles 19% is less than that band
            <span className="absolute inset-x-[19%] top-[max(19%,3rem)] bottom-[max(19%,0.75rem)]">
              <DatoImage
                fragment={image}
                layout="fill"
                objectFit="contain"
                sizes={sizes}
                usePlaceholder={false}
                // Logos come on white: multiply drops the box onto the mist well
                imgClassName="mix-blend-multiply"
              />
            </span>
          ) : (
            <DatoImage
              fragment={image}
              layout="fill"
              objectFit="cover"
              // Portraits keep their faces in the landscape crop
              objectPosition="50% 20%"
              sizes={sizes}
              className={IMG_ZOOM}
            />
          ))}
        {tag && <span className="tag absolute top-3 left-3">{tag}</span>}
      </span>
      {compact ? (
        <span className="mt-2.5 text-sm font-semibold">{item.name}</span>
      ) : (
        // CMS names are never truncated: when a name and a long shopNow label don't share
        // the row, the label moves under the name
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          {/* The partner's name shares this cell, invisible, so the pair's longer name sizes
              both: the two labels stay beside their names, or both move under them */}
          <span className="grid min-w-0 text-base font-semibold text-pretty">
            <span className="col-start-1 row-start-1">{item.name}</span>
            {partnerName && (
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1"
              >
                {partnerName}
              </span>
            )}
          </span>
          {shopNow && (
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium">
              {shopNow}
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 stroke-2 transition-transform duration-200 group-hover:translate-x-0.75"
              />
            </span>
          )}
        </span>
      )}
    </Link>
  );
};

export default function CategoryHeader({
  globalPageProps,
  languages,
  data,
}: PropTypes) {
  const lng = globalPageProps.params.lng;
  const pathname = usePathname();
  const router = useRouter();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [searchCover, setSearchCover] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const [cartIsOpen, setCartIsOpen] = useState(false);

  const menu = data.layout?.menu ?? [];
  const links = menu.filter(
    (item) => item._modelApiKey === 'link_item',
  ) as LinkItem[];
  const categories = menu.filter(
    (item) => item._modelApiKey === 'dropdown_menu',
  ) as DropdownMenu[];
  // The bar splits around the centred lockup: the dropdowns and the first link on the left,
  // the other links on the right
  const leftItems = menu.filter(
    (item) => item._modelApiKey === 'dropdown_menu' || item === links[0],
  );
  const rightLinks = links.slice(1);

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
  const lockup = (wordmarkClassName = '') => (
    <>
      {logoData && (
        <RSCImage
          data={wordmark ? { ...logoData, alt: '' } : logoData}
          usePlaceholder={false}
          sizes="30px"
          imgClassName="logo-ink"
          imgStyle={{ height: '1.875rem', width: 'auto' }}
        />
      )}
      {wordmark && (
        <span
          className={`title-item tracking-[-0.03em] whitespace-nowrap ${wordmarkClassName}`}
        >
          {wordmark}
        </span>
      )}
    </>
  );

  // Trending first, then New. Keyed by slot: one record can fill both.
  const featured = (
    category: DropdownMenu,
    sizes: string,
    close: () => void,
    compact?: boolean,
  ) => {
    const slots = [
      {
        slot: 'trending',
        item: category.trending,
        tag: generalInterface?.trending,
      },
      { slot: 'new', item: category.newArrival, tag: generalInterface?.new },
    ];
    return slots.map(({ slot, item, tag }, index) => (
      <FeatureTile
        key={slot}
        item={item}
        href={productsHref(item)}
        tag={tag}
        shopNow={generalInterface?.shopNow}
        sizes={sizes}
        onNavigate={close}
        // Stripped: the invisible copy must not become a second visual-editing target
        partnerName={stripStega(slots[1 - index].item.name)}
        compact={compact}
      />
    ));
  };

  const handleMenuSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('productName');
    router.push(
      `/${lng}/products?productName=${encodeURIComponent(String(value ?? ''))}`,
    );
    closeMenu();
  };

  // The search sheet covers the strip and the header whatever their height (the strip wraps
  // to 2-3 lines on phones), so no slice of the bar shows under it
  const openSearch = () => {
    setSearchCover(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    setSearchIsOpen(true);
  };

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
          minHeight={searchCover}
        />
      </Suspense>

      <Drawer
        open={menuIsOpen}
        onClose={closeMenu}
        side="left"
        closeLabel="Close menu"
        title={lockup()}
      >
        <search>
          <form onSubmit={handleMenuSearch} className="relative">
            <label htmlFor="menu-search" className="sr-only">
              {searchPlaceholder}
            </label>
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-mute"
            />
            <input
              id="menu-search"
              name="productName"
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder={searchPlaceholder}
              className="input-field h-12 min-h-12 pl-11 [&::-webkit-search-cancel-button]:appearance-none"
            />
          </form>
        </search>

        <nav aria-label="Main" className="mt-2">
          {categories.map((category, index) => (
            <Disclosure
              key={category.id}
              as="div"
              defaultOpen={index === 0}
              className="border-b border-line"
            >
              <DisclosureButton className={`group ${MENU_ROW}`}>
                {category.label}
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 stroke-2 transition-transform duration-200 group-data-open:rotate-180"
                />
              </DisclosureButton>
              <DisclosurePanel className="space-y-5 pb-6">
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
                      className="mt-1.5 grid grid-cols-2 gap-x-4"
                    >
                      {column.item.map((item) => (
                        <li key={item.id} className="min-w-0">
                          <Link
                            href={productsHref(item)}
                            onClick={closeMenu}
                            className="block py-1.5 text-base text-ink-2 transition-colors duration-150 hover:text-ink"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-x-4 pt-1">
                  {featured(
                    category,
                    '(min-width: 640px) 12.5rem, 45vw',
                    closeMenu,
                    true,
                  )}
                </div>
              </DisclosurePanel>
            </Disclosure>
          ))}

          {links.length > 0 && (
            <ul>
              {links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={linkHref(link)}
                    onClick={closeMenu}
                    aria-current={isCurrent(link) ? 'page' : undefined}
                    // The current page underlines its label with the desktop bar's 2px ink
                    className={`group ${MENU_ROW} border-b border-line`}
                  >
                    <span className="decoration-2 underline-offset-[0.3em] group-aria-[current=page]:underline">
                      {link.label}
                    </span>
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="size-5 shrink-0 stroke-2"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Suspense>
            <LanguageSelector
              languages={languages}
              currencySymbol={generalInterface?.currencySymbol}
              placement="above-start"
              className="h-11 border border-line px-4 text-sm hover:border-ink aria-expanded:border-ink"
              onNavigate={closeMenu}
            />
          </Suspense>
          {socials.length > 0 && (
            <div className="-mr-3 flex">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    stripStega(social.name ?? '') || stripStega(social.url)
                  }
                  className="icon-btn"
                >
                  <SvgRenderer url={social.icon.url} />
                </a>
              ))}
            </div>
          )}
        </div>
      </Drawer>

      {/* Above the floating controls (z-40), so the mega menu's scrim dims them like the
          dialogs' scrims do. Sticky makes it the mega menu's containing block. */}
      <header
        ref={headerRef}
        className="peer sticky top-0 z-45 border-b border-line bg-white"
      >
        {/* Left items' sides: 6px at 1100 (the longest cluster, es, stays 40px+ clear of the
            lockup) to 14px at 1280. The right links have room to start at 10px. While a
            panel is open only its button carries the bar, not the current page's link. */}
        <nav
          aria-label="Main"
          className="shell grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-x-4 [--nav-x:clamp(0.375rem,calc((100vw_-_68.75rem)/22.5_+_0.375rem),0.875rem)] nav:h-18 [&:has([data-open])_[aria-current=page]:not(:hover)]:after:opacity-0"
        >
          <div className="-ml-2.5 flex min-w-0 items-center justify-self-start nav:-ml-(--nav-x)">
            <button
              type="button"
              aria-label="Menu"
              aria-haspopup="dialog"
              aria-expanded={menuIsOpen}
              onClick={() => setMenuIsOpen(true)}
              className={`${BAR_ICON} nav:hidden`}
            >
              <Bars2Icon aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={searchPlaceholder}
              aria-haspopup="dialog"
              onClick={openSearch}
              className={`${BAR_ICON} nav:hidden`}
            >
              <MagnifyingGlassIcon aria-hidden="true" />
            </button>

            <PopoverGroup as="ul" className="hidden items-center nav:flex">
              {leftItems.map((item) => {
                if (item.__typename === 'LinkItemRecord') {
                  return (
                    <li key={item.id}>
                      <Link
                        href={linkHref(item)}
                        aria-current={isCurrent(item) ? 'page' : undefined}
                        className={NAV_ITEM}
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
                        className={`group ${NAV_ITEM} not-data-focus:outline-0`}
                      >
                        {category.label}
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-3.75 stroke-2 transition-transform duration-200 group-data-open:rotate-180"
                        />
                      </PopoverButton>

                      {/* Under the header's hairline, full width */}
                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-[calc(100%+1px)] border-b border-line bg-white transition-opacity duration-150 ease-out data-closed:opacity-0"
                      >
                        {({ close }) => (
                          <div className="shell grid grid-cols-12 gap-4 pt-10 pb-12">
                            <div className="col-span-6 grid grid-cols-3 content-start gap-6 pr-6 xl:gap-8 xl:pr-8">
                              {category.column.map((column) => (
                                <div key={column.id} className="min-w-0">
                                  <p
                                    id={`${category.id}-${column.id}-heading`}
                                    className="eyebrow border-b border-line pb-3"
                                  >
                                    {column.label}
                                  </p>
                                  {/* Full-width 36px rows (-mx-2 px-2
                                      gives the focus ring room); the 20px leading keeps a
                                      wrapped name visibly one item */}
                                  <ul
                                    aria-labelledby={`${category.id}-${column.id}-heading`}
                                    className="mt-2.5 -mb-1.5"
                                  >
                                    {column.item.map((menuItem) => (
                                      <li key={menuItem.id}>
                                        <Link
                                          href={productsHref(menuItem)}
                                          onClick={() => close()}
                                          className="-mx-2 block px-2 py-2 text-base leading-5 text-ink-2 transition-colors duration-150 hover:text-ink"
                                        >
                                          {menuItem.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <div className="col-span-6 grid grid-cols-2 grid-rows-[1fr_auto] gap-x-4 gap-y-3">
                              {featured(
                                category,
                                '(min-width: 1440px) 20.5rem, 23vw',
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
          </div>

          <Link
            href={`/${lng}/home`}
            className="flex items-center gap-2.5 justify-self-center"
          >
            {/* Under 360px the mark alone clears the menu and search buttons */}
            {lockup('max-[22.5rem]:sr-only')}
            {!wordmark && <span className="sr-only">Home</span>}
          </Link>

          <div className="-mr-2.5 flex min-w-0 items-center justify-self-end">
            {rightLinks.length > 0 && (
              <ul className="hidden items-center [--nav-x:clamp(0.625rem,calc((100vw_-_68.75rem)/45_+_0.625rem),0.875rem)] nav:flex">
                {rightLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={linkHref(link)}
                      aria-current={isCurrent(link) ? 'page' : undefined}
                      className={NAV_ITEM}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <span
              aria-hidden="true"
              className="mx-2 hidden h-5 w-px bg-line nav:block xl:mx-3"
            />
            <div className="hidden nav:block">
              <Suspense>
                <LanguageSelector
                  languages={languages}
                  currencySymbol={generalInterface?.currencySymbol}
                  // Globe only until xl; screen readers always get the label
                  labelClassName="max-xl:sr-only"
                  className="h-10 px-2.5 text-sm hover:bg-mist aria-expanded:bg-mist max-xl:w-10 max-xl:justify-center max-xl:px-0 [&>svg]:size-5"
                />
              </Suspense>
            </div>
            <button
              type="button"
              aria-label={searchPlaceholder}
              aria-haspopup="dialog"
              onClick={openSearch}
              className={`${BAR_ICON} hidden nav:inline-flex`}
            >
              <MagnifyingGlassIcon aria-hidden="true" />
            </button>
            {/* The glyph ends about on the content edge, mirroring the menu button. The
                counter overlaps the body's top-right corner, clear of the handle, and
                overhangs 12px into the gutter (mr-0.75 keeps it 8px off a phone's edge). */}
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setCartIsOpen(true)}
              className={`${BAR_ICON} relative mr-0.75`}
            >
              <ShoppingBagIcon aria-hidden="true" />
              <span className="tag-dark absolute top-0 -right-1.25 min-h-4.5 min-w-4.5 justify-center px-1 leading-4.5 tracking-normal">
                0
              </span>
              <span className="sr-only"> items in bag</span>
            </button>
          </div>
        </nav>
      </header>

      {/* The mega menu's scrim: outside the sticky header, so it can cover the page; a click
          on it is a click outside the menu, which closes it */}
      <div
        aria-hidden="true"
        className="invisible fixed inset-0 z-44 bg-ink/30 opacity-0 transition-[opacity,visibility] duration-200 ease-out peer-has-[[data-open]]:visible peer-has-[[data-open]]:opacity-100"
      />
    </>
  );
}
