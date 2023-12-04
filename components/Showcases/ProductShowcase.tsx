import {
  ProductRecord,
  ResponsiveImage,
  SiteLocale,
} from '@/graphql/generated';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Image as DatoImage } from 'react-datocms';

type PropTypes = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonURL: string;
  products: ProductRecord[];
  lng: SiteLocale;
};

const ProductShowcase = ({
  title,
  subtitle,
  buttonLabel,
  buttonURL,
  products,
  lng,
}: PropTypes) => {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8  mx-auto">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <div className="grid place-content-center rounded bg-primary/20 p-6 sm:p-8">
            <div className="mx-auto max-w-md text-center lg:text-left">
              <header>
                <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                  {title}
                </h2>

                <div className="mt-4 text-gray-500">
                  <ReactMarkdown>{subtitle || ''}</ReactMarkdown>
                </div>
              </header>

              <Link
                href={buttonURL}
                className="mt-8 inline-block rounded border border-gray-900 bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
              >
                {buttonLabel}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 lg:py-8">
            <ul className="grid grid-cols-2 gap-4">
              {products.map((product) => {
                return (
                  <li key={product.id}>
                    <Link
                      href={`/${lng}/products/${product.slug}`}
                      className="group block"
                    >
                      <div className="aspect-square relative h-96 w-full rounded object-cover">
                        <DatoImage
                          data={
                            product.productImages[0]
                              .responsiveImage as ResponsiveImage
                          }
                          className="h-full w-full object-cover object-center"
                          objectFit="cover"
                          objectPosition="40% 60%"
                        />
                      </div>
                      <div className="mt-3">
                        <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-700">
                          ${product.price}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
