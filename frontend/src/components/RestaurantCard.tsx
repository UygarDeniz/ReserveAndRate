import { Star } from 'lucide-react';
import { Restaurant } from '../types/restaurant';

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div key={restaurant.id} className='flex flex-col h-full'>
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className='w-full h-48 object-cover shadow-md rounded-2xl'
      />
      <div className='flex flex-col p-4 flex-grow'>
        <p className='text-gray-500 mb-2  font-bold'>{restaurant.city.name}</p>
        <h2 className='text-lg font-bold mb-2 text-gray-600'>
          {restaurant.name}
        </h2>
        <p className='text-gray-500 mb-2 text-sm  flex-grow'>
          {restaurant.summary}
        </p>
        <div className='h-16'>
          <div className='text-gray-700 mb-2'>
            <strong>Cuisines:</strong>{' '}
            {restaurant.cuisines.map((cuisine) => cuisine.name).join(', ')}
            <p className='text-gray-700 mb-2'>
              <div className='flex items-center mb-6'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    size={20}
                    key={i}
                    className={
                      restaurant.average_rating > i ? 'fill-yellow-500 text-yellow-500' : ''
                    }
                  />
                ))}
                <span className='text-gray-600 ml-2'>({restaurant.total_reviews})</span>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
