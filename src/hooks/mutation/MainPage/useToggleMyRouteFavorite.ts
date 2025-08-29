import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleMyRouteFavorite } from '@/apis/Mainpage/myRoute';
import type { MyRoute } from '@/types/myRoute';

// 루트 즐겨찾기 토글 훅
export const useToggleMyRouteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (myRouteId: number) => toggleMyRouteFavorite(myRouteId),
    onSuccess: (updatedRoute: MyRoute) => {
      // 관련 쿼리들 업데이트
      queryClient.invalidateQueries({ queryKey: ['myRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['myRoute', updatedRoute.myRouteId] });

      // 특정 캐시 업데이트
      queryClient.setQueryData(['myRoute', updatedRoute.myRouteId], updatedRoute);

      console.log('루트 즐겨찾기 상태 변경 성공:', updatedRoute);
    },
    onError: (error) => {
      console.error('루트 즐겨찾기 토글 실패:', error);
    },
  });
};
