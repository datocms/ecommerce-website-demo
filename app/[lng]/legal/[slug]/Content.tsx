/**
 * @fileoverview Legal page content renderer used by server and realtime
 * client. Renders structured text with headings and paragraphs.
 */
import {
  isHeading,
  isParagraph,
  type Record,
  type StructuredText,
} from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import {
  renderNodeRule,
  StructuredText as StructuredTextField,
} from 'react-datocms';
import Highlighter from '@/components/Common/Highlighter';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { buildEditWrapperProps } from '@/utils/datocmsVisualEditing';
import type { PageProps, Query } from './meta';

type LegalContentViewProps = PageProps & {
  data: Query;
};

/** Render the legal page content with inline edit attributes when available. */
export function LegalContentView({ data, params }: LegalContentViewProps) {
  if (!data.legalPage) {
    return null;
  }

  const locale = params.lng;
  const editingUrl =
    (data.legalPage as { _editingUrl?: string | null })?._editingUrl ?? null;
  const contentWrapperProps = buildEditWrapperProps(
    editingUrl,
    locale,
    'content',
  );

  return (
    <section className="mt-24 pb-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <div>
              <div>
                <div {...(contentWrapperProps ?? {})}>
                  <StructuredTextField
                    data={
                      data.legalPage.content.value as StructuredText<
                        Record,
                        Record
                      >
                    }
                    renderNode={Highlighter}
                    customNodeRules={[
                      renderNodeRule(isHeading, ({ children, key }) => {
                        return (
                          <h3
                            className="mb-4 mt-9 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                            key={key}
                          >
                            {children}
                          </h3>
                        );
                      }),
                      renderNodeRule(isParagraph, ({ children, key }) => {
                        return (
                          <p
                            className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed"
                            key={key}
                          >
                            {children}
                          </p>
                        );
                      }),
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Server component retains control over routing helpers.
/** Server entry that validates the record and renders the shared view. */
const Content: ContentPage<PageProps, Query> = (props) => {
  if (!props.data.legalPage) {
    notFound();
  }

  return <LegalContentView {...props} />;
};

export default Content;
