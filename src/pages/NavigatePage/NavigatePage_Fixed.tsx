import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './NavigatePage.css';

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
  passList?: string; // 경유지 리스트 (X,Y_X,Y_... 형식)
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

const NavigatePage: React.FC = () => {
  // 경로 관련 상태
  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
  const [totalInfo, setTotalInfo] = useState<string>('경로를 검색하는 중...');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 출발지, 경유지, 도착지
  const [start] = useState<LatLng>({ lat: 37.565991, lng: 126.983937 });
  const [waypoints] = useState<LatLng[]>([
    { lat: 37.5665, lng: 126.985 }, // 예시 경유지1
    { lat: 37.5678, lng: 126.986 }, // 예시 경유지2
  ]);
  const [end] = useState<LatLng>({ lat: 37.563158, lng: 126.98894 });

  // Tmap 보행자 경로 API 호출 (공식 문서 방식)
  const fetchRoute = useCallback(async () => {
    setIsLoading(true);
    setTotalInfo('경로를 검색하는 중...');
    
    const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian';

    // 공식 문서에 따른 요청 바디 구성
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

    // 경유지가 있으면 passList 추가 (공식 문서 형식: X,Y_X,Y_...)
    if (waypoints.length > 0) {
      const passList = waypoints
        .slice(0, 5) // 최대 5개
        .map(wp => `${wp.lng},${wp.lat}`)
        .join('_');
      requestBody.passList = passList;
      console.log('PassList:', passList);
    }

    console.log('Request Body:', requestBody);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          appKey: TMAP_APP_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('API Response Status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        setTotalInfo(`API 오류: ${res.status} - ${errorText}`);
        return;
      }

      const data = await res.json();
      console.log('API Response Data:', data);
      
      if (!data.features || data.features.length === 0) {
        console.error('No route features found');
        setTotalInfo('경로를 찾을 수 없습니다.');
        return;
      }

      // 총 거리/시간 표시
      const firstFeature = data.features.find((f: TmapFeature) => f.properties?.totalDistance);
      if (firstFeature && firstFeature.properties) {
        const distanceKm = ((firstFeature.properties.totalDistance || 0) / 1000).toFixed(1);
        const timeMin = ((firstFeature.properties.totalTime || 0) / 60).toFixed(0);
        setTotalInfo(`총 거리: ${distanceKm}km, 총 시간: ${timeMin}분`);
      }

      // 경로 포인트 추출 (이미 WGS84 좌표)
      const points: LatLng[] = [];
      data.features.forEach((feature: TmapFeature) => {
        if (feature.geometry.type === 'LineString') {
          feature.geometry.coordinates.forEach((coord: number[]) => {
            // WGS84 좌표이므로 변환 불필요
            points.push({ lat: coord[1], lng: coord[0] });
          });
        }
      });

      console.log('Route points extracted:', points.length);
      console.log('First few points:', points.slice(0, 5));
      setRoutePoints(points);
      
      if (points.length === 0) {
        setTotalInfo('경로 좌표를 추출할 수 없습니다.');
      }
    } catch (err) {
      console.error('Tmap API error:', err);
      setTotalInfo(`네트워크 오류: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  }, [start, end, waypoints]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  return (
    <div className="navigate-page">
      <h1>보행자 경로 안내</h1>
      <MapContainer center={start} zoom={17} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={start}>
          <Popup>출발지 (시작점)</Popup>
        </Marker>
        {waypoints.map((wp, idx) => (
          <Marker key={idx} position={wp}>
            <Popup>경유지 {idx + 1}</Popup>
          </Marker>
        ))}
        <Marker position={end}>
          <Popup>도착지 (목적지)</Popup>
        </Marker>
        {routePoints.length > 0 && <Polyline positions={routePoints} color="#ff0000" weight={5} opacity={0.8} />}
      </MapContainer>
      <div className="route-info">
        {isLoading ? '경로 검색 중...' : totalInfo}
        {routePoints.length > 0 && <div className="route-points">경로 포인트: {routePoints.length}개</div>}
      </div>
    </div>
  );
};

export default NavigatePage;
