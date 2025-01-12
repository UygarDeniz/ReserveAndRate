import { cn } from '../lib/utils';

type ProfileNavBarProps = {
  changeOpenTab: (tab: number) => void;
  openTab: number;
};

export function ProfileNavBar({ openTab, changeOpenTab }: ProfileNavBarProps) {
  return (
    <nav className='flex gap-x-8  mt-6 w-full '>
      <button
        className={cn('font-semibold text-gray-700', {
          'text-red-500 underline underline-offset-4 decoration-2':
            openTab === 1,
        })}
        onClick={() => changeOpenTab(1)}
      >
        My Reservations
      </button>
      <button
        className={cn('font-semibold text-gray-700', {
          'text-red-500 underline underline-offset-4 decoration-2':
            openTab === 2,
        })}
        onClick={() => changeOpenTab(2)}
      >
        My Reviews
      </button>
    </nav>
  );
}
