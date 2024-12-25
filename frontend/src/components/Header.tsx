import React, { useState } from 'react';
import { Link } from 'react-router';
import { CircleUser } from 'lucide-react';
import AuthModal from './AuthModal';
import { useUser } from '../contexts/userContext';
import Logout from './Logout';
import { useLocation } from 'react-router';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const { user } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const closeAuthModal = () => setShowAuthModal(false);
  return (
    <header className='flex items-center bg-white shadow-md w-full opacity-[0.98] fixed top-0 min-h-16  z-10'>
      <div className='px-6 flex items-center justify-between h-full w-full lg:mx-64'>
        <Link to='/' className='text-xl font-bold text-gray-800 '>
          ReserveNRate
        </Link>
        {location.pathname !== '/' && <SearchBar />}
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
