import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import MegaMenuPanel from './MegaMenuPanel';
import type { DropdownMenu } from './menu';
import { NAV_ITEM } from './styles';

type Props = {
  category: DropdownMenu;
  generalInterface: LayoutQuery['generalInterface'];
  lng: string;
};

export default function DropdownNavItem({
  category,
  generalInterface,
  lng,
}: Props) {
  return (
    <li>
      <Popover>
        {/* Headless focuses the button on click: keep the ring for keyboard focus only */}
        <PopoverButton className={`group ${NAV_ITEM} not-data-focus:outline-0`}>
          {category.label}
          <ChevronDownIcon
            aria-hidden="true"
            className="size-3.75 stroke-2 transition-transform duration-200 group-data-open:rotate-180"
          />
        </PopoverButton>

        <PopoverPanel
          transition
          className="wipe absolute inset-x-0 top-[calc(100%+1px)] border-b border-line bg-white"
        >
          {({ close }) => (
            <MegaMenuPanel
              category={category}
              generalInterface={generalInterface}
              lng={lng}
              // close() takes an element to refocus, so don't pass it the click event
              onNavigate={() => close()}
            />
          )}
        </PopoverPanel>
      </Popover>
    </li>
  );
}
