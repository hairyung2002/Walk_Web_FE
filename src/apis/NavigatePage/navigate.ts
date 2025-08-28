import axios from 'axios';

// T-map API 응답 타입 정의
export interface TmapFeature {
  type: 'Feature';
  geometry: {
    type: 'Point' | 'LineString';
    coordinates: number[] | number[][];
  };
  properties: {
    totalDistance?: number;
    totalTime?: number;
    index: number;
    pointIndex?: number;
    lineIndex?: number;
    name: string;
    description: string;
    direction?: string;
    nearPoiName?: string;
    nearPoiX?: string;
    nearPoiY?: string;
    intersectionName?: string;
    facilityType?: string;
    facilityName?: string;
    turnType?: number;
    pointType?: string;
    distance?: number;
    time?: number;
    roadType?: number;
    categoryRoadType?: number;
  };
}

export interface TmapRouteResponse {
  type: 'FeatureCollection';
  features: TmapFeature[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface RouteInfo {
  totalDistance: number;
  totalTime: number;
  path: number[][];
  steps: Array<{
    description: string;
    distance?: number;
    time?: number;
    turnType?: number;
    facilityType?: string;
  }>;
}

/**
 * T-map 보행자 경로 안내 API를 사용하여 경로 검색
 */
export const getWalkingRoute = async (
  startLocation: Location,
  endLocation: Location,
  startName: string = '출발지',
  endName: string = '목적지',
): Promise<RouteInfo> => {
  try {
    console.log('🚶 T-map 보행자 경로 검색 시작:', {
      start: startLocation,
      end: endLocation,
      startName,
      endName,
    });

    // 한글 이름을 URL 인코딩
    const encodedStartName = encodeURIComponent(startName);
    const encodedEndName = encodeURIComponent(endName);

    const requestData = {
      startX: startLocation.lng,
      startY: startLocation.lat,
      endX: endLocation.lng,
      endY: endLocation.lat,
      startName: encodedStartName,
      endName: encodedEndName,
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      searchOption: 0, // 0: 추천, 4: 추천+대로우선, 10: 최단, 30: 최단거리+계단제외
      sort: 'index',
    };

    console.log('📤 T-map API 요청 데이터:', requestData);

    const response = await axios.post<TmapRouteResponse>(
      'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1',
      requestData,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          appKey: import.meta.env.VITE_TMAP_API_KEY,
        },
      },
    );

    console.log('📥 T-map API 응답:', response.data);

    if (!response.data || !response.data.features) {
      throw new Error('경로 정보를 찾을 수 없습니다.');
    }

    // 응답 데이터 파싱
    const features = response.data.features;
    
    // 출발지 정보에서 총 거리와 시간 추출
    const startPoint = features.find((f) => 
      f.properties.pointType === 'SP' && 
      f.properties.totalDistance !== undefined,
    );
    
    const totalDistance = startPoint?.properties.totalDistance || 0;
    const totalTime = startPoint?.properties.totalTime || 0;

    // 경로 좌표 추출 (LineString 타입만)
    const pathCoordinates: number[][] = [];
    features.forEach((feature) => {
      if (feature.geometry.type === 'LineString') {
        const coords = feature.geometry.coordinates as number[][];
        pathCoordinates.push(...coords);
      }
    });

    // 단계별 안내 정보 추출 (Point 타입에서)
    const steps = features
      .filter((f) => f.geometry.type === 'Point' && f.properties.description)
      .map((f) => ({
        description: f.properties.description,
        distance: f.properties.distance,
        time: f.properties.time,
        turnType: f.properties.turnType,
        facilityType: f.properties.facilityType,
      }));

    const routeInfo: RouteInfo = {
      totalDistance,
      totalTime: Math.ceil(totalTime / 60), // 초를 분으로 변환
      path: pathCoordinates,
      steps
    };

    console.log('✅ 경로 정보 파싱 완료:', routeInfo);
    return routeInfo;

  } catch (error) {
    console.error('❌ T-map 경로 검색 실패:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      if (status === 401) {
        throw new Error('T-map API 키가 유효하지 않습니다.');
      } else if (status === 400) {
        throw new Error('경로 검색 요청이 잘못되었습니다.');
      } else if (status === 429) {
        throw new Error('API 호출 한도를 초과했습니다.');
      } else {
        throw new Error(`경로 검색 실패: ${message}`);
      }
    }
    
    throw new Error('경로 검색 중 오류가 발생했습니다.');
  }
};

/**
 * 현재 위치 가져오기
 */
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('브라우저에서 위치 서비스를 지원하지 않습니다.'));
      return;
    }

    console.log('📍 현재 위치 요청 중...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        console.log('✅ 현재 위치 획득:', location);
        resolve(location);
      },
      (error) => {
        console.error('❌ 위치 획득 실패:', error);
        
        let errorMessage = '위치를 가져올 수 없습니다.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 접근 권한이 거부되었습니다.';
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
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5분
      }
    );
  });
};

/**
 * 두 위치 간의 직선 거리 계산 (Haversine formula)
 */
export const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // 미터 단위로 변환
};

/**
 * Turn Type을 한글 설명으로 변환
 */
export const getTurnTypeDescription = (turnType?: number): string => {
  if (!turnType) return '';
  
  const turnTypes: { [key: number]: string } = {
    11: '직진',
    12: '좌회전',
    13: '우회전', 
    14: '유턴',
    16: '8시 방향 좌회전',
    17: '10시 방향 좌회전',
    18: '2시 방향 우회전',
    19: '4시 방향 우회전',
    125: '육교',
    126: '지하보도',
    127: '계단 진입',
    128: '경사로 진입',
    129: '계단+경사로 진입',
    200: '출발지',
    201: '목적지',
    211: '횡단보도',
    212: '좌측 횡단보도',
    213: '우측 횡단보도',
    214: '8시 방향 횡단보도',
    215: '10시 방향 횡단보도',
    216: '2시 방향 횡단보도',
    217: '4시 방향 횡단보도',
    218: '엘리베이터'
  };
  
  return turnTypes[turnType] || '';
};
