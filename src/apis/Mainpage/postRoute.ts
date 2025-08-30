import type { AIResponseRoute } from '@/types/AIroute';
import { axiosInstance } from '@/apis/axios';

export const postRoute = async (
  duration: string,
  purpose: string,
  addressJibun: string,
  withPet: boolean,
  longitude: number,
  latitude: number,
): Promise<AIResponseRoute> => {
  const requestData = {
    duration,
    purpose,
    addressJibun,
    withPet,
    longitude,
    latitude,
  };

  console.log('🚀 AI 경로 요청 데이터:', requestData);

  try {
    const { data } = await axiosInstance.post<AIResponseRoute>('/walk/ai/request', requestData);
    console.log('✅ AI 경로 응답:', data);
    return data;
  } catch (error) {
    console.error('❌ AI 경로 요청 실패:', error);
    throw error;
  }
};
