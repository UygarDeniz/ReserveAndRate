import { useUser } from '../contexts/userContext';
function Logout() {
  const { logout } = useUser();
  return <button onClick={logout}>Logout</button>;
}

export default Logout;
