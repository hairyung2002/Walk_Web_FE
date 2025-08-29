import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getMyRoutes, getMyRouteDetail } from '../../../apis/Mainpage/myRoute';
import type { MyRoute, MyRouteDetailParams } from '../../../types/myRoute';

// 내 루트 목록 조회 훅
export const useGetMyRoutes = (options?: Omit<UseQueryOptions<MyRoute[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['myRoutes'],
    queryFn: () => getMyRoutes(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

// 찜한 루트만 조회하는 전용 훅
export const useGetFavoriteRoutes = (options?: Omit<UseQueryOptions<MyRoute[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['myRoutes', 'favorite'],
    queryFn: () => getMyRoutes(), // 실제로는 favorite만 필터링하는 API 호출 필요
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// 특정 내 루트 상세 조회 훅
export const useGetMyRouteDetail = (
  params: MyRouteDetailParams,
  options?: Omit<UseQueryOptions<MyRoute, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['myRoute', params.myRouteId],
    queryFn: () => getMyRouteDetail(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!params.myRouteId, // myRouteId가 있을 때만 실행
    ...options,
  });
};
