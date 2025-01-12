import axios from './axios';

type City = {
  id: number;
  name: string;
};

async function getCities(): Promise<City[]> {
  const res = await axios.get('/api/restaurants/cities/');
  return res.data;
}

export default getCities;
