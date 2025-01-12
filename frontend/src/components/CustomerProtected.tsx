import { useEffect } from 'react';
import { useUser } from '../contexts/userContext';
import { Outlet, useNavigate } from 'react-router';
function CustomerProtected() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    

    if (!loading && (!user || user.role !== 'customer')) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <div className='min-h-screen'></div>;

  return <Outlet />;
}

export default CustomerProtected;
