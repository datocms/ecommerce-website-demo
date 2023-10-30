import {
  FeaturedReviewRecord,
  Maybe,
  ProductQuery,
  SiteLocale,
} from '@/graphql/generated';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Image as DatoImage, ResponsiveImageType } from 'react-datocms';

type PropTypes = {
  reviews: Array<FeaturedReviewRecord>;
  reviewNumber: number;
  reviewAverage: number;
};

import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';

interface StarRatingProps {
  rating: number;
}

const StarRating: FC<StarRatingProps> = ({ rating }) => {
  const filledStars = Array.from({ length: Math.round(rating) });
  const emptyStars = Array.from({ length: 5 - Math.round(rating) });

  return (
    <div className="flex">
      {filledStars.map((_, index) => (
        <svg
          key={`filled-star-${index}`}
          xmlns="http://www.w3.org/2000/svg"
          className="text-yellow-400 h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {emptyStars.map((_, index) => (
        <svg
          key={`empty-star-${index}`}
          xmlns="http://www.w3.org/2000/svg"
          className="text-yellow-400 h-5 w-5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Reviews = ({ reviews, reviewNumber, reviewAverage }: PropTypes) => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-md px-4 md:px-8">
        <div className="mb-4 flex items-center justify-between border-b border-t py-4">
          <div className="flex items-center gap-2">
            <div className="-ml-1 flex gap-0.5 text-primary">
              <div className="flex h-7 items-center gap-1 rounded-full bg-primary/90 px-2 text-white">
                <span className="text-sm">{reviewAverage}</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            <span className="block text-sm text-gray-500">
              Based on {reviewNumber} reviews
            </span>
          </div>

          <a
            href="#"
            className="inline-block rounded-lg border bg-white px-4 py-2 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base"
          >
            Write a review
          </a>
        </div>

        <div className="divide-y">
          {reviews.map((review) => {
            const date = new Date(review.reviewDate);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(date);

            return (
              <div key={review.id} className="flex flex-col gap-3 py-4 md:py-8">
                <div>
                  <span className="block text-sm font-bold">
                    {review.reviewerName}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {formattedDate}
                  </span>
                </div>

                <div className="-ml-1 flex gap-0.5 text-primary">
                  <StarRating rating={review.reviewScore} />
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
