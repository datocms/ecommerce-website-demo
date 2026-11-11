import { stripStega } from '@datocms/content-link';
import { type Document, isHeading } from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/DatoStructuredText';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { toLanguageTag } from '@/lib/i18n';
import type { PageProps, Query } from './meta';
import SectionIndex from './SectionIndex';
import { indexSections } from './sections';

const Content: ContentPage<PageProps, Query> = ({ data, params }) => {
  if (!data.legalPage) {
    notFound();
  }

  const { title, content } = data.legalPage;
  const value = content.value as Document;
  const { sections, anchorIds } = indexSections(value);

  return (
    <div className="shell grid pt-(--page-top) lg:grid-cols-12 lg:gap-x-4">
      {sections.length > 0 && (
        <SectionIndex label={stripStega(title)} sections={sections} />
      )}
      <article
        lang={toLanguageTag(params.lng)}
        // The h1 takes the page-title size and arrival
        className={`prose-dato [&_h1]:title-statement [&_h1]:enter ${sections.length > 0 ? 'lg:col-span-8 lg:col-start-5' : 'lg:col-span-full'}`}
      >
        <h1>{title}</h1>
        <DatoStructuredText
          data={value}
          customNodeRules={[
            renderNodeRule(
              isHeading,
              ({ adapter: { renderNode }, node, children, key }) =>
                renderNode(
                  `h${node.level}`,
                  { key, id: anchorIds.get(node) },
                  children,
                ),
            ),
          ]}
        />
      </article>
    </div>
  );
};

export default Content;
