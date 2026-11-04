import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { isLink } from 'datocms-structured-text-utils';
import Link from 'next/link';
import { createElement, type ReactNode } from 'react';
import { renderNodeRule } from 'react-datocms/structured-text';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import DatoStructuredText from '@/components/DatoStructuredText';

type LayoutNotification = NonNullable<
  NonNullable<LayoutQuery['layout']>['notification']
>;

type Props = {
  notification: LayoutNotification;
  onDismiss: () => void;
  lng: string;
};

// The grey marker would be lost on black: marks render as semibold instead
const renderMarkAsSemibold = (
  tag: string,
  props: { key?: string } | null,
  ...children: ReactNode[]
) =>
  tag === 'mark' ? (
    <span key={props?.key} className="font-semibold">
      {children}
    </span>
  ) : (
    createElement(tag, props, ...children)
  );

export default function NotificationStrip({
  notification,
  lng,
  onDismiss,
}: Props) {
  return (
    <div data-chrome="strip" className="surface-ink">
      <div className="shell relative flex min-h-10 items-center justify-center py-2.5 text-center">
        {/* px-10 keeps the message clear of the dismiss button */}
        <DatoStructuredText
          className="min-w-0 px-10 text-xs"
          data={notification}
          renderNode={renderMarkAsSemibold}
          customNodeRules={[
            renderNodeRule(isLink, ({ node, children, key }) => {
              return (
                <Link
                  href={`/${lng}${node.url}`}
                  className="group inline-flex items-center gap-1 font-semibold whitespace-nowrap underline-offset-4 hover:underline"
                  key={key}
                >
                  {children}
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-3.5 shrink-0 stroke-2 transition-transform duration-200 group-hover:translate-x-0.75"
                  />
                </Link>
              );
            }),
          ]}
        />
        {/* Lined up with the header's bag icon below */}
        <button
          type="button"
          aria-label="Dismiss announcement"
          className="icon-btn absolute top-1/2 right-[calc(var(--gutter)-0.4375rem)] size-10 -translate-y-1/2 focus-visible:outline-offset-[-2px] [&>svg]:size-4 [&>svg]:stroke-2"
          onClick={onDismiss}
        >
          <XMarkIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
