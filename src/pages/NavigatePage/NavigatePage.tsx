import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Tmap v3 전역 타입
declare global {
  interface Window {
    Tmapv3: any;
  }
}

interface NavigateState {
  destination: string;
  destinationCoords?: { lat: number; lng: number };
}

interface RouteStep {
  description: string;
  distance?: number;
  time?: number;
  turnType?: string;
}

interface RouteInfo {
  path: [number, number][];
  steps: RouteStep[];
  totalDistance: number;
  totalTime: number;
}

const NavigatePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const currentMarker = useRef<any>(null);
  const destinationMarker = useRef<any>(null);
  const routeLine = useRef<any>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const state = location.state as NavigateState;
  const destinationCoords = state?.destinationCoords;

  // Tmap 스크립트 로드
  useEffect(() => {
    if (window.Tmapv3) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://apis.openapi.sk.com/tmap/vectorjs?version=1&appKey=bozGB4KHwEa9pvFOm5Q4Z3A78JBt5KXL58U7Ph4X`;
    script.async = false;

    script.onload = () => {
      console.log('✅ Tmap 스크립트 로드 완료');
      setIsMapLoaded(true);
    };

    script.onerror = (err) => {
      console.error('❌ Tmap 스크립트 로드 실패:', err);
      alert('지도를 불러올 수 없습니다.');
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.Tmapv3) return;

    mapRef.current.innerHTML = '';
    mapInstance.current = new window.Tmapv3.Map(mapRef.current, {
      center: new window.Tmapv3.LatLng(37.566481622437934, 126.98502302169841), // 기본 서울
      width: '100%',
      height: '100%',
      zoom: 16,
    });
  }, [isMapLoaded]);

  // 현재 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (err) => console.error('위치 가져오기 실패:', err),
    );
  }, []);

  // 현재 위치 마커 표시
  useEffect(() => {
    if (!currentLocation || !mapInstance.current || !window.Tmapv3) return;

    if (currentMarker.current) currentMarker.current.setMap(null);

    currentMarker.current = new window.Tmapv3.Marker({
      position: new window.Tmapv3.LatLng(currentLocation.lat, currentLocation.lng),
      map: mapInstance.current,
      icon: 'http://tmapapis.sktelecom.com/upload/tmap/marker/pin_r_m_s.png',
      iconSize: new window.Tmapv3.Size(24, 38),
    });

    mapInstance.current.setCenter(new window.Tmapv3.LatLng(currentLocation.lat, currentLocation.lng));
    mapInstance.current.setZoom(16);
  }, [currentLocation, isMapLoaded]);

  // 목적지 마커 표시
  useEffect(() => {
    if (!destinationCoords || !mapInstance.current || !window.Tmapv3) return;

    if (destinationMarker.current) destinationMarker.current.setMap(null);

    destinationMarker.current = new window.Tmapv3.Marker({
      position: new window.Tmapv3.LatLng(destinationCoords.lat, destinationCoords.lng),
      map: mapInstance.current,
      icon: 'http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_e.png',
      iconSize: new window.Tmapv3.Size(24, 38),
    });
  }, [destinationCoords, isMapLoaded]);

  // 경로 표시
  const drawRoute = (coords: [number, number][]) => {
    if (!mapInstance.current || !window.Tmapv3) return;

    if (routeLine.current) routeLine.current.setMap(null);

    const latlngs = coords.map((c) => new window.Tmapv3.LatLng(c[1], c[0]));

    routeLine.current = new window.Tmapv3.Polyline({
      path: latlngs,
      strokeColor: '#FF0000',
      strokeWeight: 4,
      strokeOpacity: 0.8,
      map: mapInstance.current,
    });

    if (latlngs.length > 0) mapInstance.current.setCenter(latlngs[Math.floor(latlngs.length / 2)]);
  };

  // 경로 API 호출
  const searchRoute = async () => {
    if (!currentLocation || !destinationCoords) return;
    try {
      const res = await fetch('https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          appKey: 'bozGB4KHwEa9pvFOm5Q4Z3A78JBt5KXL58U7Ph4X',
        },
        body: JSON.stringify({
          startX: currentLocation.lng.toString(),
          startY: currentLocation.lat.toString(),
          endX: destinationCoords.lng.toString(),
          endY: destinationCoords.lat.toString(),
          startName: '출발지',
          endName: '도착지',
          searchOption: '10',
        }),
      });
      const data = await res.json();
      const coords: [number, number][] = [];

      data.features.forEach((feature: any) => {
        if (feature.geometry.type === 'LineString') {
          feature.geometry.coordinates.forEach((coord: any) => {
            coords.push([coord[0], coord[1]]);
          });
        }
      });

      drawRoute(coords);

      setRouteInfo({
        path: coords,
        steps: [], // 필요 시 steps 파싱
        totalDistance: data.totalDistance || 0,
        totalTime: data.totalTime || 0,
      });
    } catch (err) {
      console.error('경로 API 오류:', err);
      alert('경로를 불러올 수 없습니다.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1>T-map 네비게이션</h1>
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-700 rounded">
          뒤로
        </button>
      </header>

      <div ref={mapRef} className="flex-1 w-full h-full" />

      <footer className="p-4 bg-gray-800 flex space-x-2">
        <button
          onClick={searchRoute}
          disabled={!currentLocation || !destinationCoords}
          className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50">
          경로 검색
        </button>
        <button
          onClick={() => {
            if (currentLocation && mapInstance.current && window.Tmapv3)
              mapInstance.current.setCenter(new window.Tmapv3.LatLng(currentLocation.lat, currentLocation.lng));
          }}
          className="bg-blue-600 text-white py-2 px-4 rounded">
          현재 위치
        </button>
      </footer>
    </div>
  );
};

export default NavigatePage;
