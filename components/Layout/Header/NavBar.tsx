'use client';

import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  Bars2Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { RSCImage } from 'react-datocms/rsc-image';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import LanguageSelector from '@/components/Layout/LanguageSelector';
import LinkPending from '@/components/Motion/LinkPending';
import { readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import Cart from './Cart';
import MegaMenuPanel from './MegaMenuPanel';
import MobileMenu from './MobileMenu';
import { type DropdownMenu, type LinkItem, linkHref } from './menu';
import SearchDialog from './SearchDialog';

type Props = {
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

// Bar items: full bar height, with a 2px ink bar on the header's bottom edge when hovered,
// open or current (it draws from the left, retracts the same way, and stays drawn while its
// page is on its way: the LinkPending inside the link sets data-pending, which
// has-data-pending: reads). Their sides (--nav-x, set per cluster) grow with the viewport up
// to 14px at xl, so the spacing never jumps.
const NAV_ITEM =
  'bar-draw relative inline-flex h-18 items-center gap-1 px-(--nav-x) text-xs font-medium whitespace-nowrap after:absolute after:inset-x-(--nav-x) after:-bottom-px after:h-0.5 after:bg-ink hover:after:scale-x-100 focus-visible:outline-offset-[-2px] has-data-pending:after:scale-x-100 aria-[current=page]:after:scale-x-100 data-open:after:scale-x-100 xl:text-sm';

// 40px icon buttons; the clusters' -ml-2.5/-mr-2.5 pull the outermost glyphs
// onto the content edges
const BAR_ICON = 'icon-btn size-10 [&>svg]:size-5.5';

export default function NavBar({ globalPageProps, data }: Props) {
  const lng = globalPageProps.params.lng;
  const pathname = usePathname();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [searchCover, setSearchCover] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const [cartIsOpen, setCartIsOpen] = useState(false);

  const menu = data.layout?.menu ?? [];
  const links = menu.filter(
    (item): item is LinkItem => item.__typename === 'LinkItemRecord',
  );
  const categories = menu.filter(
    (item): item is DropdownMenu => item.__typename === 'DropdownMenuRecord',
  );
  // The bar splits around the centred lockup: the dropdowns and the first link on the left,
  // the other links on the right
  const leftItems = menu.filter(
    (item) => item.__typename === 'DropdownMenuRecord' || item === links[0],
  );
  const rightLinks = links.slice(1);

  const generalInterface = data.generalInterface;
  const searchPlaceholder = generalInterface?.searchPlaceholder || 'Search';
  const socials = data.layout?.socialMediaLinks ?? [];
  const closeMenu = () => setMenuIsOpen(false);

  const isCurrent = (link: LinkItem) => pathname === linkHref(lng, link);

  const logo = data.layout?.logo.responsiveImage;
  const logoData = logo && readFragment(ResponsiveImageFragment, logo);
  // The Layout model has no site-name field: footerTitle doubles as the header wordmark
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

      {/* Its own boundary, for its useSearchParams. Closed it renders nothing, so the empty
          fallback takes no room. */}
      <Suspense>
        <SearchDialog
          lng={lng}
          open={searchIsOpen}
          onClose={() => setSearchIsOpen(false)}
          placeholder={searchPlaceholder}
          minHeight={searchCover}
        />
      </Suspense>

      <MobileMenu
        open={menuIsOpen}
        onClose={closeMenu}
        title={lockup()}
        lng={lng}
        categories={categories}
        links={links}
        isCurrent={isCurrent}
        generalInterface={generalInterface}
        searchPlaceholder={searchPlaceholder}
        socials={socials}
        locales={data._site.locales}
      />

      {/* Above the floating controls (z-40), so the mega menu's scrim dims them like the
          dialogs' scrims do. Sticky makes it the mega menu's containing block. */}
      <header
        ref={headerRef}
        data-chrome="header"
        className="peer sticky top-0 z-45 border-b border-line bg-white"
      >
        {/* --nav-x grows 6px→14px between 1100px and 1280px so the longest locale's items
            clear the logo. While a panel is open, only its button shows the bar. */}
        <nav
          aria-label="Main"
          className="shell grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-x-4 [--nav-x:clamp(0.375rem,calc((100vw_-_68.75rem)/22.5_+_0.375rem),0.875rem)] nav:h-18 [&:has([data-open])_[aria-current=page]:not(:hover)]:after:scale-x-0"
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
                        href={linkHref(lng, item)}
                        aria-current={isCurrent(item) ? 'page' : undefined}
                        className={NAV_ITEM}
                      >
                        {item.label}
                        <LinkPending />
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

                      {/* Under the header's hairline, full width, and unrolls from it */}
                      <PopoverPanel
                        transition
                        className="wipe absolute inset-x-0 top-[calc(100%+1px)] border-b border-line bg-white"
                      >
                        {({ close }) => (
                          <MegaMenuPanel
                            category={category}
                            generalInterface={generalInterface}
                            lng={lng}
                            // Wrapped: close() takes an element to refocus, so it must not be
                            // handed the click event
                            onNavigate={() => close()}
                          />
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
                      href={linkHref(lng, link)}
                      aria-current={isCurrent(link) ? 'page' : undefined}
                      className={NAV_ITEM}
                    >
                      {link.label}
                      <LinkPending />
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
              <LanguageSelector
                languages={data._site.locales}
                currencySymbol={generalInterface?.currencySymbol}
                // Globe only until xl; screen readers always get the label
                labelClassName="max-xl:sr-only"
                className="h-10 px-2.5 text-sm hover:bg-mist aria-expanded:bg-mist max-xl:w-10 max-xl:justify-center max-xl:px-0 [&>svg]:size-5"
              />
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
              {/* Static: the demo bag is always empty (see Cart) */}
              <span className="tag-dark absolute top-0 -right-1.25 min-h-4.5 min-w-4.5 justify-center px-1 leading-4.5 tracking-normal">
                0
              </span>
              <span className="sr-only"> items in bag</span>
            </button>
          </div>
        </nav>
      </header>

      {/* The mega menu's scrim: outside the sticky header, so it can cover the page; a click
          on it is a click outside the menu, which closes it. It dims with the unroll and
          clears as quickly as the panel fades. */}
      <div
        aria-hidden="true"
        data-chrome="scrim"
        className="invisible fixed inset-0 z-44 bg-ink/30 opacity-0 transition-[opacity,visibility] duration-(--dur-quick) ease-out peer-has-[[data-open]]:visible peer-has-[[data-open]]:opacity-100 peer-has-[[data-open]]:duration-(--dur-sheet)"
      />
    </>
  );
}
