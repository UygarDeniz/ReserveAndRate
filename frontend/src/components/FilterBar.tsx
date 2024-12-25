import React from 'react';
import { useSearchParams } from 'react-router';

type FilterBarProps = {
  availableCities: { id: number; name: string }[];
  availableCuisines: { id: number; name: string }[];
  currentCity: string;
  currentCuisine: string;
};

export default function FilterBar({
  availableCities,
  availableCuisines,
  currentCity,
  currentCuisine,
}: FilterBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    searchParams.set('page', '1');
    if (newCity) {
      searchParams.set('city', newCity);
    } else {
      searchParams.delete('city');
    }
    setSearchParams(searchParams);
  };

  const handleCuisineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCuisine = e.target.value;
    searchParams.set('page', '1');

    if (newCuisine) {
      searchParams.set('cuisine', newCuisine);
    } else {
      searchParams.delete('cuisine');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className='flex justify-between w-full items-center space-x-4'>
      <div className='flex flex-col'>
        <label htmlFor='city' className='text-sm font-bold mb-1'>
          City
        </label>
        <select
          id='city'
          name='city'
          value={currentCity}
          onChange={handleCityChange}
          className='border border-gray-300 rounded-md p-1'
        >
          <option value=''>All Cities</option>
          {availableCities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className='flex flex-col'>
        <label htmlFor='cuisine' className='text-sm font-bold mb-1'>
          Cuisine
        </label>
        <select
          id='cuisine'
          name='cuisine'
          value={currentCuisine}
          onChange={handleCuisineChange}
          className='border border-gray-300 rounded-md p-1'
        >
          <option value=''>All Cuisines</option>
          {availableCuisines.map((cuisine) => (
            <option key={cuisine.id} value={cuisine.name}>
              {cuisine.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
