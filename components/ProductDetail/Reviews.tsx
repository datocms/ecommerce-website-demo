import ReactMarkdown from 'react-markdown';
import type { Query as ProductQuery } from '@/app/[lng]/product/[slug]/meta';
import { readFragment } from '@/lib/datocms/graphql';
import { type ProductPageLabels, ProductPageLabelsFragment } from './fragments';
import StarRating from './StarRating';

type Props = {
  product: NonNullable<ProductQuery['product']>;
  labels: ProductPageLabels;
  lng: string;
};

export default function Reviews({ product, labels, lng }: Props) {
  const { reviewButton, reviews } =
    readFragment(ProductPageLabelsFragment, labels) ?? {};

  const average = product.reviewAverage ?? 0;
  const formattedAverage = new Intl.NumberFormat(lng, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(average);
  const dateFormatter = new Intl.DateTimeFormat(lng, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const featuredReviews = product.featuredReviews ?? [];

  // A compact summary bar (score, stars, count and the button on one ruled line), then the
  // reviews in columns like the testimonials
  return (
    <section id="reviews" className="shell pt-(--section-gap)">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6 border-b border-line pb-8">
        <div className="flex items-end gap-5">
          <p className="reveal mask text-[4rem] leading-[0.8] font-semibold tracking-[-0.05em] tabular-nums lg:text-[5rem]">
            {formattedAverage}
            <span className="sr-only"> out of 5</span>
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
          <button type="button" className="btn-line w-full sm:w-auto">
            {reviewButton}
          </button>
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
                  <StarRating value={review.reviewScore} />
                  <time
                    dateTime={review.reviewDate}
                    className="text-sm text-mute"
                  >
                    {formattedDate}
                  </time>
                </div>
                <div className="mt-4 text-lg leading-[1.45] font-medium tracking-[-0.01em] text-pretty [&_p+p]:mt-3">
                  <ReactMarkdown>{review.review || ''}</ReactMarkdown>
                </div>
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
