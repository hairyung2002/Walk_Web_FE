import { useState, useCallback } from 'react';
import { getCurrentLocation, getWalkingRoute, type Location, type RouteInfo } from '../apis/NavigatePage/navigate';

interface UseNavigationReturn {
  currentLocation: Location | null;
  routeInfo: RouteInfo | null;
  isLoading: boolean;
  error: string | null;
  getCurrentPos: () => Promise<void>;
  searchRoute: (destination: Location, destinationName?: string) => Promise<void>;
  clearRoute: () => void;
  clearError: () => void;
}

/**
 * 네비게이션 관련 상태와 기능을 제공하는 커스텀 훅
 */
export const useNavigation = (): UseNavigationReturn => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 현재 위치 가져오기
   */
  const getCurrentPos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📍 현재 위치 요청 시작...');
      const location = await getCurrentLocation();
      
      setCurrentLocation(location);
      console.log('✅ 현재 위치 설정 완료:', location);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '위치를 가져올 수 없습니다.';
      console.error('❌ 현재 위치 가져오기 실패:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 경로 검색
   */
  const searchRoute = useCallback(async (
    destination: Location,
    destinationName: string = '목적지'
  ) => {
    if (!currentLocation) {
      setError('현재 위치를 먼저 가져와주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🗺️ 경로 검색 시작:', {
        from: currentLocation,
        to: destination,
        destinationName,
      });
      
      const route = await getWalkingRoute(
        currentLocation,
        destination,
        '현재 위치',
        destinationName
      );
      
      setRouteInfo(route);
      console.log('✅ 경로 검색 완료:', route);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '경로 검색에 실패했습니다.';
      console.error('❌ 경로 검색 실패:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentLocation]);

  /**
   * 경로 정보 초기화
   */
  const clearRoute = useCallback(() => {
    setRouteInfo(null);
    setError(null);
    console.log('🧹 경로 정보 초기화');
  }, []);

  /**
   * 에러 메시지 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentLocation,
    routeInfo,
    isLoading,
    error,
    getCurrentPos,
    searchRoute,
    clearRoute,
    clearError,
  };
};
