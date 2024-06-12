import FeaturedProducts from '@/components/Grids/FeaturedProducts';
import ProductInfoSection from '@/components/Products/ProductInfoSection';
import ProductView from '@/components/Products/ProductView';
import QuestionsSection from '@/components/Products/QuestionsSection';
import Reviews from '@/components/Products/Reviews';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type {
  FeaturedReviewRecord,
  GeneralInterfaceRecord,
  MaterialRecord,
  ProductFeatureSectionRecord,
  ProductQuestionRecord,
  ProductRecord,
} from '@/graphql/types/graphql';
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
              data={data.product.description as any}
              renderBlock={({ record }) => {
                switch (record._modelApiKey) {
                  case 'product_feature_section':
                    return (
                      <ProductInfoSection
                        features={record as ProductFeatureSectionRecord}
                        material={data.product?.material as MaterialRecord}
                        interfaceStrings={
                          data.generalInterface as GeneralInterfaceRecord
                        }
                        globalPageProps={globalPageProps}
                      />
                    );
                  case 'featured_questions_section':
                    return (
                      <QuestionsSection
                        questions={
                          record.questions as Array<ProductQuestionRecord>
                        }
                      />
                    );
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
      <FeaturedProducts
        products={data.product.relatedProducts as ProductRecord[]}
        globalPageProps={globalPageProps}
        sale={data.generalInterface?.sale}
        currencySymbol={data.generalInterface?.currencySymbol}
      />
      <Reviews
        reviews={data.product.featuredReviews as Array<FeaturedReviewRecord>}
        reviewNumber={data.product.numberOfReviews}
        reviewAverage={data.product.reviewAverage}
        reviewsString={data.generalInterface?.reviews}
        reviewButton={data.generalInterface?.reviewButton}
        globalPageProps={globalPageProps}
      />
    </div>
  );
};

export default Content;
