import axios from './axios';
import { Restaurant } from '../types/restaurant';

type Params = {
  q?: string;
  page?: number;
};

type Response = {
  results: Restaurant[];
  count: number;
  next: string | null;
  previous: string | null;
};

export const getRestaurants = async (params: Params): Promise<Response> => {
  const response = await axios.get('api/restaurants', {
    params,
  });
  return response.data;
};
