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
import FeaturedProducts from '@/components/Grids/FeaturedProducts';
import ProductInfoSection from '@/components/Products/Product/Blocks/ProductInfoSection';
import QuestionsSection from '@/components/Products/Product/Blocks/QuestionsSection';
import ProductView from '@/components/Products/ProductView';
import Reviews from '@/components/Products/Reviews';
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
      <ProductView data={data} globalPageProps={globalPageProps} />
      {data.product.description && (
        <div className="shell pt-(--section-gap)">
          <DatoStructuredText
            data={data.product.description}
            className="grid gap-3 sm:gap-4 lg:gap-5"
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
              // Text between blocks becomes one white card: copy on the left, care chips on the right.
              // Copy that follows a list starts a new row, so the source order is kept.
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
                          className="grid gap-8 rounded-card bg-white p-(--card-pad) lg:grid-cols-12 lg:gap-10 lg:p-(--panel-pad)"
                        >
                          {part.rows.map((row) => {
                            const both =
                              row.text.length > 0 && row.lists.length > 0;
                            return (
                              <Fragment key={row.key}>
                                {row.text.length > 0 && (
                                  <div
                                    className={`prose-dato [&>p]:text-[1.1875rem] [&>p]:leading-[1.6] xl:[&>p]:text-[1.3125rem] ${both ? 'lg:col-span-7' : 'lg:col-span-full'}`}
                                  >
                                    {row.text}
                                  </div>
                                )}
                                {row.lists.length > 0 && (
                                  <div
                                    className={`grid content-start gap-2 ${both ? 'lg:col-span-4 lg:col-start-9' : 'lg:col-span-full'}`}
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
                  <li key={key} className="chip bg-cream shadow-none [&>p]:m-0">
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
      <FeaturedProducts data={data} globalPageProps={globalPageProps} />
      <Reviews data={data} globalPageProps={globalPageProps} />
    </>
  );
};

export default Content;
