import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { ReactNode } from 'react';

type SectionTitleProps = {
  /** CMS pre-title only. Never invent one. */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** CMS subtitle or description under the title */
  description?: ReactNode;
  as?: 'h1' | 'h2';
  /** Heading id, for the section's aria-labelledby */
  id?: string;
  /** Right-aligned text link with an arrow, such as "All products" */
  action?: { label: ReactNode; href: string };
  /** Extra controls after the action, such as rail arrows */
  aside?: ReactNode;
  className?: string;
};

// Title block of a section: small label, h2 and an optional line
// on the left; a text link and controls bottom-aligned on the right
export default function SectionTitle({
  eyebrow,
  title,
  description,
  as: Heading = 'h2',
  id,
  action,
  aside,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={[
        'flex flex-wrap items-end justify-between gap-x-10 gap-y-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-[51.25rem] min-w-0">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <Heading id={id} className="title-section">
          {title}
        </Heading>
        {description && (
          <p className="mt-5 max-w-[36em] text-lg text-pretty text-ink-2 lg:text-xl lg:leading-[1.45] lg:tracking-[-0.015em]">
            {description}
          </p>
        )}
      </div>
      {(action || aside) && (
        <div className="flex shrink-0 items-center gap-6">
          {action && (
            <Link href={action.href} className="group tlink">
              {action.label}
              <ArrowRightIcon aria-hidden="true" className="stroke-2" />
            </Link>
          )}
          {aside}
        </div>
      )}
    </div>
  );
}
