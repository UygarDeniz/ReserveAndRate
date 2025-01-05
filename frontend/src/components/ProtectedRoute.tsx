import { Outlet } from 'react-router';
import axios from '../api/axios';
import { useUser } from '../contexts/userContext';
import { useEffect, useState } from 'react';

function ProtectedRoute() {
  const { user, setUser, setAccessToken, accessToken } = useUser();

  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [setUser, setAccessToken, user, accessToken]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authorized</div>;
  }
  return <Outlet />;
}

export default ProtectedRoute;
