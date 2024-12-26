import axios from './axios';
import { Restaurant } from '../types/restaurant';

type Params = {
  q?: string;
  page?: number;
  city?: string;
  cuisine?: string;
};

type Response = {
  results: Restaurant[];
  count: number;
  next: string | null;
  previous: string | null;
};

export const getRestaurants = async (params: Params): Promise<Response> => {
  const response = await axios.get('/api/restaurants', {
    params,
  });
  return response.data;
};


export const getRestaurantById = async (id: string): Promise<Restaurant> => {
  const response = await axios.get(`/api/restaurants/${id}`);
  return response.data;
}