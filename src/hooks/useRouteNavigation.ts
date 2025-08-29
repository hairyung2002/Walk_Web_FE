import { useState, useEffect, useCallback, useRef } from 'react';

const TMAP_APP_KEY = 'bozGB4KHwEa9pvFOm5Q4Z3A78JBt5KXL58U7Ph4X';

interface LatLng {
  lat: number;
  lng: number;
}

interface TmapRequestBody {
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  reqCoordType: string;
  resCoordType: string;
  startName: string;
  endName: string;
  passList?: string;
}

interface TmapFeature {
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties?: {
    totalDistance?: number;
    totalTime?: number;
  };
}

interface ApiCallState {
  isBlocked: boolean;
  lastCallTime: number;
  retryAfter: number;
}

interface UseRouteNavigationProps {
  start: LatLng;
  end: LatLng;
  waypoints?: LatLng[];
}

export const useRouteNavigation = ({ start, end, waypoints = [] }: UseRouteNavigationProps) => {
  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
  const [totalInfo, setTotalInfo] = useState<string>('경로를 검색하는 중...');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasInitialRoute, setHasInitialRoute] = useState<boolean>(false);

  // API 호출 상태 관리
  const apiState = useRef<ApiCallState>({
    isBlocked: false,
    lastCallTime: 0,
    retryAfter: 0,
  });

  // API 호출 가능 여부 확인
  const canMakeApiCall = useCallback(() => {
    const now = Date.now();
    
    // 429 에러로 차단된 경우
    if (apiState.current.isBlocked) {
      if (now < apiState.current.retryAfter) {
        return false;
      }
      apiState.current.isBlocked = false;
    }
    
    // 최소 2초 간격 보장
    if (now - apiState.current.lastCallTime < 2000) {
      return false;
    }
    
    return true;
  }, []);

  // API 호출 기록
  const recordApiCall = useCallback(() => {
    apiState.current.lastCallTime = Date.now();
  }, []);

  // 429 에러 처리
  const handle429Error = useCallback(() => {
    apiState.current.isBlocked = true;
    apiState.current.retryAfter = Date.now() + 60000; // 1분 후 재시도
    setTotalInfo('API 호출 한도를 초과했습니다. 1분 후 다시 시도해주세요.');
  }, []);

  // Tmap 보행자 경로 API 호출
  const fetchRoute = useCallback(async () => {
    console.log('fetchRoute 호출됨');
    console.log('출발지:', start);
    console.log('도착지:', end);
    
    // API 호출 가능 여부 확인
    if (!canMakeApiCall()) {
      console.log('API 호출이 제한되었습니다.');
      return;
    }

    recordApiCall();
    setIsLoading(true);
    setTotalInfo('경로를 검색하는 중...');

    const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian';

    const requestBody: TmapRequestBody = {
      startX: start.lng.toString(),
      startY: start.lat.toString(),
      endX: end.lng.toString(),
      endY: end.lat.toString(),
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      startName: encodeURIComponent('출발지'),
      endName: encodeURIComponent('도착지'),
    };

    // 경유지가 있으면 passList 추가
    if (waypoints.length > 0) {
      const passList = waypoints
        .slice(0, 5)
        .map((wp) => `${wp.lng},${wp.lat}`)
        .join('_');
      requestBody.passList = passList;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          appKey: TMAP_APP_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (res.status === 429) {
        handle429Error();
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        setTotalInfo(`API 오류: ${res.status} - ${errorText}`);
        return;
      }

      const data = await res.json();
      console.log('API Response:', data);

      if (data.features && data.features.length > 0) {
        const allPoints: LatLng[] = [];
        let totalDistance = 0;
        let totalTime = 0;

        data.features.forEach((feature: TmapFeature) => {
          if (feature.geometry && feature.geometry.coordinates) {
            feature.geometry.coordinates.forEach((coord: number[]) => {
              if (coord && coord.length >= 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number') {
                const lat = coord[1];
                const lng = coord[0];
                if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                  allPoints.push({ lat, lng });
                }
              }
            });
          }

          if (feature.properties) {
            totalDistance += feature.properties.totalDistance || 0;
            totalTime += feature.properties.totalTime || 0;
          }
        });

        setRoutePoints(allPoints);
        
        const distanceKm = (totalDistance / 1000).toFixed(2);
        const timeMin = Math.round(totalTime / 60);
        setTotalInfo(`총 거리: ${distanceKm}km, 예상 시간: ${timeMin}분`);
        setHasInitialRoute(true);
      } else {
        setTotalInfo('경로를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      setTotalInfo('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [start, end, waypoints, canMakeApiCall, recordApiCall, handle429Error]);

  // 최초 1회만 경로 탐색 실행
  useEffect(() => {
    if (!hasInitialRoute) {
      fetchRoute();
    }
  }, [fetchRoute, hasInitialRoute]);

  return {
    routePoints,
    totalInfo,
    isLoading,
    hasInitialRoute,
    refetchRoute: fetchRoute, // 수동으로 경로 재탐색이 필요한 경우
  };
};
