import { useQuery, useQueryClient } from '@tanstack/react-query';
import useProtectedAxios from '../hooks/useProtectedAxios';
import { Restaurant, City, Cuisine } from '../types/restaurant';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import RestaurantTimeSlots from '../components/RestaurantTimeSlots';
import { Link } from 'react-router';
function RestaurantInformation() {
  const protectedAxios = useProtectedAxios();
  const [image, setImage] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: restaurant, isPending: isRestaurantPending } = useQuery({
    queryKey: ['restaurant'],
    queryFn: async (): Promise<Restaurant> => {
      const res = await protectedAxios.get('/api/restaurants/owner-restaurant');
      return res.data;
    },
  });

  const { data: cities, isPending: IsCitiesPending } = useQuery({
    queryKey: ['cities'],
    queryFn: async (): Promise<City[]> => {
      const res = await protectedAxios.get('/api/restaurants/cities');
      return res.data;
    },
  });

  const { data: cuisines, isPending: isCuisinesPending } = useQuery({
    queryKey: ['cuisines'],
    queryFn: async (): Promise<Cuisine[]> => {
      const res = await protectedAxios.get('/api/restaurants/cuisines');
      return res.data;
    },
  });

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  if (isRestaurantPending || IsCitiesPending || isCuisinesPending) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className='animate-spin' />
      </div>
    );
  }
  const handleRestaurantUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const remarks = formData.get('remarks') as string;
    formData.set('remarks', JSON.stringify(remarks.split(',')));

    if (!image) {
      formData.delete('image');
    }

    try {
      await protectedAxios.patch(
        '/api/restaurants/owner-restaurant/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      alert('Restaurant updated successfully');
    } catch (error) {
      console.error('Failed to update restaurant:', error);
      alert('Failed to update restaurant');
    }
  };
  async function handleCreateTimeSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      formData.set('restaurant', restaurant?.id.toString() || '');
      await protectedAxios.post('/api/reservations/time-slots/', formData);
      alert('Time slot created successfully');
      queryClient.invalidateQueries({
        queryKey: ['monthlyAvailability', restaurant?.id.toString()],
        
      });
      queryClient.invalidateQueries({queryKey:["timeSlots"]})


    } catch (error) {
      console.error('Failed to create time slot:', error);
      alert('Failed to create time slot');
    }
  }
  return (
    <div className='p-8 w-full max-w-2xl mx-auto space-y-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>
        Manage Restaurant Information
      </h1>
      <Link to="/restaurant/profile/restaurant-reservations" className="text-red-500">View Reservations</Link>

      {restaurant && (
        <div className='bg-white p-4 shadow rounded space-y-4'>
          <h2 className='text-xl font-semibold'>Update Restaurant</h2>
          <form
            className='space-y-2'
            onSubmit={handleRestaurantUpdate}
            encType='multipart/form-data'
          >
            <label className='block mb-2 font-medium'>Name</label>
            <input
              className='border p-2 w-full'
              name='name'
              defaultValue={restaurant.name}
            />
            <label className='block mb-2 font-medium'>
              Short Summary (Appears on Search)
            </label>
            <textarea
              className='border p-2 w-full'
              name='summary'
              defaultValue={restaurant.summary}
            />

            <label className='block mb-2 font-medium'>Description</label>
            <textarea
              className='border p-2 w-full'
              name='description'
              defaultValue={restaurant.description}
            />

            <label className='block mb-2 font-medium'>Full Address</label>
            <input
              className='border p-2 w-full'
              name='full_address'
              defaultValue={restaurant.full_address}
            />

            <label className='block mb-2 font-medium'>Phone Number</label>
            <input
              className='border p-2 w-full'
              name='phone_number'
              defaultValue={restaurant.phone_number}
            />

            <label className='block mb-2 font-medium'>Opening Hours</label>
            <input
              className='border p-2 w-full'
              name='opening_hours'
              defaultValue={restaurant.opening_hours}
            />

            <label className='block mb-2 font-medium'>
              Max Dining Time (minutes)
            </label>
            <input
              className='border p-2 w-full'
              name='max_dinning_time'
              type='number'
              defaultValue={restaurant.max_dinning_time}
            />

            <label className='block mb-2 font-medium'>
              Price Start From ($)
            </label>
            <input
              className='border p-2 w-full'
              name='price_start_from'
              type='number'
              defaultValue={restaurant.price_start_from}
            />

            <label className='block mb-2 font-medium'>
              Min Number of Guests
            </label>
            <input
              className='border p-2 w-full'
              name='min_number_of_guests'
              type='number'
              defaultValue={restaurant.min_number_of_guests}
            />

            <label className='block mb-2 font-medium'>
              Max Number of Guests
            </label>
            <input
              className='border p-2 w-full'
              name='max_number_of_guests'
              type='number'
              defaultValue={restaurant.max_number_of_guests}
            />

            <label className='block mb-2 font-medium'>Image URL</label>
            <div className='flex justify-end items-center space-x-2'>
              <img
                src={image || restaurant.image}
                alt={restaurant.name}
                className='w-16 h-16 object-cover rounded-full'
              />
              <input
                className='border p-2 w-full'
                name='image'
                type='file'
                onChange={onImageChange}
              />
            </div>

            <label className='block mb-2 font-medium'>Remarks</label>
            <textarea
              className='border p-2 w-full'
              name='remarks'
              defaultValue={restaurant.remarks}
            />

            <label className='block mb-2 font-medium'>
              Cancellation Policy
            </label>
            <textarea
              className='border p-2 w-full'
              name='cancellation_policy'
              defaultValue={restaurant.cancellation_policy}
            />
            <label className='block mb-2 font-medium'>Select a City</label>
            <select
              className='border p-2 w-full'
              name='city'
              defaultValue={restaurant.city?.name}
            >
              {cities?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <label className='block mb-2 font-medium'>Select Cuisines</label>
            <select
              className='border p-2 w-full'
              name='cuisines'
              multiple
              defaultValue={restaurant.cuisines.map((cuisine) => cuisine.name)}
            >
              {cuisines?.map((cuisine) => (
                <option key={cuisine.id} value={cuisine.id}>
                  {cuisine.name}
                </option>
              ))}
            </select>
            <button
              type='submit'
              className='bg-red-500 text-white px-4 py-2 rounded mt-2'
            >
              Save
            </button>
          </form>
        </div>
      )}

      <div className='bg-white p-4 shadow rounded space-y-4'>
        <h2 className='text-xl font-semibold'>Create Time Slot</h2>
        <div className='space-y-2'>
          <form onSubmit={handleCreateTimeSlot}>
            <label className='block font-medium'>Date</label>
            <input
              className='border p-2 w-full'
              type='date'
              name='date'
              min={new Date().toISOString().split('T')[0]}
            />
            <label className='block font-medium'>Start Time</label>
            <input
              className='border p-2 w-full'
              type='time'
              name='start_time'
            />
            <label className='block font-medium'>End Time</label>
            <input className='border p-2 w-full' type='time' name='end_time' />
            <label className='block font-medium'>Max Bookings</label>
            <input
              className='border p-2 w-full'
              type='number'
              name='max_bookings'
            />
            <button className='bg-red-500 text-white px-4 py-2 rounded mt-2'>
              Add
            </button>
          </form>
        </div>
      </div>
      <div className='flex justify-center'>
        {restaurant && <RestaurantTimeSlots restaurantId={restaurant.id.toString()} />}
      </div>
    </div>
  );
}

export default RestaurantInformation;
