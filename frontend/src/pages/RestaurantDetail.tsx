import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Banknote,
  CircleUser,
  Clock,
  LoaderCircle,
  MapPin,
} from 'lucide-react';
import { getRestaurantById } from '../api/getRestaurants';
import Reservation from '../components/Reservation';

const reviews = [
  {
    id: 1,
    user: 'John Doe',
    rating: 4,
    comment: 'Great food and service!',
  },
  {
    id: 2,
    user: 'Jane Doe',
    rating: 5,
    comment: 'Best restaurant in town!',
  },
];
export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  
  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurantById(id as string),
    enabled: !!id,
  });
  

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className='animate-spin' />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-red-500'>Error loading restaurant details.</p>
      </div>
    );
  }

  const scrollWithOffset = (section: string, offset = 132) => {
    const el = document.getElementById(section);
    if (!el) return;
    window.scrollTo({
      top: el.offsetTop - offset,
      behavior: 'smooth',
    });
  };

  return (
    <main className='flex justify-center w-full px-4 py-8'>
      <div className='max-w-screen-lg w-full'>
        <h1 className='text-3xl font-bold  mb-4 text-gray-700'>
          {restaurant.name}
        </h1>
        <img
          src={restaurant.image}
          alt={`${restaurant.name} image`}
          className='w-full h-96 object-cover rounded-2xl self-start'
        />

        <div className=' flex flex-col lg:flex-row w-full gap-x-6 mt-8'>
          <article className='w-full lg:w-2/3'>
            <nav className='w-full  bg-gray-100 rounded-2xl py-4 sticky top-16 z-10'>
              {[
                'Overview',
                'Description',
                'Highlights',
                'Cuisines',
                'Reviews',
              ].map((section) => (
                <button
                  key={section}
                  onClick={() =>
                    scrollWithOffset(`restaurant-${section.toLowerCase()}`)
                  }
                  className='px-4 py-2 text-sm font-medium hover:text-red-500 hover:underline underline-offset-[12px] decoration-[3px]'
                >
                  {section}
                </button>
              ))}
              <button onClick={() => scrollWithOffset('reservation')} className='bg-red-500 rounded-2xl  text-white py-1 px-6 lg:hidden'>
                Reservation
              </button>
            </nav>
            <section
              id='restaurant-overview'
              className='mt-8 flex items-center justify-between flex-wrap'
            >
              <div className='flex items-start space-x-4 w-1/3 mb-8'>
                <MapPin className='mt-1' color='#ffffff' fill='#000000' />
                <div>
                  <p className='font-semibold text-gray-700'>Location</p>
                  <p className='text-gray-600 text-sm'>{restaurant.city}</p>
                </div>
              </div>
              <div className='flex items-start space-x-4 w-1/3 mb-8'>
                <Clock fill='000000' color='#ffffff' className='mt-1' />
                <div>
                  <p className='font-semibold text-gray-700 w-1/3'>Duration</p>
                  <p className='text-gray-600 text-sm'>
                    {restaurant.max_dinning_time} hours
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-4 w-1/3 mb-8'>
                <CircleUser color='#ffffff' fill='#000000' className='mt-1' />
                <div>
                  <p className='font-semibold text-gray-700'>
                    Number of Guests
                  </p>
                  <p className='text-gray-600 text-sm'>
                    {restaurant.min_number_of_guests} -{' '}
                    {restaurant.max_number_of_guests} guests
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-4 w-1/3 mb-8'>
                <Banknote color='#ffffff' fill='#000000' className='mt-1' />
                <div>
                  <p className='font-semibold text-gray-700'>
                    Price Starts From
                  </p>
                  <p className='text-gray-600 text-sm'>
                    {restaurant.price_start_from} $
                  </p>
                </div>
              </div>
            </section>

            <section id='restaurant-description' className='mt-8'>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                Restaurant Details
              </h2>
              <p className='text-gray-600 whitespace-pre-line'>
                {restaurant.description}
              </p>
            </section>
            <section id='restaurant-highlights' className='mt-8'>
              {restaurant?.highlights && restaurant.highlights.length > 0 ? (
                <div>
                  <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                    Highlights
                  </h2>
                  <ul className='list-disc text-gray-600 pl-4'>
                    {restaurant.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className='text-sm text-gray-500'>
                  No highlights available.
                </p>
              )}
            </section>

            <section id='restaurant-cuisines' className='mt-8'>
              <h2 className='text-xl font-semibold mb-2'>Cuisines</h2>
              {restaurant.cuisines.map((cuisine) => (
                <div
                  key={cuisine.id}
                  className='bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm mr-2 inline'
                >
                  {cuisine.name}
                </div>
              ))}
            </section>
            <section
              id='restaurant-reviews'
              className='mt-8 bg-gray-200 px-4 py-6 rounded-2xl'
            >
              <h2 className='text-xl font-bold mb-2 text-gray-700'>Reviews</h2>
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className='mb-4 border-b pb-2'>
                    <p className='font-semibold'>{review.user}</p>
                    <p className='text-sm text-gray-600'>
                      Rating: {review.rating}
                    </p>
                    <p className='text-gray-700'>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className='text-sm text-gray-500'>No reviews available.</p>
              )}
            </section>
          </article>
          <div className='flex justify-center  lg:w-1/3 lg:max-h-96 lg:sticky lg:top-16' id='reservation'>
            {<Reservation  restaurantId={id as string}/>}
          </div>
        </div>
      </div>
    </main>
  );
}
