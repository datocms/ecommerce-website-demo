import FeaturedProducts from '@/components/Grids/FeaturedProducts';
import ProductInfoSection from '@/components/Products/Product/Blocks/ProductInfoSection';
import QuestionsSection from '@/components/Products/Product/Blocks/QuestionsSection';
import ProductView from '@/components/Products/ProductView';
import Reviews from '@/components/Products/Reviews';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { isHeading, isList, isListItem } from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import { StructuredText, renderNodeRule } from 'react-datocms';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.product) {
    notFound();
  }
  return (
    <div className="mx-auto max-w-[1480px]">
      <ProductView data={data} globalPageProps={globalPageProps} />
      <div className="mx-12 mt-8 sm:mx-24 lg:mx-64">
        <div className="text-gray-500">
          {data.product.description && (
            <StructuredText
              data={data.product.description}
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
                renderNodeRule(isListItem, ({ children, key }) => {
                  return (
                    <div
                      key={key}
                      className="whitespace-nowrap rounded-full bg-primary/80 px-4 py-2 text-center text-sm font-medium text-white"
                    >
                      <div>{children}</div>
                    </div>
                  );
                }),
                renderNodeRule(isList, ({ children, key }) => {
                  return (
                    <div
                      key={key}
                      className="-mb-4 flex flex-col items-center justify-center gap-4 py-8 md:mb-0 md:flex-row "
                    >
                      {children}
                    </div>
                  );
                }),
              ]}
            />
          )}
        </div>
      </div>
      <FeaturedProducts data={data} globalPageProps={globalPageProps} />
      <Reviews data={data} globalPageProps={globalPageProps} />
    </div>
  );
};

export default Content;
