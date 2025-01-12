import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useUser } from '../contexts/userContext';
import { useNavigate } from 'react-router';
function RestaurantProtected() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'restaurant')) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <div className='min-h-screen'></div>;

  return <Outlet />;
}

export default RestaurantProtected;
