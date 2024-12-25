import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { cn } from '../lib/utils';

type PaginatinButtonsProps = {
  totalPages: number;
  nextPage: string | null;
  prevPage: string | null;
};
function PaginationButtons({
  totalPages,
  prevPage,
  nextPage,
}: PaginatinButtonsProps) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;

  const createUrl = (page: number) => {
    searchParams.set('page', page.toString());
    return `?${searchParams.toString()}`;
  };
  return (
    <div className='flex flex-col items-center space-y-4'>
      <div className='flex space-x-4 items-center'>
        <Link
          to={createUrl(Number(page) - 1)}
          className={cn('p-2 rounded-xl bg-red-500 hover:bg-red-600 ', {
            'pointer-events-none opacity-50': !prevPage,
          })}
        >
          <ArrowLeft color='#ffffff' />
        </Link>
        <Link
          to={createUrl(Number(page) + 1)}
          className={cn(
            'p-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50',
            {
              'pointer-events-none opacity-50': !nextPage,
            }
          )}
        >
          <ArrowRight color='#ffffff' />
        </Link>
      </div>
      <p>Total Pages: ({totalPages})</p>
    </div>
  );
}

export default PaginationButtons;
