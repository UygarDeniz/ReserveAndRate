export type Restaurant = {
  id: number;
  name: string;
  description: string;
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
