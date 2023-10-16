import {
  ProductModelDescriptionField,
  ProductQuery,
  ProductRecord,
  SiteLocale,
} from '@/graphql/generated';
import { notFound } from 'next/navigation';
import { StructuredText, renderNodeRule } from 'react-datocms';
import ProductView from './ProductView';
import { isHeading, isList, isListItem } from 'datocms-structured-text-utils';
import Reviews from './Reviews';
import FeaturedProducts from '../Grids/FeaturedProducts';

type Props = {
  data: ProductQuery;
  lng: SiteLocale;
};

const Product = ({ data, lng }: Props) => {
  if (!data.product) notFound();

  return (
    <div className="mt-16">
      <ProductView data={data} lng={lng} />
      <div className="mx-12 mt-8 sm:mx-24 lg:mx-64">
        <div className="text-gray-500">
          {data.product.description && (
            <StructuredText
              data={
                (data.product.description as ProductModelDescriptionField).value
              }
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
      <Reviews />
    </div>
  );
};

export default Product;
