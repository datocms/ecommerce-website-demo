import type { Product } from '@/app/[lng]/(site)/product/[slug]/meta';
import DemoActionButton from '@/components/Common/DemoActionButton';
import DatoStructuredText from '@/components/DatoStructuredText';
import { readFragment } from '@/lib/datocms/graphql';
import { type ProductPageLabels, ProductPageLabelsFragment } from './fragments';
import StarRating from './StarRating';

type Props = {
  product: Product;
  labels: ProductPageLabels;
  lng: string;
};

export default function Reviews({ product, labels, lng }: Props) {
  const { reviewButton, reviews, outOfFive } =
    readFragment(ProductPageLabelsFragment, labels) ?? {};

  const average = product.reviewAverage;
  const formattedAverage = new Intl.NumberFormat(lng, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(average);
  const dateFormatter = new Intl.DateTimeFormat(lng, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const featuredReviews = product.featuredReviews;

  return (
    <section id="reviews" className="shell pt-(--section-gap)">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6 border-b border-line pb-8">
        <div className="flex items-end gap-5">
          <p className="reveal mask text-[4rem] leading-[0.8] font-semibold tracking-[-0.05em] tabular-nums lg:text-[5rem]">
            {formattedAverage}
            <span className="sr-only"> {outOfFive}</span>
          </p>
          <div className="pb-0.5">
            <StarRating value={average} decorative />
            <h2 className="mt-2 text-md font-semibold">
              <span className="tabular-nums">{product.numberOfReviews}</span>{' '}
              {reviews}
            </h2>
          </div>
        </div>
        {reviewButton && (
          <DemoActionButton className="btn-line w-full sm:w-auto">
            {reviewButton}
          </DemoActionButton>
        )}
      </div>

      {featuredReviews.length > 0 && (
        <ul className="mt-8 grid gap-x-4 gap-y-10 md:grid-cols-2 lg:mt-10 lg:grid-cols-3">
          {featuredReviews.map((review) => {
            const formattedDate = dateFormatter.format(
              new Date(review.reviewDate),
            );

            return (
              <li key={review.id} className="flex flex-col lg:pr-10">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <StarRating
                    value={review.reviewScore}
                    outOfFive={outOfFive}
                  />
                  <time
                    dateTime={review.reviewDate}
                    className="text-sm text-mute"
                  >
                    {formattedDate}
                  </time>
                </div>
                <DatoStructuredText
                  data={review.review}
                  className="mt-4 text-lg leading-[1.45] font-medium tracking-[-0.01em] text-pretty [&_p+p]:mt-3"
                />
                <p className="mt-5 text-sm font-semibold">
                  {review.reviewerName}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
