import axios from './axios';

type registerData = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string;
  password: string;
  password2: string;
};
export async function registerUser(registerData: registerData) {
  const res = await axios.post('/api/users/register/', registerData);
  return res.data;
}
