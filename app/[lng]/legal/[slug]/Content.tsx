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

const Content: ContentPage<PageProps, Query> = ({ data, params }) => {
  if (!data.legalPage) {
    notFound();
  }

  const value = data.legalPage.content.value as Document;

  // Second-level headings get anchors and make up the section index
  const anchors = new Map<Node, string>();
  const sections: Section[] = [];
  let label: string | undefined;
  for (const node of value.document.children) {
    if (!isHeading(node)) continue;
    const title = stripStega(textOf(node)).trim();
    if (node.level === 1) label ??= title || undefined;
    if (node.level !== 2) continue;
    const slug = slugify(title) || `section-${sections.length + 1}`;
    let id = slug;
    for (let n = 2; sections.some((section) => section.id === id); n++) {
      id = `${slug}-${n}`;
    }
    anchors.set(node, id);
    sections.push({ id, title });
  }

  // The document's h1 is the page title, so it takes the page-title step rather than prose's
  return (
    <div className="shell grid pt-(--page-top) lg:grid-cols-12 lg:gap-x-4">
      {sections.length > 0 && (
        <SectionIndex label={label} sections={sections} />
      )}
      <article
        lang={params.lng}
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
                  { key, id: anchors.get(node) },
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
