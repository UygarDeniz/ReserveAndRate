import React, { useState } from 'react';
import { Link } from 'react-router';
import { CircleUser } from 'lucide-react';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const closeAuthModal = () => setShowAuthModal(false);
  return (
    <header className='bg-white shadow-md fixed top-0 left-0 w-full z-40'>
      <div className='container mx-auto flex justify-between items-center py-4 px-6'>
        <Link to='/' className='text-xl font-bold text-gray-800'>
          ReserveNRate
        </Link>
        <nav className='space-x-4 flex items-center'>
          <button onClick={() => setShowAuthModal(true)}>
            <CircleUser color='#ff4747' />
          </button>
        </nav>
      </div>
      {showAuthModal && <AuthModal closeAuthModal={closeAuthModal} />}
    </header>
  );
};

export default Header;
