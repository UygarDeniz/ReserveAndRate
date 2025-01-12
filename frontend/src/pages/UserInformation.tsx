import React, { useEffect } from 'react';
import { useUser } from '../contexts/userContext';
import { ProfileNavBar } from '../components/ProfileNavBar';
import { LoaderCircle } from 'lucide-react';
import UserReservations from '../components/UserReservations';
import UserReviews from '../components/UserReviews';

function UserInformation() {
  const { user, openAuthModal, loading } = useUser();
  const [openTab, setOpenTab] = React.useState(1);

  useEffect(() => {
    if (!loading && !user) {
      openAuthModal();
    }
  }, [loading, user, openAuthModal]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className='text-red-500 animate-spin' size={64} />
      </div>
    );
  }

  const changeOpenTab = (tab: number) => {
    setOpenTab(tab);
  };
  return (
    <div className='max-w-screen-lg mx-auto p-4 min-h-screen'>
      {user && (
        <div>
          <ProfileNavBar changeOpenTab={changeOpenTab} openTab={openTab} />
          {openTab === 1 && <UserReservations />}
          {openTab === 2 && <UserReviews />}
        </div>
      )}
    </div>
  );
}

export default UserInformation;
