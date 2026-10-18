import { stripStega } from '@datocms/content-link';
import ReactMarkdown from 'react-markdown';
import type { Query as ProductQuery } from '@/app/[lng]/product/[slug]/meta';
import StarRating from '@/components/Common/StarRating';
import { ProductGeneralInterfaceFragment } from '@/components/Products/Product/GeneralInferface/fragments';
import { readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

type PropTypes = {
  data: ProductQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

const initialsOf = (name: string) =>
  stripStega(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

const Reviews = ({ data, globalPageProps }: PropTypes) => {
  const { reviewButton, reviews } =
    readFragment(ProductGeneralInterfaceFragment, data.generalInterface) ?? {};

  const average = data.product?.reviewAverage ?? 0;
  const formattedAverage = new Intl.NumberFormat(globalPageProps.params.lng, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(average);
  const featuredReviews = data.product?.featuredReviews ?? [];

  return (
    <section
      id="reviews"
      className="shell grid gap-3 pt-(--section-gap) sm:gap-4 lg:grid-cols-12 lg:gap-5"
    >
      <div className="flex flex-col gap-7 rounded-card bg-white p-(--card-pad) sm:flex-row sm:items-end sm:justify-between lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:col-span-4 lg:block lg:self-start lg:p-(--panel-pad)">
        <div className="flex items-end gap-5 lg:block">
          <p className="font-display text-[5.5rem] leading-[0.8] font-semibold tracking-[-0.03em] tabular-nums lg:text-[7rem]">
            {formattedAverage}
            <span className="sr-only"> out of 5</span>
          </p>
          <div className="pb-1 lg:pb-0">
            <StarRating
              value={average}
              size={20}
              decorative
              className="lg:mt-6"
            />
            <h2 className="mt-2 text-md font-semibold text-muted lg:mt-3">
              {data.product?.numberOfReviews} {reviews}
            </h2>
          </div>
        </div>
        {reviewButton && (
          <button
            type="button"
            className="btn-secondary w-full sm:w-auto lg:mt-8"
          >
            {reviewButton}
          </button>
        )}
      </div>

      {featuredReviews.length > 0 && (
        <ul className="grid gap-3 sm:gap-4 lg:col-span-8 lg:gap-5">
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
                className="flex flex-col rounded-card bg-white p-(--card-pad)"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <StarRating value={review.reviewScore} size={16} />
                  <time
                    dateTime={review.reviewDate}
                    className="text-sm font-semibold text-muted"
                  >
                    {formattedDate}
                  </time>
                </div>
                <div className="mt-5 font-display text-[1.3125rem] leading-[1.3] font-medium tracking-[-0.012em] text-pretty sm:text-2xl sm:leading-[1.3] [&_p+p]:mt-3">
                  <ReactMarkdown>{review.review || ''}</ReactMarkdown>
                </div>
                <p className="mt-7 flex items-center gap-3 text-md font-bold">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-cream font-display text-sm font-bold"
                  >
                    {initialsOf(review.reviewerName)}
                  </span>
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
