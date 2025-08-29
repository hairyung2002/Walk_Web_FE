import type { Coordinates } from '../types/kakaoMap';

export const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  });
};

export const getCurrentLocationWithAddress = async (): Promise<{
  coords: Coordinates;
  address: string;
}> => {
  const coords = await getCurrentPosition();
  const address = await coordsToAddress(coords);
  return { coords, address };
};

export const coordsToAddress = async (coords: Coordinates): Promise<string> => {
  // Kakao API를 사용한 좌표 -> 주소 변환
  // 실제 구현시 Kakao REST API 키가 필요합니다
  return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
};

export const addressToCoords = async (_address: string): Promise<Coordinates> => {
  // Kakao API를 사용한 주소 -> 좌표 변환
  // 실제 구현시 Kakao REST API 키가 필요합니다
  return { lat: 37.5665, lng: 126.978 }; // 기본값: 서울시청
};

export const searchAddressWithCoords = async (coords: Coordinates): Promise<string[]> => {
  // Kakao API를 사용한 주소 검색
  // 실제 구현시 Kakao REST API 키가 필요합니다
  return [`주소: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`];
};
