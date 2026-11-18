import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import LinkPending from '@/components/Motion/LinkPending';

type Props = {
  query: string;
  /** The current listing URL without the search */
  clearHref: string;
  /** General interface "Clear search" label */
  clearSearchLabel: string | undefined;
};

// The active name search in the toolbar; following it clears the search. 36px tall with a 44px
// hit area (::after); the magnifier hides where the row is tight
export default function SearchChip({
  query,
  clearHref,
  clearSearchLabel,
}: Props) {
  return (
    <Link
      href={clearHref}
      aria-label={`${clearSearchLabel} “${query}”`}
      className="relative inline-flex h-9 min-w-0 items-center gap-2 bg-mist pr-1 pl-3 text-sm font-medium press after:absolute after:inset-x-0 after:-inset-y-1 hover:bg-line"
    >
      <MagnifyingGlassIcon
        aria-hidden="true"
        className="size-4 shrink-0 stroke-2 text-mute max-sm:hidden lg:max-xl:hidden"
      />
      <span className="min-w-0 truncate">“{query}”</span>
      <span
        aria-hidden="true"
        className="grid size-7 shrink-0 place-items-center [&>svg]:size-4 [&>svg]:stroke-2"
      >
        <XMarkIcon />
      </span>
      <LinkPending />
    </Link>
  );
}
