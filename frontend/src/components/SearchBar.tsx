import { Search } from 'lucide-react';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useLocation } from 'react-router';
import { cn } from '../lib/utils';
import * as z from 'zod';

const SearchBarSchema = z.object({
  search: z.string().trim().nonempty(),
});
function SearchBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search');
    try {
      SearchBarSchema.parse({ search });
      searchParams.set('q', search as string);
      navigate(`/restaurants?${searchParams.toString()}`);
    } catch {
      navigate(`/restaurants`);
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className={cn('flex items-center  px-2  space-x-2  bg-white ', {
        'lg:w-1/2 w-11/12 mb-4 rounded-2xl': isHome,
        'border border-gray-300 py-2 rounded-full': !isHome,
      })}
    >
      {' '}
      <label htmlFor='search' className='sr-only'>
        Search restaurants
      </label>
      <input
        type='text'
        id='search'
        name='search'
        placeholder='Search restaurants...'
        aria-label='Search restaurants'
        className={cn('w-full px-4 rounded-2xl text-black focus:outline-none', {
          'py-6': isHome,
        })}
      />
      <button
        className={cn('rounded-full p-1 bg-red-500 hover:bg-red-600', {
          'p-2': isHome,
        })}
        aria-label='Submit search'
      >
        <Search color='#ffffff' size={isHome ? 24 : 16} />
      </button>
    </form>
  );
}

export default SearchBar;
