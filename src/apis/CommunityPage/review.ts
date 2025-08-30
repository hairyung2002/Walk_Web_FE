import type { Review } from '@/types/review';
import { axiosInstance } from '@/apis/axios';

export const getReview = async (): Promise<Review[]> => {
  const { data } = await axiosInstance.get('/walk/reviews');

  return data;
};