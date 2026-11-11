// Full-height bar item; its ::after is the 2px underline (hover, open, current, loading)
export const NAV_ITEM =
  'bar-draw relative inline-flex h-18 items-center gap-1 px-(--nav-x) text-xs font-medium whitespace-nowrap after:absolute after:inset-x-(--nav-x) after:-bottom-px after:h-0.5 after:bg-ink hover:after:scale-x-100 focus-visible:outline-offset-[-2px] has-data-pending:after:scale-x-100 aria-[current=page]:after:scale-x-100 data-open:after:scale-x-100 xl:text-sm';

// A full-width row of the mobile menu
export const MENU_ROW =
  'title-item flex h-16 w-full items-center justify-between gap-4 text-left text-[1.375rem] tracking-[-0.03em] focus-visible:outline-offset-[-2px]';
