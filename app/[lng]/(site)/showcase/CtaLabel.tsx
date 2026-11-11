import { ArrowRightIcon } from '@heroicons/react/24/outline';

// The showcase's call to action, with its href already built from the CMS link (null when the
// link has no target)
export type Cta = { label: string | null; href: string | null };

// The label can wrap in some locales: the word joiner keeps the arrow on its last word, and the
// tighter leading keeps two lines inside the button
export default function CtaLabel({ label }: Pick<Cta, 'label'>) {
  return (
    <span className="leading-[1.15]">
      {label}
      <span className="whitespace-nowrap">
        {'\u2060'}
        <ArrowRightIcon
          aria-hidden="true"
          className="ml-2.5 inline size-4.5 stroke-2 align-[-0.2em]"
        />
      </span>
    </span>
  );
}
