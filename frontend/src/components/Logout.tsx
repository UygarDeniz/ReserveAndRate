import { useUser } from '../contexts/userContext';
function Logout() {
  const { logout } = useUser();
  return <button onClick={logout} className='px-4 py-1 border border-gray-500 rounded-3xl
  hover:bg-gray-100 text-gray-700'>Logout</button>;
}

export default Logout;
