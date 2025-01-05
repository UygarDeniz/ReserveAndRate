import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from 'react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from '../api/axios';
import { useNavigate } from 'react-router';
type User = {
  id: string;
  username: string;
  email?: string;
  phone_number?: string;
  profile_image?: string;
  bio?: string;
};

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserContextType['user']>(null);
  const [accessToken, setAccessToken] =
    useState<UserContextType['accessToken']>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const { mutate: logout } = useMutation({
    mutationFn: () =>
      axios.post(
        '/api/users/logout/',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ),
    onSuccess: () => {
      setUser(null);
      setAccessToken(null);
      openAuthModal();
    },
    onError: () => {
      setUser(null);
      setAccessToken(null);
      navigate('/');
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me/', {
          withCredentials: true,
        });
        setAccessToken(res.data.access);
        setUser({
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          phone_number: res.data.phone_number,
          profile_image: res.data.profile_image,
          bio: res.data.bio,
        });
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        logout,
        showAuthModal,
        openAuthModal,
        closeAuthModal,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
