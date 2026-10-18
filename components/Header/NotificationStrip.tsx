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
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type LayoutNotification = NonNullable<
  NonNullable<LayoutQuery['layout']>['notification']
>;

type Props = {
  notification: LayoutNotification;
  onDismiss: () => void;
  globalPageProps: ResolvedGlobalPageProps;
  /** The language and currency trigger, shown on the right from lg */
  localeSwitch?: ReactNode;
};

const NotificationStrip = ({
  notification,
  globalPageProps,
  onDismiss,
  localeSwitch,
}: Props) => {
  return (
    <div className="bg-butter text-ink">
      {/* From lg the spacer mirrors the right cluster, so the message is truly centred */}
      <div className="shell flex min-h-10 items-center gap-3">
        <span aria-hidden="true" className="hidden w-33 shrink-0 lg:block" />
        <DatoStructuredText
          className="min-w-0 flex-1 py-2 text-center text-xs font-medium"
          data={notification.value as StructuredText<Record, Record>}
          // Butter is the strip's own colour: marks render as semibold instead of a wash
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
                  className="ml-1 inline-flex items-center gap-1 rounded-full bg-ink py-0.5 pr-2.5 pl-2.75 leading-5 font-semibold whitespace-nowrap text-cream transition-colors hover:bg-ink-hover"
                  key={key}
                >
                  {children}
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-3.5 shrink-0 stroke-[2.4]"
                  />
                </Link>
              );
            }),
          ]}
        />
        <div className="flex shrink-0 items-center justify-end gap-4 lg:w-33">
          {localeSwitch && (
            <div className="hidden text-xs lg:block">{localeSwitch}</div>
          )}
          {/* 32px disc, 44px hit area */}
          <button
            type="button"
            aria-label="Dismiss announcement"
            className="icon-btn relative -mr-1.5 size-8 after:absolute after:-inset-1.5 [&>svg]:size-4 [&>svg]:stroke-[2.4]"
            onClick={onDismiss}
          >
            <XMarkIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationStrip;
