// 임시 위치 서비스 (브라우저 Geolocation API만 사용)
import type { Coordinates } from '../types/kakaoMap';

/**
 * 브라우저 Geolocation API를 사용해 현재 위치 가져오기
 */
export const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1분간 캐시된 위치 사용
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('✅ 현재 위치 가져오기 성공:', coordinates);
        resolve(coordinates);
      },
      (error) => {
        let errorMessage = '위치를 가져올 수 없습니다.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 접근이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 요청 시간이 초과되었습니다.';
            break;
        }
        
        console.error('❌ 위치 가져오기 실패:', errorMessage);
        reject(new Error(errorMessage));
      },
      options,
    );
  });
};

/**
 * 위도/경도를 대략적인 주소로 변환 (Reverse Geocoding 대체)
 * 카카오맵 API 없이 대략적인 지역명만 제공
 */
export const coordsToSimpleAddress = async (coordinates: Coordinates): Promise<string> => {
  // 대한민국 주요 지역의 대략적인 좌표 범위
  const regions = [
    { name: '서울특별시', lat: [37.4, 37.7], lng: [126.7, 127.2] },
    { name: '부산광역시', lat: [35.0, 35.3], lng: [128.9, 129.4] },
    { name: '인천광역시', lat: [37.2, 37.6], lng: [126.4, 126.9] },
    { name: '대구광역시', lat: [35.7, 36.0], lng: [128.4, 128.8] },
    { name: '대전광역시', lat: [36.2, 36.5], lng: [127.2, 127.6] },
    { name: '광주광역시', lat: [35.0, 35.3], lng: [126.7, 127.0] },
    { name: '울산광역시', lat: [35.4, 35.7], lng: [129.1, 129.5] },
    { name: '세종특별자치시', lat: [36.4, 36.6], lng: [127.2, 127.4] },
    { name: '경기도', lat: [36.8, 38.3], lng: [126.4, 127.9] },
    { name: '강원도', lat: [37.0, 38.6], lng: [127.1, 129.4] },
    { name: '충청북도', lat: [36.0, 37.2], lng: [127.4, 128.7] },
    { name: '충청남도', lat: [35.9, 37.0], lng: [126.1, 127.8] },
    { name: '전라북도', lat: [35.0, 36.3], lng: [126.4, 127.9] },
    { name: '전라남도', lat: [33.8, 35.8], lng: [125.5, 127.6] },
    { name: '경상북도', lat: [35.4, 37.5], lng: [128.0, 129.6] },
    { name: '경상남도', lat: [34.4, 36.0], lng: [127.4, 129.2] },
    { name: '제주특별자치도', lat: [33.1, 33.6], lng: [126.1, 126.9] },
  ];

  const { latitude, longitude } = coordinates;

  // 좌표에 맞는 지역 찾기
  for (const region of regions) {
    if (
      latitude >= region.lat[0] &&
      latitude <= region.lat[1] &&
      longitude >= region.lng[0] &&
      longitude <= region.lng[1]
    ) {
      return region.name;
    }
  }

  // 일치하는 지역이 없으면 대략적인 좌표 정보 반환
  return `위도 ${latitude.toFixed(2)}, 경도 ${longitude.toFixed(2)}`;
};

/**
 * 현재 위치와 대략적인 주소 가져오기
 */
export const getCurrentLocationWithSimpleAddress = async (): Promise<{
  coordinates: Coordinates;
  address: string;
}> => {
  try {
    console.log('📍 현재 위치 가져오기 시작...');
    
    const coordinates = await getCurrentPosition();
    const address = await coordsToSimpleAddress(coordinates);
    
    console.log('✅ 위치 정보 가져오기 완료:', { coordinates, address });
    
    return {
      coordinates,
      address,
    };
  } catch (error) {
    console.error('❌ 위치 정보 가져오기 실패:', error);
    throw error;
  }
};
