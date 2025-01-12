import { format } from 'date-fns';
import { Star, User } from 'lucide-react';
import { InfiniteData } from '@tanstack/react-query';
import { Review } from '../types/review';

type ReviewsListProps = {
  reviews: InfiniteData<{ results: Review[] }>;
  avarageRating: number;
  totalReviews: number;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
};

export function ReviewsList({
  reviews,
  avarageRating,
  totalReviews,
  hasNextPage,
  fetchNextPage,
}: ReviewsListProps) {
  if (!reviews) return null;
  return (
    <div className='flex flex-col'>
      <h2 className='text-md font-semibold'>Overall Rating: </h2>
      <div className='flex items-center mb-6'>
        {[...Array(5)].map((_, i) => (
          <Star
            size={20}
            key={i}
            className={
              avarageRating > i ? 'fill-yellow-500 text-yellow-500' : ''
            }
          />
        ))}
        <span className='text-gray-600 ml-2'>({totalReviews})</span>
      </div>
      {reviews.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.results.map((review) => (
            <article key={review.id} className='flex items-start mb-10'>
              <div className='bg-white p-2 rounded-full mr-6 mt-1'>
                <User color='#ef4444' size={30} fill='#ef4444' />
              </div>
              <div className='flex flex-col'>
                <div className='font-semibold'>{review.user}</div>
                <p className='text-sm text-gray-600'>
                  {format(new Date(review.created_at), 'MMMM d, yyyy h:mm a')}
                </p>
                <div className='flex '>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      size={20}
                      key={i}
                      className={
                        review.rating > i
                          ? 'fill-yellow-500 text-yellow-500'
                          : ''
                      }
                    />
                  ))}
                </div>
                <p className='text-gray-700 break-all'>{review.comment}</p>
              </div>
            </article>
          ))}
        </div>
      ))}
      {hasNextPage && (
        <button
          onClick={fetchNextPage}
          className='bg-red-500 text-white px-4 py-2 rounded-2xl'
        >
          Load More
        </button>
      )}
    </div>
  );
}
