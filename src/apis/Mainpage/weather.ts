import type { Weather } from '@/types/weather';
import axios from 'axios';

export const getWeather = async (): Promise<Weather> => {
  const { data } = await axios.get(`/api/proxy?path=walk`);

  return data;
};