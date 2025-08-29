import { axiosInstance } from '../axios';
import type { MyRoute, MyRouteDetailParams } from '@/types/myRoute';

// 내 루트 목록 조회
export const getMyRoutes = async (): Promise<MyRoute[]> => {
  const response = await fetch(`/walk/my-routes`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch my routes');
  }

  return response.json();
};

// 즐겨찾기 루트 목록 조회
export const getFavoriteRoutes = async (): Promise<MyRoute[]> => {
  const response = await axiosInstance.get('/walk/my-routes', {
    params: { isFavorite: true },
  });
  return response.data.data;
};

// 특정 루트 상세 조회
export const getMyRouteDetail = async (params: MyRouteDetailParams): Promise<MyRoute> => {
  const response = await axiosInstance.get(`/walk/my-routes/${params.myRouteId}`);
  return response.data.data;
};

// 루트 즐겨찾기 토글
export const toggleMyRouteFavorite = async (myRouteId: number): Promise<MyRoute> => {
  const response = await axiosInstance.patch(`/walk/my-routes/${myRouteId}/favorite`);
  return response.data.data;
};
