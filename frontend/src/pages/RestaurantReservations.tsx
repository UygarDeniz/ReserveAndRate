import useProtectedAxios from '../hooks/useProtectedAxios';
import { LoaderCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '../lib/utils';
import { Review } from '../types/review';
import PaginationButtons from '../components/PaginationButtons';
import { PAGE_SIZE } from '../lib/constants';
import { useSearchParams } from 'react-router';

type Reservation = {
  id: number;
  guests: number;
  user: string;
  special_request: string;
  created_at: string;
  start_time: string;
  date: string;
  review: Review | null;
  restaurant_name: string;
  restaurant_id: number;
  is_past: boolean;
};

type ReservationResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Reservation[];
};

function UserReservations() {
  const protectedAxios = useProtectedAxios();
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page') || 1;
  const {
    data: reservations,
    isPending,
    error,
  } = useQuery({
    queryKey: ['reservations', page],
    queryFn: async (): Promise<ReservationResponse> => {
      const res = await protectedAxios.get(
        '/api/reservations/restaurant-reservations/',
        { params: { page } }
      );
      return res.data;
    },
  });

  if (isPending) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className='text-red-500 animate-spin' size={64} />
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen items-center max-w-screen-lg w-full mx-auto '>
      <h1 className='text-xl font-semibold mt-8 mb-4'>Restaurant's Reservations</h1>
      {reservations && reservations.results.length > 0 ? (
        <div>
          {reservations?.results?.map((reservation) => (
            <div
              key={reservation.id}
              className='bg-white p-4 rounded-lg shadow-md mb-4'
            >
              <div className=' flex items-start justify-between'>
                <div>
                  <h3 className='text-xl font-semibold'>
                    Restaurant: {reservation.restaurant_name}
                  </h3>
                  <div className='flex items-center gap-x-4'>
                    <h4 className='text-lg font-bold'>
                      {reservation.start_time}
                    </h4>
                    <p
                      className={cn(
                        'text-sm px-4 py-1 rounded-full text-white',
                        {
                          'bg-green-600': !reservation.is_past,
                          'bg-red-700': reservation.is_past,
                        }
                      )}
                    >
                      {reservation.is_past ? 'Completed' : 'Upcoming'}
                    </p>
                  </div>
                </div>
              </div>
              <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
              <p>Guests: {reservation.guests}</p>
              {reservation.special_request && (
                <p>Special Request: {reservation.special_request}</p>
              )}
              <p>
                Booked on: {new Date(reservation.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          <PaginationButtons
            totalPages={Math.ceil(reservations?.count / PAGE_SIZE)}
            nextPage={reservations?.next}
            prevPage={reservations?.previous}
          />
        </div>
      ) : (
        <div className=''>
        <p>Restaurant doesnt have any reservations.</p>
        </div>
            
      )}

      {error && <div className='text-red-500 mt-4'>{error.message}</div>}
    </div>
  );
}

export default UserReservations;
