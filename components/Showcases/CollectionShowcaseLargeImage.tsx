import {
  ProductRecord,
  ResponsiveImage,
  SiteLocale,
} from '@/graphql/generated';
import { Image as DatoImage } from 'react-datocms';

type PropTypes = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonURL: string;
  products: ProductRecord[];
  lng: SiteLocale;
};

export default function CollectionShowcaseLargeImage({
  title,
  subtitle,
  buttonLabel,
  buttonURL,
  products,
  lng,
}: PropTypes) {
  return (
    <div className="bg-gray-100 max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg">
                  <DatoImage
                    data={
                      product.productImages[0]
                        .responsiveImage as ResponsiveImage
                    }
                    className="h-full w-full object-cover object-center"
                    objectFit="cover"
                    objectPosition="50% 50%"
                  />
                </div>
                <h3 className="mt-6 text-sm text-gray-500">
                  <a href={`/${lng}/products/${product.slug}`}>
                    <span className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  ${product.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
