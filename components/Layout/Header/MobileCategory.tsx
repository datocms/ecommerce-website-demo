'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { Query as LayoutQuery } from '@/app/[lng]/(site)/meta';
import FeatureTiles from './FeatureTiles';
import { type DropdownMenu, productsHref } from './menu';
import { MENU_ROW } from './styles';

type Props = {
  category: DropdownMenu;
  defaultOpen: boolean;
  generalInterface: LayoutQuery['generalInterface'];
  lng: string;
  onClose: () => void;
};

export default function MobileCategory({
  category,
  defaultOpen,
  generalInterface,
  lng,
  onClose,
}: Props) {
  return (
    <Disclosure
      as="div"
      defaultOpen={defaultOpen}
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
        {category.column.map((column) => {
          const headingId = `${category.id}-${column.id}-heading-mobile`;
          return (
            <div key={column.id}>
              <p id={headingId} className="eyebrow">
                {column.label}
              </p>
              <ul
                aria-labelledby={headingId}
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
          );
        })}
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
  );
}
