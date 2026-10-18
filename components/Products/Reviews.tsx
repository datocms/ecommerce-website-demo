import ReactMarkdown from 'react-markdown';
import type { Query as ProductQuery } from '@/app/[lng]/product/[slug]/meta';
import StarRating from '@/components/Common/StarRating';
import { ProductGeneralInterfaceFragment } from '@/components/Products/Product/GeneralInferface/fragments';
import { PDP_RAIL } from '@/components/Products/Product/ui';
import { readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

type PropTypes = {
  data: ProductQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

const Reviews = ({ data, globalPageProps }: PropTypes) => {
  const { reviewButton, reviews } =
    readFragment(ProductGeneralInterfaceFragment, data.generalInterface) ?? {};

  const average = data.product?.reviewAverage ?? 0;
  const formattedAverage = new Intl.NumberFormat(globalPageProps.params.lng, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(average);
  const featuredReviews = data.product?.featuredReviews ?? [];

  // The summary sticks on the left while the reviews scroll on the buy box's line
  return (
    <section
      id="reviews"
      className="shell grid gap-10 pt-(--section-gap) lg:grid-cols-12 lg:gap-4"
    >
      <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-6 lg:self-start">
        <div className="flex items-end gap-6 lg:block">
          <p className="text-[5.5rem] leading-[0.8] font-semibold tracking-[-0.05em] tabular-nums lg:text-[7rem]">
            {formattedAverage}
            <span className="sr-only"> out of 5</span>
          </p>
          <div className="pb-1 lg:mt-6 lg:pb-0">
            <StarRating value={average} size={20} decorative />
            <h2 className="mt-2 text-md font-semibold">
              <span className="tabular-nums">
                {data.product?.numberOfReviews}
              </span>{' '}
              {reviews}
            </h2>
          </div>
        </div>
        {reviewButton && (
          <button type="button" className="btn-line mt-8 w-full sm:w-auto">
            {reviewButton}
          </button>
        )}
      </div>

      {featuredReviews.length > 0 && (
        <ul className={PDP_RAIL}>
          {featuredReviews.map((review) => {
            const date = new Date(review.reviewDate);
            const formattedDate = new Intl.DateTimeFormat(
              globalPageProps.params.lng,
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            ).format(date);

            return (
              <li
                key={review.id}
                className="border-t border-line py-8 first:border-t-0 first:pt-0 last:pb-0 lg:py-10"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <StarRating value={review.reviewScore} size={16} />
                  <time
                    dateTime={review.reviewDate}
                    className="text-sm text-mute"
                  >
                    {formattedDate}
                  </time>
                </div>
                <div className="mt-5 text-xl leading-[1.4] font-medium tracking-[-0.015em] text-pretty lg:text-2xl lg:leading-[1.4] [&_p+p]:mt-3">
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
};

export default Reviews;
