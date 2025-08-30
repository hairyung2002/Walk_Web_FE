import type { Address } from '@/types/address';
import { axiosInstance } from '@/apis/axios';

interface GetAddressParams {
  latitude?: number;
  longitude?: number;
}

export const getAddress = async (params?: GetAddressParams): Promise<Address> => {
  // 좌표가 제공된 경우 좌표 기반 주소 조회
  if (params?.latitude && params?.longitude) {
    const { data } = await axiosInstance.get('/walk/location/now', {
      params: {
        lat: params.latitude,
        lon: params.longitude,
      },
    });
    return data;
  }

  // 좌표가 없는 경우 현재 위치 기반 주소 조회
  const { data } = await axiosInstance.get('/walk/location/now');
  return data;
};
