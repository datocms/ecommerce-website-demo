import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  isLink,
  type Record,
  type StructuredText,
} from 'datocms-structured-text-utils';
import Link from 'next/link';
import { createElement, type ReactNode } from 'react';
import { renderNodeRule } from 'react-datocms/structured-text';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import DatoStructuredText from '@/components/DatoStructuredText';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';

export type LayoutNotification = NonNullable<
  NonNullable<LayoutQuery['layout']>['notification']
>;

type Props = {
  notification: LayoutNotification;
  onDismiss: () => void;
  globalPageProps: ResolvedGlobalPageProps;
};

const NotificationStrip = ({
  notification,
  globalPageProps,
  onDismiss,
}: Props) => {
  return (
    <div data-chrome="strip" className="surface-ink">
      <div className="shell relative flex min-h-10 items-center justify-center py-2.5 text-center">
        {/* px-10 keeps the centred message clear of the dismiss button */}
        <DatoStructuredText
          // No balancing: the nowrap link drops to the second line as a whole
          className="min-w-0 px-10 text-xs"
          data={notification.value as StructuredText<Record, Record>}
          // The grey marker would be lost on black: marks render as semibold instead
          renderNode={(
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
            )
          }
          customNodeRules={[
            renderNodeRule(isLink, ({ node, children, key }) => {
              return (
                <Link
                  href={`/${globalPageProps.params.lng}${node.url}`}
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
        {/* Placed like the header's bag button below it (7px into the gutter): the X sits
            over the bag glyph */}
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
};

export default NotificationStrip;
