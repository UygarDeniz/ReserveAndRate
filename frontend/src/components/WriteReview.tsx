import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useMutation } from '@tanstack/react-query';
import useProtectedAxios from '../hooks/useProtectedAxios';
import { useNavigate } from 'react-router';
type WriteReviewProps = {
  restaurant_id: number;
  reservation_id: number;
};
function WriteReview({ restaurant_id, reservation_id }: WriteReviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const protectedAxios = useProtectedAxios();
  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const { mutate } = useMutation({
    mutationKey: ['writeReview'],
    mutationFn: async () => {
      const res = await protectedAxios.post('/api/user-reviews/', {
        rating,
        comment,
        restaurant: restaurant_id,
        reservation: reservation_id,
      });
      return res.data;
    },
    onSuccess: () => {
      handleModal();
      navigate(0);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };
  return (
    <div>
      <button
        onClick={handleModal}
        className='px-4 py-1 text-white bg-red-500 rounded-2xl'
      >
        Write Review
      </button>
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50  '>
          <div className='bg-white p-4 rounded-lg w-3/4 lg:w-1/2 '>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-semibold'>Write Review</h2>
              <button onClick={handleModal}>
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type='button'
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star
                      className={cn('', {
                        'fill-yellow-500 text-yellow-500':
                          i < (hoverRating || rating),
                      })}
                    />
                  </button>
                ))}
              </div>
              <textarea
                className='w-full p-2 border border-gray-300 rounded-lg mt-4 '
                placeholder='Write your review here...'
                maxLength={255}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className='px-4 py-1 bg-red-500 text-white mt-4'>
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WriteReview;
