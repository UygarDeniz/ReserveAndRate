import { Link, useLocation, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '../api/getRestaurants';
import RestaurantCard from '../components/RestaurantCard';
import PaginationButtons from '../components/PaginationButtons';
import { LoaderCircle } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import getCities from '../api/getCities';
import getCuisines from '../api/getCusines';
import { cn } from '../lib/utils';

function Restaurants() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isRestaurantPage = location.pathname === '/restaurants';

  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') || 1;
  const city = searchParams.get('city') || '';
  const cuisine = searchParams.get('cuisine') || '';

  const {
    data: restaurants,
    isPending: isPendingRestaurants,
    error: errorRestaurants,
  } = useQuery({
    queryKey: ['restaurants', { q, page, city, cuisine }],
    queryFn: () => getRestaurants({ q, page: Number(page), city, cuisine }),
  });

  const {
    data: availableCities,
    isPending: isPendingCities,
    error: errorCities,
  } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const {
    data: availableCuisines,
    isPending: isPendingCusines,
    error: errorCuisines,
  } = useQuery({
    queryKey: ['cuisines'],
    queryFn: getCuisines,
  });

  const isPending = isPendingRestaurants || isPendingCities || isPendingCusines;
  const error = errorRestaurants || errorCities || errorCuisines;

  if (isPending) {
    return (
      <div
        className={cn(
          'flex justify-center items-center h-screen animate-spin',
          {
            'fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 z-10':
              isRestaurantPage,
          }
        )}
      >
        <LoaderCircle />
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
      <div className='max-w-screen-lg w-full min-h-[90vh]'>
        <h1 className='text-4xl font-bold  self-start mb-8'>Restaurants</h1>
        <FilterBar
          availableCities={availableCities}
          availableCuisines={availableCuisines}
          currentCity={city}
          currentCuisine={cuisine}
        />
        {restaurants?.results && restaurants.results.length > 0 ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 break-all h-full mt-4'>
              {restaurants.results.map((restaurant) => (
                <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Link>
              ))}
            </div>
            <div className='flex justify-center mt-8'>
              <PaginationButtons
                totalPages={Math.ceil(restaurants.count / 2)}
                nextPage={restaurants.next}
                prevPage={restaurants.previous}
              />
            </div>
          </>
        ) : (
          <p className='text-center font-bold mt-12  text-3xl text-gray-700'>
            No restaurants found
          </p>
        )}
      </div>
    </div>
  );
}

export default Restaurants;
