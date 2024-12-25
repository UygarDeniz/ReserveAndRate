import { useState } from 'react';
import LoginForm from './LoginForm';
import { useEffect } from 'react';
import RegisterForm from './RegisterForm';

type AuthModalProps = {
  closeAuthModal: () => void;
};
function AuthModal({ closeAuthModal }: AuthModalProps) {
  const [showLoginModal, setShowLoginModal] = useState(true);

  function changeForm() {
    setShowLoginModal(!showLoginModal);
  }
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  return (
    <div
      className={
        'fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10'
      }
    >
      {showLoginModal ? (
        <LoginForm changeForm={changeForm} closeAuthModal={closeAuthModal} />
      ) : (
        <RegisterForm changeForm={changeForm} closeAuthModal={closeAuthModal} />
      )}
    </div>
  );
}

export default AuthModal;
