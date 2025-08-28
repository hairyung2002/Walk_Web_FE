// 임시 위치 훅 (카카오맵 API 없이 작동)
import { useState } from 'react';
import { getCurrentLocationWithSimpleAddress } from '../utils/simpleLocationUtils';
import type { Coordinates } from '../types/kakaoMap';

export const useSimpleLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [detectedAddress, setDetectedAddress] = useState<string>('');

  const getCurrentLocationWithAddr = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getCurrentLocationWithSimpleAddress();
      
      setCoordinates(result.coordinates);
      setDetectedAddress(result.address);
      
      console.log('✅ 위치 정보 업데이트 완료:', result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '위치를 가져올 수 없습니다.';
      setError(errorMessage);
      console.error('❌ 위치 가져오기 실패:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    getCurrentLocationWithAddr,
    clearError,
    coordinates,
    detectedAddress,
    isLoading,
    error,
  };
};
