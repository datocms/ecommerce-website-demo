import {
  isHeading,
  isList,
  isListItem,
  isRoot,
} from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import { Fragment, isValidElement, type ReactNode } from 'react';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/DatoStructuredText';
import ProductInfoSection from '@/components/ProductDetail/Blocks/ProductInfoSection';
import QuestionsSection from '@/components/ProductDetail/Blocks/QuestionsSection';
import BuyBox from '@/components/ProductDetail/BuyBox';
import RelatedProducts from '@/components/ProductDetail/RelatedProducts';
import Reviews from '@/components/ProductDetail/Reviews';
import { PDP_RAIL } from '@/components/ProductDetail/styles';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';

type TextRow = { key: string; text: ReactNode[]; lists: ReactNode[] };
type TextGroup = { key: string; rows: TextRow[] };

// The renderer keys top-level nodes "t-<index>", which leads back to the node's type
const nodeIndex = (child: ReactNode) =>
  isValidElement(child) ? Number(String(child.key).split('-').pop()) : -1;

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.product) {
    notFound();
  }
  return (
    <>
      <BuyBox data={data} globalPageProps={globalPageProps} />
      {data.product.description && (
        <div className="shell pt-(--section-gap)">
          <DatoStructuredText
            data={data.product.description}
            className="grid gap-16 lg:gap-20"
            renderBlock={({ record }) => {
              switch (record.__typename) {
                case 'ProductFeatureSectionRecord':
                  return (
                    <ProductInfoSection
                      ProductInfoFragment={record}
                      MaterialFragment={data.product?.material}
                      generalInterfaceFragment={data.generalInterface}
                      globalPageProps={globalPageProps}
                    />
                  );
                case 'FeaturedQuestionsSectionRecord':
                  return <QuestionsSection fragment={record} />;
                default:
                  return null;
              }
            }}
            customNodeRules={[
              // Text between blocks becomes one group: the copy as a lead on the left, care labels
              // on the buy box's line. Copy that follows a list starts a new row, so the source
              // order is kept.
              renderNodeRule(isRoot, ({ node, children, key }) => {
                const parts: Array<{ block: ReactNode } | TextGroup> = [];
                for (const child of children ?? []) {
                  const type = node.children[nodeIndex(child)]?.type;
                  if (type === 'block') {
                    parts.push({ block: child });
                    continue;
                  }
                  const last = parts.at(-1);
                  const group =
                    last && 'rows' in last
                      ? last
                      : { key: `text-${parts.length}`, rows: [] };
                  if (group !== last) parts.push(group);
                  let row = group.rows.at(-1);
                  if (!row || (type !== 'list' && row.lists.length > 0)) {
                    row = {
                      key: `row-${group.rows.length}`,
                      text: [],
                      lists: [],
                    };
                    group.rows.push(row);
                  }
                  (type === 'list' ? row.lists : row.text).push(child);
                }
                return (
                  <Fragment key={key}>
                    {parts.map((part) => {
                      if ('block' in part) return part.block;
                      return (
                        <div
                          key={part.key}
                          className="grid gap-6 lg:grid-cols-12 lg:gap-x-4 lg:gap-y-10"
                        >
                          {part.rows.map((row) => {
                            const both =
                              row.text.length > 0 && row.lists.length > 0;
                            return (
                              <Fragment key={row.key}>
                                {row.text.length > 0 && (
                                  // The first paragraph is the lead; copy without care labels keeps a
                                  // readable measure instead of running the full width
                                  <div
                                    className={`prose-dato [&>p:first-of-type]:text-xl [&>p:first-of-type]:leading-[1.5] xl:[&>p:first-of-type]:text-2xl xl:[&>p:first-of-type]:leading-[1.45] ${both ? 'lg:col-span-6' : 'lg:col-span-8 xl:col-span-7'}`}
                                  >
                                    {row.text}
                                  </div>
                                )}
                                {row.lists.length > 0 && (
                                  <div
                                    className={`grid content-start gap-2 ${both ? PDP_RAIL : 'lg:col-span-full'}`}
                                  >
                                    {row.lists}
                                  </div>
                                )}
                              </Fragment>
                            );
                          })}
                        </div>
                      );
                    })}
                  </Fragment>
                );
              }),
              renderNodeRule(isHeading, ({ node, children, key }) => {
                // The page already has its h1
                const Heading =
                  node.level === 1 ? 'h2' : (`h${node.level}` as const);
                return <Heading key={key}>{children}</Heading>;
              }),
              renderNodeRule(isListItem, ({ children, key }) => {
                return (
                  // A label, not a control: the decorative hairline instead of a control's boundary
                  <li
                    key={key}
                    className="chip min-h-10 border-line px-3.5 [&>p]:m-0"
                  >
                    {children}
                  </li>
                );
              }),
              renderNodeRule(isList, ({ children, key }) => {
                return (
                  <ul key={key} className="flex flex-wrap gap-2">
                    {children}
                  </ul>
                );
              }),
            ]}
          />
        </div>
      )}
      <RelatedProducts data={data} globalPageProps={globalPageProps} />
      <Reviews data={data} globalPageProps={globalPageProps} />
    </>
  );
};

export default Content;
