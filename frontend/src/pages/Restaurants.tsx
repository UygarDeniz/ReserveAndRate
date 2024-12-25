import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '../api/getRestaurants';
import RestaurantCard from '../components/RestaurantCard';

function Restaurants() {
  const [searchParams] = useSearchParams();

  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') || 1;

  const {
    data: restaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['restaurants', { q, page }],
    queryFn: () => getRestaurants({ q, page: Number(page) }),
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center w-full px-4 py-8'>
      <h1 className='text-4xl font-bold text-center mb-8'>Restaurants</h1>
      {restaurants?.results && restaurants.results?.length > 0 ? (
        <div className='max-w-screen-lg'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 break-all h-full'>
            {restaurants.results?.map((restaurant) => (
              <RestaurantCard restaurant={restaurant} />
            ))}
          </div>
        </div>
      ) : (
        <p className='text-center text-gray-700'>No restaurants found</p>
      )}
    </div>
  );
}

export default Restaurants;
