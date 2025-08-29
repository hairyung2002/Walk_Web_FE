import type { Weather } from '@/types/weather';
import axios from 'axios';

export const getWeather = async (): Promise<Weather> => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/walk`);

  return data;
};