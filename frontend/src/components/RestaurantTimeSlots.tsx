import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import useProtectedAxios from '../hooks/useProtectedAxios';
import { useUser } from '../contexts/userContext';
import { AxiosError, isAxiosError } from 'axios';
import { cn } from '../lib/utils';
const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const months = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

type DayAvailability = {
  date: string;
  available: boolean;
};
type TimeSlot = {
  id: number;
  start_time: string;
  end_time: string;
};

function Reservation({ restaurantId }: { restaurantId: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [error, setError] = useState('');
  const { user, openAuthModal } = useUser();
  const protectedAxios = useProtectedAxios();
  const queryClient = useQueryClient();
  const { data: monthlyAvailability = [], isPending } = useQuery({
    queryKey: [
      'monthlyAvailability',
      restaurantId,
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
    ],
    queryFn: async (): Promise<DayAvailability[]> => {
      const response = await fetch(
        `/api/reservations/available-days/?restaurant_id=${restaurantId}&year=${currentDate.getFullYear()}&month=${
          currentDate.getMonth() + 1
        }`
      );
      return response.json();
    },
  });
  const { mutate: deleteTimeSlot } = useMutation({
    mutationFn: async (id: number) => {
      const response = await protectedAxios.delete(
        `/api/reservations/time-slots/${id}/`
      );
      return response.data;
    },
    onError: (error: unknown) => {
      if (error && isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorDetail = (axiosError.response?.data as { detail: string })
          ?.detail;
        setError(errorDetail || axiosError.message);
      } else {
        setError('An error occurred');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timeSlots', restaurantId, selectedDate],
      });
      alert('Time slot deleted successfully');
      setError('');
      setSelectedTime(null);
    },
  });

  const { data: timeSlots = [] } = useQuery({
    queryKey: ['timeSlots', restaurantId, selectedDate],
    queryFn: async (): Promise<TimeSlot[]> => {
      if (!selectedDate) return [];
      const response = await axios.get(
        `/api/reservations/available-time-slots/?restaurant_id=${restaurantId}&date=${selectedDate}`
      );
      return response.data;
    },
    enabled: !!selectedDate && !!restaurantId,
  });

  /**  Returns the first day of the month (0..6) (0 = Sunday, 6 = Saturday) */
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Insert "empty cells" at the beginning, so the first date lines up properly under its weekday
  const emptyCells = () => {
    const weekdayIndex = getFirstDayOfMonth(currentDate); // 0..6
    const emptyCells = [];
    for (let i = 0; i < weekdayIndex; i++) {
      emptyCells.push({ date: '', available: false });
    }
    return emptyCells;
  };

  // Build an array of placeholders + actual monthlyAvailability
  const allDays: DayAvailability[] = [...emptyCells(), ...monthlyAvailability];

  const weeks: DayAvailability[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const handleDateSelect = (clickedDate: string, available: boolean) => {
    if (!clickedDate || !available) return;

    if (!user) {
      openAuthModal();
      return;
    }

    setSelectedDate(clickedDate);
    setSelectedTime(null);
  };

  useEffect(() => {
    const timeslots = window.document.getElementById('time-slots');
    if (timeslots) {
      timeslots.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedDate, timeSlots]);

  useEffect(() => {
    const selectedTimeEl = window.document.getElementById('selected-time');
    if (selectedTimeEl) {
      selectedTimeEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTime]);

  async function handleDeleteTimeSlot() {
    if (!selectedTime) return;
    deleteTimeSlot(selectedTime.id);
  }

  return (
    <div className='bg-white w-1/3 pt-16 lg:w-full lg:pt-0'>
      <h2 className='text-lg font-semibold mb-4 w-full'>Date</h2>
      <div className='mb-8 w-full'>
        {/* MONTH NAV */}
        <div className='flex justify-between items-center mb-4 w-full'>
          <button
            onClick={() => {
              setCurrentDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
              );
              setSelectedDate(null);
            }}
            className='bg-red-500 rounded-full hover:bg-red-600'
          >
            <ChevronLeft color='#ffffff' />
          </button>
          <span className='text-sm font-medium'>
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => {
              setCurrentDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
              );
              setSelectedDate(null);
            }}
            className='bg-red-500 rounded-full hover:bg-red-600'
          >
            <ChevronRight color='#ffffff' />
          </button>
        </div>

        {/* CALENDAR TABLE */}

        {isPending ? (
          <div className='w-full flex justify-center items-center h-32 '>
            <LoaderCircle className='animate-spin' />
          </div>
        ) : (
          <table className='w-full text-center mt-6'>
            <thead>
              <tr>
                {daysOfWeek.map((dayName) => (
                  <th key={dayName} className='text-xs font-medium '>
                    {dayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, rowIndex) => (
                <tr key={rowIndex}>
                  {week.map(({ date, available }, colIndex) => {
                    // If date is empty, we render an empty cell
                    if (!date) {
                      return <td key={`empty-${colIndex}`} />;
                    }
                    // Otherwise, parse day from date string (YYYY-MM-DD)
                    const dayPart = date.split('-')[2];
                    const isSelected = selectedDate === date;

                    return (
                      <td key={date} className='py-2'>
                        <button
                          onClick={() => handleDateSelect(date, available)}
                          disabled={!available}
                          className={`w-8 h-8 rounded-full text-sm
                          ${isSelected ? 'bg-red-500 text-white' : ''}
                          ${
                            available
                              ? 'hover:bg-gray-200'
                              : 'text-gray-300 pointer-events-none'
                          }`}
                        >
                          {dayPart}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* TIMESLOTS */}
      {selectedDate && (
        <div id='time-slots' className='w-full'>
          <h2 className='text-lg font-semibold mb-4'>Time</h2>
          <div className='grid grid-cols-2 gap-2'>
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                className={cn(
                  'px-4 py-2 text-sm border rounded hover:bg-gray-50',
                  selectedTime?.id === slot.id &&
                    'bg-red-500 text-white hover:bg-red-600'
                )}
                onClick={() => setSelectedTime(slot)}
              >
                {slot.start_time}
              </button>
            ))}
          </div>
          {selectedTime && (
            <div
              id='selected-time'
              onClick={handleDeleteTimeSlot}
              className='mt-4'
            >
              <button className='bg-red-500 text-white w-full py-2 rounded mt-4 hover:bg-red-600'>
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      {error && <div className='text-red-500 mt-4'>{error}</div>}
    </div>
  );
}

export default Reservation;
