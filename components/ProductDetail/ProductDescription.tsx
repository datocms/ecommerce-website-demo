import {
  isHeading,
  isList,
  isListItem,
  isRoot,
} from 'datocms-structured-text-utils';
import { Fragment } from 'react';
import { renderNodeRule } from 'react-datocms/structured-text';
import type { Product } from '@/app/[lng]/(site)/product/[slug]/meta';
import DatoStructuredText from '@/components/DatoStructuredText';
import ProductInfoSection from './Blocks/ProductInfoSection';
import QuestionsSection from './Blocks/QuestionsSection';
import type { ProductPageLabels } from './fragments';
import { groupDescriptionNodes, type TextRow } from './groupDescription';
import { BUY_BOX_COLUMN } from './styles';

type Props = {
  product: Product;
  labels: ProductPageLabels;
  lng: string;
};

function DescriptionText({ rows }: { rows: TextRow[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-x-4 lg:gap-y-10">
      {rows.map((row) => {
        const hasTextAndLists = row.text.length > 0 && row.lists.length > 0;
        return (
          <Fragment key={row.key}>
            {row.text.length > 0 && (
              // The first paragraph is the lead; copy without care labels keeps a readable
              // measure instead of running the full width
              <div
                className={`prose-dato [&>p:first-of-type]:text-xl [&>p:first-of-type]:leading-[1.5] xl:[&>p:first-of-type]:text-2xl xl:[&>p:first-of-type]:leading-[1.45] ${hasTextAndLists ? 'lg:col-span-6' : 'lg:col-span-8 xl:col-span-7'}`}
              >
                {row.text}
              </div>
            )}
            {row.lists.length > 0 && (
              <div
                className={`grid content-start gap-2 ${hasTextAndLists ? BUY_BOX_COLUMN : 'lg:col-span-full'}`}
              >
                {row.lists}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export default function ProductDescription({ product, labels, lng }: Props) {
  if (!product.description) return null;

  return (
    <div className="shell pt-(--section-gap)">
      <DatoStructuredText
        data={product.description}
        className="grid gap-16 lg:gap-20"
        renderBlock={({ record }) => {
          switch (record.__typename) {
            case 'ProductFeatureSectionRecord':
              return (
                <ProductInfoSection
                  fragment={record}
                  material={product.material}
                  labels={labels}
                  lng={lng}
                />
              );
            case 'FeaturedQuestionsSectionRecord':
              return <QuestionsSection fragment={record} />;
            default:
              return null;
          }
        }}
        customNodeRules={[
          renderNodeRule(isRoot, ({ node, children, key }) => (
            <Fragment key={key}>
              {groupDescriptionNodes(node, children).map((part) =>
                'block' in part ? (
                  part.block
                ) : (
                  <DescriptionText key={part.key} rows={part.rows} />
                ),
              )}
            </Fragment>
          )),
          renderNodeRule(isHeading, ({ node, children, key }) => {
            // The page already has its h1
            const Heading =
              node.level === 1 ? 'h2' : (`h${node.level}` as const);
            return <Heading key={key}>{children}</Heading>;
          }),
          renderNodeRule(isListItem, ({ children, key }) => (
            // A label, not a control: the decorative hairline instead of a control's boundary
            <li
              key={key}
              className="chip min-h-10 border-line px-3.5 [&>p]:m-0"
            >
              {children}
            </li>
          )),
          renderNodeRule(isList, ({ children, key }) => (
            <ul key={key} className="flex flex-wrap gap-2">
              {children}
            </ul>
          )),
        ]}
      />
    </div>
  );
}
