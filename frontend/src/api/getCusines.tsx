import axios from './axios';

type Cuisine = {
  id: number;
  name: string;
};

async function getCuisines(): Promise<Cuisine[]> {
  const res = await axios.get('/api/cuisines');
  return res.data;
}

export default getCuisines;
