import type { AIResponseRoute } from '@/types/AIroute';
import axios from 'axios';

export const postRoute = async (
  duration: string,
  purpose: string,
  addressJibunm: string,
  withPet: boolean,
  longitude: number,
  latitude: number,
): Promise<AIResponseRoute> => {
  const { data } = await axios.post<AIResponseRoute>(`${import.meta.env.VITE_SERVER_API_URL}/walk/ai/request`, {
    duration,
    purpose,
    addressJibunm,
    withPet,
    longitude,
    latitude,
  });

  return data;
};
