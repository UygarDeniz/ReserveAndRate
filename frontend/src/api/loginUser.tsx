import axios from './axios';

type LoginData = {
  username: string;
  password: string;
};
export const loginUser = async (data: LoginData) => {
  const res = await axios.post('/api/users/token/', data, {
    withCredentials: true,
  });

  return res.data;
};
