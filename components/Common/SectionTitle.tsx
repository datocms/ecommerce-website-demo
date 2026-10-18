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
  action?: { label: ReactNode; href: string };
  /** Extra controls after the action, such as rail arrows */
  aside?: ReactNode;
  className?: string;
};

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
        'flex flex-col justify-between gap-8 lg:flex-row lg:items-end',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-[51.25rem]">
        {eyebrow && (
          <p className="pretitle">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full bg-butter"
            />
            {eyebrow}
          </p>
        )}
        <Heading id={id} className={`h-xl ${eyebrow ? 'mt-5' : ''}`}>
          {title}
        </Heading>
        {description && (
          <p className="mt-5 max-w-[36em] text-lg text-pretty text-ink/80 lg:text-[1.3125rem] lg:leading-[1.5]">
            {description}
          </p>
        )}
      </div>
      {(action || aside) && (
        <div className="flex shrink-0 items-center gap-3">
          {action && (
            <Link href={action.href} className="btn-primary">
              {action.label}
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          )}
          {aside}
        </div>
      )}
    </div>
  );
}
