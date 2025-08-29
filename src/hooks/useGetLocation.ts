// import { useState, useCallback } from 'react';
// import type { Coordinates } from '../types/kakaoMap';
// import {
//   getCurrentPosition,
//   getCurrentLocationWithAddress,
//   coordsToAddress,
//   addressToCoords,
//   searchAddressWithCoords,
// } from '../utils/kakaoMapUtils';

// interface UseLocationReturn {
//   // 상태
//   coordinates: Coordinates | null;
//   address: string;
//   isLoading: boolean;
//   error: string | null;

//   // 액션
//   getCurrentLocation: () => Promise<void>;
//   getCurrentLocationWithAddr: () => Promise<void>;
//   searchAddress: (searchQuery: string) => Promise<void>;
//   convertCoordsToAddress: (coords: Coordinates) => Promise<void>;
//   convertAddressToCoords: (addr: string) => Promise<void>;
//   clearError: () => void;
//   reset: () => void;
// }

// export const useGetLocation = (): UseLocationReturn => {
//   const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
//   const [address, setAddress] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // 에러 초기화
//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   // 모든 상태 초기화
//   const reset = useCallback(() => {
//     setCoordinates(null);
//     setAddress('');
//     setError(null);
//     setIsLoading(false);
//   }, []);

//   // 현재 위치 좌표만 가져오기
//   const getCurrentLocation = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const coords = await getCurrentPosition();
//       setCoordinates(coords);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : '위치 정보를 가져올 수 없습니다.';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // 현재 위치 + 주소 함께 가져오기
//   const getCurrentLocationWithAddr = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await getCurrentLocationWithAddress();
//       setCoordinates(result.coords);
//       setAddress(result.address);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : '위치 정보를 가져올 수 없습니다.';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // 주소 검색하여 좌표와 정확한 주소명 가져오기
//   const searchAddress = useCallback(async (searchQuery: string) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await searchAddressWithCoords(searchQuery);
//       setCoordinates(result.coords);
//       setAddress(result.address);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : '주소 검색에 실패했습니다.';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // 좌표를 주소로 변환
//   const convertCoordsToAddress = useCallback(async (coords: Coordinates) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const addr = await coordsToAddress(coords);
//       setCoordinates(coords);
//       setAddress(addr);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : '주소 변환에 실패했습니다.';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // 주소를 좌표로 변환
//   const convertAddressToCoords = useCallback(async (addr: string) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const coords = await addressToCoords(addr);
//       setCoordinates(coords);
//       setAddress(addr);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : '좌표 변환에 실패했습니다.';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return {
//     // 상태
//     coordinates,
//     address,
//     isLoading,
//     error,

//     // 액션
//     getCurrentLocation,
//     getCurrentLocationWithAddr,
//     searchAddress,
//     convertCoordsToAddress,
//     convertAddressToCoords,
//     clearError,
//     reset,
//   };
// };

// export default useGetLocation;
