import type { TmapLatLng, TmapRouteResponse } from '../types/tmap';

// T-map API 키
const TMAP_API_KEY = import.meta.env.VITE_TMAP_API_KEY;

// T-map 스크립트 로드 (올바른 방식)
export const loadTmapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('🔑 T-map API 키:', TMAP_API_KEY ? '설정됨' : '누락됨');
    
    if (!TMAP_API_KEY) {
      console.error('❌ T-map API 키가 환경변수에 설정되지 않았습니다');
      reject(new Error('T-map API 키가 누락되었습니다'));
      return;
    }

    // 기존 스크립트 제거
    const existingScript = document.querySelector('script[src*="apis.openapi.sk.com"]');
    if (existingScript) {
      existingScript.remove();
      console.log('🗑️ 기존 T-map 스크립트 제거됨');
    }

    // window.Tmapv2가 이미 완전히 로드되어 있는지 확인
    if (window.Tmapv2 && window.Tmapv2.Map && window.Tmapv2.LatLng) {
      console.log('✅ T-map이 이미 완전히 로드됨');
      resolve();
      return;
    }

    console.log('📡 T-map 스크립트 로딩 시작...');
    const script = document.createElement('script');
    
    // 다양한 T-map API URL 시도
    // 방법 1: 기본 v2 API
    script.src = `https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=${TMAP_API_KEY}`;
    
    // 방법 2 (대안): 다른 버전 URL (필요시 주석 해제)
    // script.src = `https://apis.sktelecom.com/tmap/js?version=1&appkey=${TMAP_API_KEY}`;
    
    script.type = 'text/javascript';
    script.async = false; // 동기적 로딩으로 변경
    
    let checkCount = 0;
    const maxChecks = 100;
    
    const checkTmapReady = () => {
      checkCount++;
      console.log(`🔄 T-map API 완전성 확인 중... (${checkCount}/${maxChecks})`);
      
      if (window.Tmapv2) {
        console.log('📊 현재 Tmapv2 속성들:', Object.keys(window.Tmapv2));
        console.log('📊 현재 Tmapv2 모든 속성들:', Object.getOwnPropertyNames(window.Tmapv2));
        
        // 핵심 클래스들이 로드되었는지 확인
        const hasMap = window.Tmapv2.Map && typeof window.Tmapv2.Map === 'function';
        const hasLatLng = window.Tmapv2.LatLng && typeof window.Tmapv2.LatLng === 'function';
        const hasMarker = window.Tmapv2.Marker && typeof window.Tmapv2.Marker === 'function';
        
        console.log('🗺️ Map 클래스 사용 가능:', hasMap);
        console.log('📍 LatLng 클래스 사용 가능:', hasLatLng);
        console.log('📌 Marker 클래스 사용 가능:', hasMarker);
        
        if (hasMap && hasLatLng) {
          console.log('✅ T-map API 완전히 로드됨');
          resolve();
          return;
        }
      }
      
      if (checkCount >= maxChecks) {
        console.error('❌ T-map API 로드 시간 초과');
        console.error('🔍 최종 Tmapv2 상태:', window.Tmapv2);
        reject(new Error('T-map API가 완전히 로드되지 않았습니다'));
      } else {
        setTimeout(checkTmapReady, 200);
      }
    };
    
    script.onload = () => {
      console.log('✅ T-map 스크립트 파일 로딩 완료');
      
      // 스크립트 로드 후 API 초기화를 기다림
      setTimeout(checkTmapReady, 1000);
    };
    
    script.onerror = (error) => {
      console.error('❌ T-map 스크립트 로딩 실패:', error);
      console.error('🌐 요청 URL:', script.src);
      reject(new Error('T-map 스크립트 로딩 실패'));
    };

    document.head.appendChild(script);
    console.log('📝 T-map 스크립트가 DOM에 추가됨');
    console.log('🌐 스크립트 URL:', script.src);
  });
};

// 보행자 경로 검색
export const getWalkingRoute = async (
  startPoint: TmapLatLng,
  endPoint: TmapLatLng,
): Promise<TmapRouteResponse> => {
  const response = await fetch('https://apis.openapi.sk.com/tmap/routes/pedestrian', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'appKey': TMAP_API_KEY,
    },
    body: JSON.stringify({
      startX: startPoint.lng.toString(),
      startY: startPoint.lat.toString(),
      endX: endPoint.lng.toString(),
      endY: endPoint.lat.toString(),
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      startName: '출발지',
      endName: '도착지',
    }),
  });

  if (!response.ok) {
    throw new Error('경로 검색에 실패했습니다');
  }

  return response.json();
};

// 좌표를 주소로 변환 (T-map Reverse Geocoding)
export const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
  const response = await fetch(
    `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&coordType=WGS84GEO&addressType=A10&lon=${lng}&lat=${lat}&appKey=${TMAP_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('주소 변환에 실패했습니다');
  }

  const data = await response.json();
  return data.addressInfo?.fullAddress || '주소를 찾을 수 없습니다';
};

// 주소를 좌표로 변환 (T-map Geocoding)
export const getCoordsFromAddress = async (address: string): Promise<TmapLatLng> => {
  const response = await fetch(
    `https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result&coordType=WGS84GEO&fullAddr=${encodeURIComponent(address)}&appKey=${TMAP_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('좌표 변환에 실패했습니다');
  }

  const data = await response.json();
  const coordinate = data.coordinate?.[0];
  
  if (!coordinate) {
    throw new Error('좌표를 찾을 수 없습니다');
  }

  return {
    lat: parseFloat(coordinate.lat),
    lng: parseFloat(coordinate.lon),
  };
};

// 현재 위치 가져오기
export const getCurrentLocation = (): Promise<TmapLatLng> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('브라우저에서 위치 서비스를 지원하지 않습니다'));
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
        reject(new Error(`위치 정보를 가져올 수 없습니다: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  });
};
