import { Restaurant } from '../types/restaurant'
function RestaurantCard({ restaurant } : { restaurant: Restaurant }) {
  return (
    <div key={restaurant.id} className='flex flex-col h-full'>
    <img
      src={restaurant.image}
      alt={restaurant.name}
      className='w-full h-48 object-cover shadow-md rounded-2xl'
    />
    <div className='flex flex-col p-4 flex-grow'>
      <p className='text-gray-500 mb-2  font-bold'>
        {restaurant.city}
      </p>
      <h2 className='text-lg font-bold mb-2 text-gray-600'>
        {restaurant.name}
      </h2>
      <p className='text-gray-500 mb-2 text-sm  flex-grow'>
        {restaurant.summary}
      </p>
      <div className='h-16'>
        <div className='text-gray-700 mb-2'>
          <strong>Cuisines:</strong>{' '}
          {restaurant.cuisines
            .map((cuisine) => cuisine.name)
            .join(', ')}
          <p className='text-gray-700 mb-2'>
            {restaurant.average_rating || 0} 
          </p>
        </div>
      </div>
    </div>
  </div>
)
}

export default RestaurantCard