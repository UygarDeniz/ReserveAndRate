import { useUser } from '../contexts/userContext';

function ProctectedComponent() {
  const { user } = useUser();
  return <div className='text-center text-4xl bg-black  '>
    <p className='text-white'>Hello {user?.username}</p>
    </div>;
}

export default ProctectedComponent;
