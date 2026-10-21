import { stripStega } from '@datocms/content-link';
import {
  type Document,
  hasChildren,
  isHeading,
  type Node,
} from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/DatoStructuredText';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';
import SectionIndex, { type Section } from './SectionIndex';

const textOf = (node: Node): string => {
  if ('value' in node) return node.value;
  return hasChildren(node)
    ? (node.children as Node[]).map(textOf).join('')
    : '';
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');

/** h2s become anchored entries in the section index; the h1 labels the index */
function indexSections(value: Document): {
  pageTitle?: string;
  sections: Section[];
  anchorIds: Map<Node, string>;
} {
  const anchorIds = new Map<Node, string>();
  const sections: Section[] = [];
  let pageTitle: string | undefined;
  for (const node of value.document.children) {
    if (!isHeading(node)) continue;
    const title = stripStega(textOf(node)).trim();
    if (node.level === 1) pageTitle ??= title || undefined;
    if (node.level !== 2) continue;
    const slug = slugify(title) || `section-${sections.length + 1}`;
    let id = slug;
    for (let n = 2; sections.some((section) => section.id === id); n++) {
      id = `${slug}-${n}`;
    }
    anchorIds.set(node, id);
    sections.push({ id, title });
  }
  return { pageTitle, sections, anchorIds };
}

const Content: ContentPage<PageProps, Query> = ({ data, params }) => {
  if (!data.legalPage) {
    notFound();
  }

  const value = data.legalPage.content.value as Document;
  const { pageTitle, sections, anchorIds } = indexSections(value);

  return (
    <div className="shell grid pt-(--page-top) lg:grid-cols-12 lg:gap-x-4">
      {sections.length > 0 && (
        <SectionIndex label={pageTitle} sections={sections} />
      )}
      <article
        lang={params.lng}
        // The document's h1 is the page title: it gets the title-statement size instead of
        // prose-dato's h1 size, and the page-title arrival (enter)
        className={`prose-dato [&_h1]:title-statement [&_h1]:enter ${sections.length > 0 ? 'lg:col-span-8 lg:col-start-5' : 'lg:col-span-full'}`}
      >
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
