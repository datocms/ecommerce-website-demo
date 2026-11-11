'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import Drawer from '@/components/Common/Drawer';
import OptionalLink from '@/components/Common/OptionalLink';
import SocialLink from '@/components/Common/SocialLink';
import LanguageSelector from '@/components/Layout/LanguageSelector';
import { linkHref } from '@/lib/datocms/linkHref';
import type { SiteLocale } from '@/lib/i18n';
import MobileCategory from './MobileCategory';
import MobileSearchForm from './MobileSearchForm';
import type { DropdownMenu, LinkItem } from './menu';
import { MENU_ROW } from './styles';

type Props = {
  open: boolean;
  onClose: () => void;
  /** The site logo, for the drawer's title bar */
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

// Below the nav breakpoint: search, dropdowns as disclosures, links, then language and socials.
// Keep these three blocks direct children of Drawer, which staggers them in.
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
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      closeLabel="Close menu"
      title={title}
    >
      <MobileSearchForm
        lng={lng}
        placeholder={searchPlaceholder}
        onDone={onClose}
      />

      <nav aria-label="Main" className="mt-2">
        {categories.map((category, index) => (
          <MobileCategory
            key={category.id}
            category={category}
            defaultOpen={index === 0}
            generalInterface={generalInterface}
            lng={lng}
            onClose={onClose}
          />
        ))}

        {links.length > 0 && (
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <OptionalLink
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
                </OptionalLink>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <LanguageSelector
          languages={locales}
          currencySymbol={generalInterface?.currencySymbol}
          currencySymbols={generalInterface?._allCurrencySymbolLocales}
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
