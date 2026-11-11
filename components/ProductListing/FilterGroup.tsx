'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import AppliedCount from './AppliedCount';
import type { FilterKey } from './filterParams';

type Props = {
  id: FilterKey;
  name: string | null | undefined;
  options: { id: string; name: string }[];
  selectedIds: string[];
  /** How many options are on; shown when the group narrows the listing */
  checked: number;
  narrowed: boolean;
  defaultOpen: boolean;
  onToggle: (optionId: string) => void;
};

export default function FilterGroup({
  id,
  name,
  options,
  selectedIds,
  checked,
  narrowed,
  defaultOpen,
  onToggle,
}: Props) {
  return (
    <Disclosure
      as="div"
      defaultOpen={defaultOpen}
      className="border-t border-line"
    >
      {({ open }) => (
        <>
          <h3>
            <DisclosureButton className="group flex min-h-16 w-full items-center justify-between gap-4 py-2 text-left">
              <span className="title-item flex items-center gap-3">
                {name}
                {narrowed && <AppliedCount count={checked} />}
              </span>
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center border border-line transition-colors duration-150 group-hover:border-ink [&>svg]:size-[1.125rem] [&>svg]:stroke-2"
              >
                {open ? <MinusIcon /> : <PlusIcon />}
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="quick enter pb-6">
            <ul className="grid grid-cols-2 gap-x-4">
              {options.map((option) => (
                <li key={option.id}>
                  <label className="group/option flex min-h-11 cursor-pointer items-center gap-3 text-base">
                    <input
                      type="checkbox"
                      name={`${id}[]`}
                      value={option.id}
                      checked={selectedIds.includes(option.id)}
                      onChange={() => onToggle(option.id)}
                      className="checkbox"
                    />
                    <span className="min-w-0 py-2 leading-tight hyphens-auto wrap-break-word underline-offset-4 group-hover/option:underline">
                      {option.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
