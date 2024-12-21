import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from '../api/axios';
import { useNavigate } from 'react-router';
type User = {
  id: string;
  username: string;
};

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  logout: () => void;
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
  const navigate = useNavigate();
  const { mutate: logout } = useMutation({
    mutationFn: () =>
      axios.post(
        'api/users/logout/',
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
      navigate('/');
    },
  });

  return (
    <UserContext.Provider
      value={{ user, setUser, accessToken, setAccessToken, logout }}
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
