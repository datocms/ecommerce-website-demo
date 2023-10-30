import {
  FeaturedQuestionsSectionRecord,
  FeaturedReviewRecord,
  MaterialRecord,
  ProductFeatureSectionRecord,
  ProductModelDescriptionField,
  ProductQuery,
  ProductQuestionRecord,
  ProductRecord,
  SiteLocale,
} from '@/graphql/generated';
import { notFound } from 'next/navigation';
import { StructuredText, renderNodeRule } from 'react-datocms';
import ProductView from './ProductView';
import { isHeading, isList, isListItem } from 'datocms-structured-text-utils';
import Reviews from './Reviews';
import FeaturedProducts from '../Grids/FeaturedProducts';
import QuestionsSection from './QuestionsSection';
import ProductInfoSection from './ProductInfoSection';
import { Maybe } from 'graphql/jsutils/Maybe';

type Props = {
  data: ProductQuery;
  lng: SiteLocale;
};

const Product = ({ data, lng }: Props) => {
  if (!data.product) notFound();

  return (
    <div className="mx-auto max-w-[1480px]">
      <ProductView data={data} lng={lng} />
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
                        material={data.product!.material as MaterialRecord}
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
                    return <></>;
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
                      className="mb-5 flex items-center text-lg font-medium text-body-color"
                    >
                      <div>{children}</div>
                    </div>
                  );
                }),
                renderNodeRule(isList, ({ children, key }) => {
                  return (
                    <div
                      key={key}
                      className="mb-6 mt-6 grid w-full grid-cols-2 items-center justify-center gap-4 text-center lg:ml-0"
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
        lng={lng}
      />
      <Reviews
        reviews={data.product.featuredReviews as Array<FeaturedReviewRecord>}
        reviewNumber={data.product.numberOfReviews}
        reviewAverage={data.product.reviewAverage}
      />
    </div>
  );
};

export default Product;
