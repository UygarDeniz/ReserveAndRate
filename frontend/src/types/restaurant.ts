export type Restaurant = {
  id: number;
  name: string;
  summary: string;
  description: string;
  price_start_from: number;
  max_dinning_time: number;
  min_number_of_guests: number;
  max_number_of_guests: number;
  cancellation_policy: string;
  image: string;
  full_address: string;
  rating: number;
  remarks: string[];
  phone_number: string;
  opening_hours: string;
  average_rating: number;
  total_reviews: number;
  cuisines: Cuisine[];
  city: City;
};

export type Cuisine = {
  id: number;
  name: string;
};

export type City = {
  id: number;
  name: string;
};
