import { useUser } from '../contexts/userContext';
import { useEffect, useState } from 'react';
import useProtectedAxios from '../hooks/useProtectedAxios';
import { LoaderCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';


type Reservation = {
  id: number;
  guests: number;
  special_request: string;
  created_at: string;
  start_time: string;
  date: string;
  restaurant_name: string;
};

function Profile() {
  const { user, openAuthModal, loading } = useUser();
  const protectedAxios = useProtectedAxios();
  const [error, setError] = useState<string | null>(null);

  const { data: reservations, isPending } = useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: async () => {
      const res = await protectedAxios.get(
        '/api/reservations/user-reservations/'
      );
      return res.data;
    },
    enabled: !!user,
    onError: (err) => {
      console.error(err);
      setError('Error fetching reservations');
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      openAuthModal();
    }
  }, [loading, user, openAuthModal]);

  if (loading || isPending) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className='text-red-500 animate-spin' size={64} />
      </div>
    );
  }

  return (
    <div className='max-w-screen-lg mx-auto p-4 min-h-screen flex flex-col'>
      {user && (
        <>
          <h1 className='text-2xl font-bold mb-4'>Profile</h1>

          <h2 className='text-xl font-semibold mt-8 mb-4'>Your Reservations</h2>
          {reservations && reservations.length === 0 ? (
            <p>You have no reservations.</p>
          ) : (
            reservations?.results?.map((reservation) => (
              <div
                key={reservation.id}
                className='bg-white p-4 rounded-lg shadow-md mb-4'
              >
                {' '}
                <h3 className='text-xl font-semibold'>
                  Restaurant: {reservation.restaurant_name}
                </h3>
                <h4 className='text-lg font-bold'>
                  {reservation.start_time} 
                  
                </h4>
                <p>
                  Date:{' '}
                  {new Date(reservation.date).toLocaleDateString()}
                </p>
                <p>Guests: {reservation.guests}</p>
                {reservation.special_request && (
                  <p>Special Request: {reservation.special_request}</p>
                )}
                <p>
                  Booked on: {new Date(reservation.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </>
      )}
      {error && <div className='text-red-500 mt-4'>{error}</div>}
    </div>
  );
}

export default Profile;
