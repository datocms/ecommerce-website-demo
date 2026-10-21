import Link from 'next/link';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import FeatureTiles from './FeatureTiles';
import { type DropdownMenu, productsHref } from './menu';

type Props = {
  category: DropdownMenu;
  generalInterface: LayoutQuery['generalInterface'];
  lng: string;
  onNavigate: () => void;
};

// A dropdown's content on desktop: its link columns on the left half, the two featured tiles on
// the right. NavBar's PopoverPanel places it under the header and unrolls it.
export default function MegaMenuPanel({
  category,
  generalInterface,
  lng,
  onNavigate,
}: Props) {
  return (
    <div className="quick shell grid grid-cols-12 gap-4 pt-10 pb-12">
      <div className="enter-stagger col-span-6 grid grid-cols-3 content-start gap-6 pr-6 xl:gap-8 xl:pr-8 [--delay:60ms]">
        {category.column.map((column) => (
          <div key={column.id} className="min-w-0">
            <p
              id={`${category.id}-${column.id}-heading`}
              className="eyebrow border-b border-line pb-3"
            >
              {column.label}
            </p>
            {/* 36px full-width rows; -mx-2 px-2 leaves room for the focus ring, and leading-5
                keeps a wrapped name reading as one item */}
            <ul
              aria-labelledby={`${category.id}-${column.id}-heading`}
              className="mt-2.5 -mb-1.5"
            >
              {column.item.map((menuItem) => (
                <li key={menuItem.id}>
                  <Link
                    href={productsHref(lng, menuItem)}
                    onClick={onNavigate}
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
      <div className="enter-stagger col-span-6 grid grid-cols-2 grid-rows-[1fr_auto] gap-x-4 gap-y-3 [--delay:120ms]">
        <FeatureTiles
          category={category}
          generalInterface={generalInterface}
          lng={lng}
          sizes="(min-width: 1440px) 20.5rem, 23vw"
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
