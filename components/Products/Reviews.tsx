/**
 * Product reviews block showing average rating, count, and a
 * few featured reviews. Adds inline edit attributes for fields.
 */
import { getFragmentData } from '@/graphql/types';
import {
  ProductGeneralInterfaceFragmentDoc,
  type ProductQuery,
} from '@/graphql/types/graphql';
import { getProductFieldEditAttributes } from '@/utils/datocmsVisualEditing';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PropTypes = {
  /** Product query payload with reviews. */
  data: ProductQuery;
  /** Locale-aware page props. */
  globalPageProps: GlobalPageProps;
};

import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';

interface StarRatingProps {
  /** Rating value used to fill stars (rounded). */
  rating: number;
  /** Optional edit attributes wrapper for inline editing. */
  editAttributes?: Record<string, string>;
}

const StarRating: FC<StarRatingProps> = ({ rating, editAttributes }) => {
  const filledKeys = Array.from(
    { length: Math.round(rating) },
    (_v, i) => `filled-${i}`,
  );
  const emptyKeys = Array.from(
    { length: 5 - Math.round(rating) },
    (_v, i) => `empty-${i}`,
  );
  const editTagProps = editAttributes
    ? { ...editAttributes, 'data-datocms-edit-target': '' }
    : {};

  return (
    <div className="flex" {...editTagProps}>
      {filledKeys.map((k) => (
        <svg
          key={k}
          xmlns="http://www.w3.org/2000/svg"
          className="text-yellow-400 h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <title>Star</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {emptyKeys.map((k) => (
        <svg
          key={k}
          xmlns="http://www.w3.org/2000/svg"
          className="text-yellow-400 h-5 w-5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <title>Star</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

/** Render the review header and a list of featured reviews. */
const Reviews = ({ data, globalPageProps }: PropTypes) => {
  const general = getFragmentData(
    ProductGeneralInterfaceFragmentDoc,
    data.generalInterface ?? null,
  );
  const reviewButton = general?.reviewButton;
  const reviews = general?.reviews;
  const locale = globalPageProps.params.lng;
  const productEditingUrl = (data.product as { _editingUrl?: string | null })
    ?._editingUrl;
  const reviewAverageEditAttributes = getProductFieldEditAttributes(
    productEditingUrl,
    locale,
    'review_average',
  );
  const numberOfReviewsEditAttributes = getProductFieldEditAttributes(
    productEditingUrl,
    locale,
    'number_of_reviews',
  );

  return (
    <div className="bg-white py-6 text-center sm:py-8 md:text-start lg:py-12">
      <div className="mx-auto max-w-screen-md px-4 md:px-8">
        <div className="mb-4 flex items-center justify-around border-b border-t py-4 md:justify-between">
          <div className="flex items-center gap-2">
            <div className="-ml-1 flex gap-0.5 text-primary">
              <div className="flex h-7 items-center gap-1 rounded-full bg-primary/90 px-2 text-white">
                <span
                  className="text-sm"
                  {...reviewAverageEditAttributes}
                  data-datocms-edit-target
                >
                  {data.product?.reviewAverage}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>Star</title>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            <span className="block text-sm text-gray-500">
              <span {...numberOfReviewsEditAttributes} data-datocms-edit-target>
                {data.product?.numberOfReviews}
              </span>{' '}
              {reviews}
            </span>
          </div>

          <button
            type="button"
            className="inline-block rounded-lg border bg-white px-4 py-2 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base"
          >
            {reviewButton}
          </button>
        </div>

        <div className="divide-y">
          {data.product?.featuredReviews.map((review, index) => {
            const date = new Date(review.reviewDate);
            const formattedDate = new Intl.DateTimeFormat(
              globalPageProps.params.lng,
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            ).format(date);
            const reviewScoreEditAttributes = getProductFieldEditAttributes(
              productEditingUrl,
              locale,
              ['featured_reviews', index.toString(), 'review_score'],
            );
            const reviewDateEditAttributes = getProductFieldEditAttributes(
              productEditingUrl,
              locale,
              ['featured_reviews', index.toString(), 'review_date'],
            );

            return (
              <div
                key={review.id}
                className="flex flex-col items-center justify-center gap-3 py-4 md:items-start md:justify-start md:py-8"
              >
                <div>
                  <span className="block text-sm font-bold">
                    {review.reviewerName}
                  </span>
                  <span
                    className="block text-sm text-gray-500"
                    {...reviewDateEditAttributes}
                    data-datocms-edit-target
                  >
                    {formattedDate}
                  </span>
                </div>

                <div className="-ml-1 flex gap-0.5 text-primary">
                  <StarRating
                    rating={review.reviewScore}
                    editAttributes={reviewScoreEditAttributes}
                  />
                </div>

                <div className="text-gray-600">
                  <ReactMarkdown>{review.review || ''}</ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
