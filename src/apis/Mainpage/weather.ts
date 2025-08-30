import type { Weather } from '@/types/weather';
import { axiosInstance } from '@/apis/axios';

export const getWeather = async (): Promise<Weather> => {
  const { data } = await axiosInstance.get('/walk');

  return data;
};