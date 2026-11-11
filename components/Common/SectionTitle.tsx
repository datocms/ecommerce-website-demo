import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cx } from '@/lib/classNames';

type Props = {
  title: ReactNode;
  /** Heading id, for the section's aria-labelledby */
  id?: string;
  /** Right-aligned text link with an arrow, such as "All products" */
  action?: { label: ReactNode; href: string };
  /** Extra controls after the action, such as rail arrows */
  aside?: ReactNode;
  className?: string;
};

export default function SectionTitle({
  title,
  id,
  action,
  aside,
  className,
}: Props) {
  return (
    <div
      className={cx(
        'flex flex-wrap items-end justify-between gap-x-10 gap-y-6',
        className,
      )}
    >
      <div className="max-w-[51.25rem] min-w-0">
        <h2 id={id} className="title-section">
          {title}
        </h2>
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
