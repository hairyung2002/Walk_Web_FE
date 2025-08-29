import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet 아이콘 문제 해결
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface NavigateState {
  destination: string;
  destinationCoords?: { lat: number; lng: number };
}

interface RouteStep {
  description: string;
  distance?: number;
  time?: number;
}

interface RouteInfo {
  totalDistance: number;
  totalTime: number;
  steps: RouteStep[];
}

const NavigatePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<L.Map | null>(null);
  const currentMarker = useRef<L.Marker | null>(null);
  const destinationMarker = useRef<L.Marker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as NavigateState;
  const destination = state?.destination || '목적지';
  const destinationCoords = state?.destinationCoords;

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || isMapLoaded) return;

    try {
      // Leaflet 지도 생성
      mapObj.current = L.map(mapRef.current).setView([37.5665, 126.978], 15);

      // OpenStreetMap 타일 레이어 추가
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapObj.current);

      setIsMapLoaded(true);
    } catch (err) {
      setError('지도 초기화에 실패했습니다.');
    }
  }, []);

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error('위치 조회 실패:', err);
          setError('현재 위치를 가져올 수 없습니다.');
        }
      );
    }
  }, []);

  // 현재 위치 마커 표시
  useEffect(() => {
    if (!currentLocation || !mapObj.current || !isMapLoaded) return;

    if (currentMarker.current) {
      mapObj.current.removeLayer(currentMarker.current);
    }

    // 빨간색 마커 (현재 위치)
    const redIcon = L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    currentMarker.current = L.marker([currentLocation.lat, currentLocation.lng], { icon: redIcon })
      .addTo(mapObj.current)
      .bindPopup('현재 위치');

    mapObj.current.setView([currentLocation.lat, currentLocation.lng], 16);
  }, [currentLocation, isMapLoaded]);

  // 도착지 마커 표시
  useEffect(() => {
    if (!destinationCoords || !mapObj.current || !isMapLoaded) return;

    if (destinationMarker.current) {
      mapObj.current.removeLayer(destinationMarker.current);
    }

    // 파란색 마커 (도착지)
    const blueIcon = L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="background-color: blue; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    destinationMarker.current = L.marker([destinationCoords.lat, destinationCoords.lng], { icon: blueIcon })
      .addTo(mapObj.current)
      .bindPopup(destination);
  }, [destinationCoords, isMapLoaded, destination]);

  // T-map REST API를 사용한 경로 검색
  const searchRoute = async () => {
    if (!currentLocation || !destinationCoords || !mapObj.current) {
      setError('출발지 또는 도착지 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://apis.openapi.sk.com/tmap/routes/pedestrian', {
        startX: currentLocation.lng.toString(),
        startY: currentLocation.lat.toString(),
        endX: destinationCoords.lng.toString(),
        endY: destinationCoords.lat.toString(),
        reqCoordType: 'WGS84GEO',
        resCoordType: 'WGS84GEO',
        startName: '현재위치',
        endName: destination
      }, {
        headers: {
          'appKey': import.meta.env.VITE_TMAP_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      const features = data.features;
      
      if (!features || features.length === 0) {
        throw new Error('경로를 찾을 수 없습니다.');
      }

      // 경로 정보 추출
      const routeCoords: [number, number][] = [];
      let totalDistance = 0;
      let totalTime = 0;
      const steps: RouteStep[] = [];

      features.forEach((feature: any) => {
        if (feature.geometry.type === 'LineString') {
          const coords = feature.geometry.coordinates;
          coords.forEach((coord: number[]) => {
            routeCoords.push([coord[1], coord[0]]); // Leaflet은 [lat, lng] 순서
          });
        }
        
        if (feature.properties) {
          const props = feature.properties;
          if (props.totalDistance) totalDistance = props.totalDistance;
          if (props.totalTime) totalTime = props.totalTime;
          if (props.description && props.description !== '도보') {
            steps.push({
              description: props.description,
              distance: props.distance,
              time: props.time
            });
          }
        }
      });

      // 기존 경로 제거
      if (routeLine.current) {
        mapObj.current.removeLayer(routeLine.current);
      }

      // 새 경로 표시
      if (routeCoords.length > 0) {
        routeLine.current = L.polyline(routeCoords, {
          color: 'red',
          weight: 5,
          opacity: 0.7
        }).addTo(mapObj.current);

        // 지도 범위 조정 (모든 마커와 경로가 보이도록)
        const group = new L.FeatureGroup([currentMarker.current!, destinationMarker.current!, routeLine.current]);
        mapObj.current.fitBounds(group.getBounds().pad(0.1));
      }

      setRouteInfo({
        totalDistance,
        totalTime,
        steps
      });

    } catch (err: any) {
      console.error('경로 검색 실패:', err);
      setError(err.response?.data?.error?.message || '경로 검색에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 자동 경로 검색
  useEffect(() => {
    if (currentLocation && destinationCoords && isMapLoaded) {
      searchRoute();
    }
  }, [currentLocation, destinationCoords, isMapLoaded]);

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    }
    return `${Math.round(distance)}m`;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (minutes > 0) {
      return `${minutes}분 ${seconds > 0 ? seconds + '초' : ''}`;
    }
    return `${seconds}초`;
  };

  return (
    <div className="navigate-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="navigate-header" style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginBottom: '0.5rem'
          }}
        >
          ← 뒤로
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{destination}까지의 경로</h1>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderLeft: '4px solid #c62828'
        }}>
          {error}
        </div>
      )}

      <div 
        ref={mapRef} 
        style={{
          flex: 1,
          minHeight: '300px',
          backgroundColor: '#f0f0f0'
        }}
      />

      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '1rem',
          borderRadius: '5px'
        }}>
          경로 검색 중...
        </div>
      )}

      {routeInfo && (
        <div style={{ padding: '1rem', backgroundColor: 'white', borderTop: '1px solid #ddd', maxHeight: '40vh', overflowY: 'auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>경로 정보</h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <span>총 거리: <strong>{formatDistance(routeInfo.totalDistance)}</strong></span>
              <span>예상 시간: <strong>{formatTime(routeInfo.totalTime)}</strong></span>
            </div>
          </div>

          {routeInfo.steps.length > 0 && (
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>길안내</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {routeInfo.steps.map((step, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '0.5rem 0',
                    borderBottom: index < routeInfo.steps.length - 1 ? '1px solid #eee' : 'none'
                  }}>
                    <div style={{
                      minWidth: '20px',
                      height: '20px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem' }}>{step.description}</div>
                      {step.distance && (
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {formatDistance(step.distance)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={searchRoute}
              disabled={!currentLocation || !destinationCoords || isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: isLoading ? '#ccc' : '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? '검색 중...' : '경로 재검색'}
            </button>
            <button 
              disabled={!routeInfo}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: routeInfo ? '#4caf50' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: routeInfo ? 'pointer' : 'not-allowed'
              }}
            >
              내비게이션 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigatePage;
