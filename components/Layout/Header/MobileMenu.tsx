import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent, ReactNode } from 'react';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import Drawer from '@/components/Common/Drawer';
import SocialLink from '@/components/Common/SocialLink';
import LanguageSelector from '@/components/Layout/LanguageSelector';
import type { SiteLocale } from '@/lib/i18n';
import FeatureTiles from './FeatureTiles';
import {
  type DropdownMenu,
  type LinkItem,
  linkHref,
  productSearchHref,
  productsHref,
} from './menu';

type Props = {
  open: boolean;
  onClose: () => void;
  /** The header's logo lockup, shown in the drawer's title bar */
  title: ReactNode;
  lng: string;
  categories: DropdownMenu[];
  links: LinkItem[];
  isCurrent: (link: LinkItem) => boolean;
  generalInterface: LayoutQuery['generalInterface'];
  searchPlaceholder: string;
  socials: NonNullable<LayoutQuery['layout']>['socialMediaLinks'];
  locales: SiteLocale[];
};

// Rows of the mobile menu
const MENU_ROW =
  'title-item flex h-16 w-full items-center justify-between gap-4 text-left text-[1.375rem] tracking-[-0.03em] focus-visible:outline-offset-[-2px]';

// The menu below the nav breakpoint: a left drawer with the search field, each dropdown as a
// disclosure, the links, then the language switch and socials. The search, the nav and the
// last row are the Drawer's direct children, so its body staggers them in.
export default function MobileMenu({
  open,
  onClose,
  title,
  lng,
  categories,
  links,
  isCurrent,
  generalInterface,
  searchPlaceholder,
  socials,
  locales,
}: Props) {
  const router = useRouter();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(
      productSearchHref(
        lng,
        new FormData(event.currentTarget).get('productName'),
      ),
    );
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      closeLabel="Close menu"
      title={title}
    >
      <search>
        <form onSubmit={handleSearch} className="relative">
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
            <DisclosurePanel className="quick enter space-y-5 pb-6">
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
                          href={productsHref(lng, item)}
                          onClick={onClose}
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
                <FeatureTiles
                  category={category}
                  generalInterface={generalInterface}
                  lng={lng}
                  sizes="(min-width: 640px) 12.5rem, 45vw"
                  onNavigate={onClose}
                  compact
                />
              </div>
            </DisclosurePanel>
          </Disclosure>
        ))}

        {links.length > 0 && (
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={linkHref(lng, link)}
                  onClick={onClose}
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
        <LanguageSelector
          languages={locales}
          currencySymbol={generalInterface?.currencySymbol}
          placement="above-start"
          className="h-11 border border-line px-4 text-sm hover:border-ink aria-expanded:border-ink"
          onNavigate={onClose}
        />
        {socials.length > 0 && (
          <div className="-mr-3 flex">
            {socials.map((social) => (
              <SocialLink key={social.id} social={social} />
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}
