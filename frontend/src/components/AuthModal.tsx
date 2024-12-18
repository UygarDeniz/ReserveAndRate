import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
type AuthModalProps = {
  closeAuthModal: () => void;
};
function AuthModal({ closeAuthModal }: AuthModalProps) {
  const [showLoginModal, setShowLoginModal] = useState(true);

  function changeForm() {
    setShowLoginModal(!showLoginModal);
  }
  return (
    <div className='fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-50'>
      {showLoginModal ? (
        <LoginForm changeForm={changeForm} closeAuthModal={closeAuthModal}/>
      ) : (
        <RegisterForm changeForm={changeForm} closeAuthModal={closeAuthModal}/>
      )}
    </div>
  );
}

export default AuthModal;
