import type { AIResponseRoute } from '@/types/AIroute';
import { axiosInstance } from '@/apis/axios';

export const postRoute = async (
  duration: string,
  purpose: string,
  addressJibunm: string,
  withPet: boolean,
  longitude: number,
  latitude: number,
): Promise<AIResponseRoute> => {
  const { data } = await axiosInstance.post<AIResponseRoute>('/walk/ai/request', {
    duration,
    purpose,
    addressJibunm,
    withPet,
    longitude,
    latitude,
  });

  return data;
};
