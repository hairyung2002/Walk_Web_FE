import { useState, useEffect, useRef, useCallback } from 'react';

interface LatLng {
  lat: number;
  lng: number;
}

interface UseLocationTrackingOptions {
  pollingInterval?: number; // 폴링 간격 (ms), 기본 5초
  minDistanceChange?: number; // 최소 변화 거리 (m), 기본 10m
  enableHighAccuracy?: boolean; // 고정밀도 사용 여부
}

export const useLocationTracking = (options: UseLocationTrackingOptions = {}) => {
  const {
    pollingInterval = 5000, // 5초마다 폴링
    minDistanceChange = 10, // 10m 이상 변화시만 업데이트
  } = options;

  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  const intervalRef = useRef<number | null>(null);
  const previousLocationRef = useRef<LatLng | null>(null);

  // 두 지점 간의 거리 계산 (하버사인 공식)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // 지구 반지름 (미터)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 현재 위치 가져오기
  const getCurrentPosition = useCallback((): Promise<LatLng> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('위치 서비스가 지원되지 않습니다.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('위치 획득 성공:', { lat: latitude, lng: longitude });
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('위치 획득 실패:', error);
          let errorMessage = '위치를 가져올 수 없습니다.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 요청 시간이 초과되었습니다.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true, // 더 정확한 위치 요청
          timeout: 15000, // 15초 타임아웃
          maximumAge: 30000, // 30초간 캐시된 위치 허용
        },
      );
    });
  }, []);

  // 위치 업데이트 처리
  const updateLocation = useCallback(async () => {
    try {
      const newLocation = await getCurrentPosition();
      
      // 이전 위치와 비교하여 충분한 변화가 있는지 확인
      if (previousLocationRef.current) {
        const distance = calculateDistance(
          previousLocationRef.current.lat,
          previousLocationRef.current.lng,
          newLocation.lat,
          newLocation.lng,
        );

        // 최소 변화 거리보다 작으면 업데이트하지 않음
        if (distance < minDistanceChange) {
          console.log(`위치 변화가 ${distance.toFixed(1)}m로 임계값(${minDistanceChange}m)보다 작음`);
          return;
        }

        console.log(`위치 업데이트: ${distance.toFixed(1)}m 이동`);
      }

      // 위치 업데이트
      setCurrentLocation(newLocation);
      previousLocationRef.current = newLocation;
      setLocationError(null);
      
      console.log('현재 위치 업데이트:', newLocation);
    } catch (error) {
      console.error('위치 조회 실패:', error);
      setLocationError('위치 정보를 가져올 수 없습니다.');
    }
  }, [minDistanceChange, getCurrentPosition]);

  // 폴링 시작
  const startTracking = () => {
    if (intervalRef.current) {
      return; // 이미 시작됨
    }

    setIsTracking(true);
    
    // 즉시 한 번 실행
    updateLocation();
    
    // 폴링 시작
    intervalRef.current = setInterval(updateLocation, pollingInterval);
    console.log(`위치 추적 시작 - ${pollingInterval / 1000}초 간격`);
  };

  // 폴링 중지
  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
    console.log('위치 추적 중지');
  };

  // 컴포넌트 마운트 시 자동 시작
  useEffect(() => {
    if (intervalRef.current) {
      return; // 이미 시작됨
    }

    setIsTracking(true);
    
    // 즉시 한 번 실행
    updateLocation();
    
    // 폴링 시작
    intervalRef.current = setInterval(updateLocation, pollingInterval);
    console.log(`위치 추적 시작 - ${pollingInterval / 1000}초 간격`);
    
    // 클린업
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsTracking(false);
      console.log('위치 추적 중지');
    };
  }, [pollingInterval, updateLocation]);

  return {
    currentLocation,
    locationError,
    isTracking,
    startTracking,
    stopTracking,
    updateLocation, // 수동으로 위치 업데이트
  };
};
