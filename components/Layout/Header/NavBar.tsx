'use client';

import { PopoverGroup } from '@headlessui/react';
import {
  Bars2Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, Suspense, useRef, useState } from 'react';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import OptionalLink from '@/components/Common/OptionalLink';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import LanguageSelector from '@/components/Layout/LanguageSelector';
import LinkPending from '@/components/Motion/LinkPending';
import { readFragment } from '@/lib/datocms/graphql';
import { linkHref } from '@/lib/datocms/linkHref';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import { homePath } from '@/lib/routes';
import Cart from './Cart';
import DropdownNavItem from './DropdownNavItem';
import MobileMenu from './MobileMenu';
import { type LinkItem, splitMenu } from './menu';
import SearchDialog from './SearchDialog';
import SiteLogo from './SiteLogo';
import { NAV_ITEM } from './styles';

type Props = {
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

const BAR_ICON = 'icon-btn size-10 [&>svg]:size-5.5';

type NavLinkProps = {
  /** null when the link item has no target: the label renders as plain text */
  href: string | null;
  current: boolean;
  children: ReactNode;
};

function NavLink({ href, current, children }: NavLinkProps) {
  return (
    <li>
      <OptionalLink
        href={href}
        aria-current={current ? 'page' : undefined}
        className={NAV_ITEM}
      >
        {children}
        {!!href && <LinkPending />}
      </OptionalLink>
    </li>
  );
}

export default function NavBar({ globalPageProps, data }: Props) {
  const lng = globalPageProps.params.lng;
  const pathname = usePathname();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [searchMinHeight, setSearchMinHeight] = useState(0);
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const menu = data.layout?.menu ?? [];
  const { links, categories, leftItems, rightLinks } = splitMenu(menu);

  const generalInterface = data.generalInterface;
  const searchPlaceholder = generalInterface?.searchPlaceholder || 'Search';
  const socials = data.layout?.socialMediaLinks ?? [];

  const isCurrent = (link: LinkItem) => pathname === linkHref(lng, link);

  const logoFragment = data.layout?.logo.responsiveImage;
  const logo =
    logoFragment && readFragment(ResponsiveImageFragment, logoFragment);
  // The Layout model has no site-name field: footerTitle doubles as the header wordmark
  const wordmark = data.layout?.footerTitle;

  // The sheet covers at least the strip and the header, whatever their height (the strip wraps
  // on phones)
  const openSearch = () => {
    setSearchMinHeight(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    setSearchIsOpen(true);
  };

  return (
    <>
      <Cart
        open={cartIsOpen}
        onClose={() => setCartIsOpen(false)}
        currencySymbol={generalInterface?.currencySymbol}
      />

      {/* SearchDialog reads useSearchParams, so it gets its own boundary */}
      <Suspense>
        <SearchDialog
          lng={lng}
          open={searchIsOpen}
          onClose={() => setSearchIsOpen(false)}
          placeholder={searchPlaceholder}
          minHeight={searchMinHeight}
        />
      </Suspense>

      <MobileMenu
        open={menuIsOpen}
        onClose={() => setMenuIsOpen(false)}
        title={<SiteLogo logo={logo} wordmark={wordmark} />}
        lng={lng}
        categories={categories}
        links={links}
        isCurrent={isCurrent}
        generalInterface={generalInterface}
        searchPlaceholder={searchPlaceholder}
        socials={socials}
        locales={data._site.locales}
      />

      {/* z-45 clears the floating controls (z-40), so the scrim dims them; sticky anchors the mega menu */}
      <header
        ref={headerRef}
        data-chrome="header"
        className="peer sticky top-0 z-45 border-b border-line bg-white"
      >
        {/* --nav-x: 6px to 14px over 1100-1280px, so long locales clear the logo; an open panel keeps the only underline */}
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
                    <NavLink
                      key={item.id}
                      href={linkHref(lng, item)}
                      current={isCurrent(item)}
                    >
                      {item.label}
                    </NavLink>
                  );
                }

                return (
                  <DropdownNavItem
                    key={item.id}
                    category={item}
                    generalInterface={generalInterface}
                    lng={lng}
                  />
                );
              })}
            </PopoverGroup>
          </div>

          <Link
            href={homePath(lng)}
            className="flex items-center gap-2.5 justify-self-center"
          >
            {/* Under 360px the mark alone clears the menu and search buttons */}
            <SiteLogo
              logo={logo}
              wordmark={wordmark}
              wordmarkClassName="max-[22.5rem]:sr-only"
            />
            {!wordmark && <span className="sr-only">Home</span>}
          </Link>

          <div className="-mr-2.5 flex min-w-0 items-center justify-self-end">
            {rightLinks.length > 0 && (
              <ul className="hidden items-center [--nav-x:clamp(0.625rem,calc((100vw_-_68.75rem)/45_+_0.625rem),0.875rem)] nav:flex">
                {rightLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    href={linkHref(lng, link)}
                    current={isCurrent(link)}
                  >
                    {link.label}
                  </NavLink>
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
                currencySymbols={generalInterface?._allCurrencySymbolLocales}
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
            {/* mr-0.75 keeps the count badge 8px off a phone's edge */}
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

      {/* Mega menu scrim, outside the sticky header so it covers the page */}
      <div
        aria-hidden="true"
        data-chrome="scrim"
        className="invisible fixed inset-0 z-44 bg-ink/30 opacity-0 transition-[opacity,visibility] duration-(--dur-quick) ease-out peer-has-[[data-open]]:visible peer-has-[[data-open]]:opacity-100 peer-has-[[data-open]]:duration-(--dur-sheet)"
      />
    </>
  );
}
