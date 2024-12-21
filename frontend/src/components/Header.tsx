import React, { useState } from 'react';
import { Link } from 'react-router';
import { CircleUser } from 'lucide-react';
import AuthModal from './AuthModal';
import { useUser } from '../contexts/userContext';
import Logout from './Logout';

const Header: React.FC = () => {
  const { user } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const closeAuthModal = () => setShowAuthModal(false);
  return (
    <header className='bg-white shadow-md w-full'>
      <div className='container mx-auto flex justify-between items-center py-4 px-6'>
        <Link to='/' className='text-xl font-bold text-gray-800'>
          ReserveNRate
        </Link>
        <nav className='space-x-4 flex items-center'>
          {user ? (
            <>
              <Link to='/protected'>Protected Route</Link>
              <Logout />
            </>
          ) : (
            <button onClick={() => setShowAuthModal(true)}>
              <CircleUser color='#ff4747' />
            </button>
          )}
        </nav>
      </div>

      {!user && showAuthModal && <AuthModal closeAuthModal={closeAuthModal} />}
    </header>
  );
};

export default Header;
