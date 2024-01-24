import {
  FeaturedReviewRecord,
  GeneralInterfaceRecord,
  MaterialRecord,
  ProductFeatureSectionRecord,
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
                        interfaceStrings={
                          data.generalInterface as GeneralInterfaceRecord
                        }
                        lng={lng}
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
                      className="rounded-full bg-primary/80 px-4 py-2 text-sm font-medium text-white whitespace-nowrap text-center"
                    >
                      <div>{children}</div>
                    </div>
                  );
                }),
                renderNodeRule(isList, ({ children, key }) => {
                  return (
                    <div key={key} className="justify-center -mb-4 md:mb-0 gap-4 py-8 flex items-center md:flex-row flex-col ">
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
        sale={data.generalInterface?.sale}
        currencySymbol={data.generalInterface?.currencySymbol}
      />
      <Reviews
        reviews={data.product.featuredReviews as Array<FeaturedReviewRecord>}
        reviewNumber={data.product.numberOfReviews}
        reviewAverage={data.product.reviewAverage}
        reviewsString={data.generalInterface?.reviews}
        reviewButton={data.generalInterface?.reviewButton}
        lng={lng}
      />
    </div>
  );
};

export default Product;
