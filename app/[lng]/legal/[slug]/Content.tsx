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
import { getProductFieldEditAttributes } from '@/utils/datocmsVisualEditing';
import type { PageProps, Query } from './meta';

type LegalContentViewProps = PageProps & {
  data: Query;
};

export function LegalContentView({ data, params }: LegalContentViewProps) {
  if (!data.legalPage) {
    return null;
  }

  const locale = params.lng;
  const editingUrl =
    (data.legalPage as { _editingUrl?: string | null })?._editingUrl ?? null;
  const contentEditAttributes = editingUrl
    ? getProductFieldEditAttributes(editingUrl, locale, 'content')
    : {};
  const contentWrapperProps =
    editingUrl && Object.keys(contentEditAttributes).length > 0
      ? { ...contentEditAttributes, 'data-datocms-edit-target': '' }
      : undefined;

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
const Content: ContentPage<PageProps, Query> = (props) => {
  if (!props.data.legalPage) {
    notFound();
  }

  return <LegalContentView {...props} />;
};

export default Content;
