import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useProtectedAxios from '../hooks/useProtectedAxios';
import { Review } from '../types/review';
import { LoaderCircle, Star } from 'lucide-react';
import { useSearchParams } from 'react-router';
import PaginationButtons from './PaginationButtons';
import { PAGE_SIZE } from '../lib/constants';
type ExtendedReview = Review & { restaurant_name: string };
type ReviewResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExtendedReview[];
};
function UserReviews() {
  const protectedAxios = useProtectedAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const { data, isPending } = useQuery({
    queryKey: ['user-reviews', page],
    queryFn: async (): Promise<ReviewResponse> => {
      const res = await protectedAxios.get('/api/user-reviews/', {
        params: { page },
      });
      return res.data;
    },
  });
  const { mutate: deleteReview } = useMutation({
    mutationKey: ['deleteReview'],
    mutationFn: async (id: number) => {
      const res = await protectedAxios.delete(`/api/user-reviews/${id}/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
    },
  });

  if (isPending) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <LoaderCircle size={64} className='text-yellow-500 animate-spin' />
      </div>
    );
  }

  return (
    <div className='max-w-screen-lg mx-auto mt-8 '>
      <h1 className='text-xl font-semibold mb-4'>Your Reviews</h1>

      {data && data.results.length > 0 ? (
        <div>
          {data.results.map((review) => (
            <div
              key={review.id}
              className='border-b border-gray-200 py-4 mb-10'
            >
              <div className='flex items-center justify-between'>
                <h2 className='font-semibold'>{review.restaurant_name}</h2>
                <button
                  className='text-red-500 px-4 py-1 border border-red-500 hover:bg-red-500 hover:text-white ease-in-out duration-300 rounded-xl'
                  onClick={() => deleteReview(review.id)}
                >
                  Delete
                </button>
              </div>
              <p className='text-sm text-gray-600'>
                {new Date(review.created_at).toLocaleDateString()}
              </p>
              <div className='flex '>
                {[...Array(5)].map((_, i) => (
                  <Star
                    size={20}
                    key={i}
                    className={
                      review.rating > i ? 'fill-yellow-500 text-yellow-500' : ''
                    }
                  />
                ))}
              </div>
              <p className='break-all'>{review.comment}</p>
            </div>
          ))}
          <PaginationButtons
            totalPages={Math.ceil(data.count / PAGE_SIZE)}
            nextPage={data.next}
            prevPage={data.previous}
          />
        </div>
      ) : (
        <p>You have no reviews.</p>
      )}
    </div>
  );
}

export default UserReviews;
