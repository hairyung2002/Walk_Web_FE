import type { Review } from '@/types/review';
import axios from 'axios';

export const getReview = async (): Promise<Review[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/walk/reviews`);

  return data;
};