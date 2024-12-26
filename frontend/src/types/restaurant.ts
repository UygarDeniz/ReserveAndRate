export type Restaurant = {
  id: number;
  name: string;
  summary: string;
  description: string;
  price_start_from: number;
  max_dinning_time: number;
  min_number_of_guests: number;
  max_number_of_guests: number;
  highlights: string[];
  cancellation_policy: string;
  image: string;
  city: string;
  full_address: string;
  rating: number;
  phone_number: string;
  opening_hours: string;
  average_rating: number;
  cuisines: Cuisine[];
};

export type Cuisine = {
  id: number;
  name: string;
};
