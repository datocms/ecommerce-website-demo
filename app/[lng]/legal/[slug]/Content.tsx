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

  return (
    <div className="shell grid gap-4 pt-1 xl:grid-cols-12 xl:gap-5">
      {sections.length > 0 && (
        <SectionIndex label={label} sections={sections} />
      )}
      <article
        lang={params.lng}
        className={`rounded-card bg-white px-(--panel-pad) py-10 sm:py-14 lg:py-20 ${sections.length > 0 ? 'xl:col-span-9' : 'xl:col-span-12'}`}
      >
        <div className="prose-dato mx-auto max-w-[68ch] [&_:is(h1,h2)]:hyphens-auto [&_:is(h1,h2)]:[hyphenate-limit-chars:13_5_5]">
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
        </div>
      </article>
    </div>
  );
};

export default Content;
