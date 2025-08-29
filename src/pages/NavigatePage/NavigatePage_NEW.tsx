import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../../components/Navbar';
import TabBar from '../../components/TabBar';
import { useRouteNavigation } from '../../hooks/useRouteNavigation';
import { useLocationTracking } from '../../hooks/useLocationTracking';

interface LatLng {
  lat: number;
  lng: number;
}

const NavigatePage: React.FC = () => {
  // 고정된 경로 설정
  const [waypoints] = useState<LatLng[]>([
    { lat: 37.5665, lng: 126.985 }, // 예시 경유지1
    { lat: 37.5678, lng: 126.986 }, // 예시 경유지2
  ]);
  const [end] = useState<LatLng>({ lat: 37.563158, lng: 126.98894 });
  const defaultStart = { lat: 37.565991, lng: 126.983937 };

  // 실시간 위치 추적 (폴링 방식)
  const { currentLocation, locationError, isTracking } = useLocationTracking({
    pollingInterval: 5000, // 5초마다 폴링
    minDistanceChange: 10, // 10m 이상 변화시만 업데이트
    enableHighAccuracy: false, // 배터리 절약
  });

  // 출발지 결정 (현재 위치가 있으면 사용, 없으면 기본값)
  const start = currentLocation || defaultStart;

  // 경로 탐색 (최초 1회만)
  const { routePoints, totalInfo, isLoading, refetchRoute } = useRouteNavigation({
    start,
    end,
    waypoints,
  });

  // 지도 중심점 계산
  const mapCenter: LatLng = currentLocation || start;

  // Leaflet 아이콘 설정 (기본 마커 아이콘 문제 해결)
  const customIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  // 경로 재탐색 핸들러
  const handleRefetchRoute = () => {
    refetchRoute();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pb-16 sm:pb-20">
        <div className="max-w-sm sm:max-w-md mx-auto px-4 pt-16 sm:pt-20 pb-4 sm:pb-6">
          <div className="space-y-4 sm:space-y-6">
            {/* 페이지 제목 */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                  네비게이션
                </span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">실시간 위치로 최적 경로를 안내합니다</p>
            </div>

            {/* 상태 정보 */}
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">위치 추적 상태</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs ${isTracking ? 'text-green-400' : 'text-red-400'}`}>
                    {isTracking ? '추적 중' : '중지됨'}
                  </span>
                </div>
              </div>

              {/* 현재 위치 정보 */}
              {currentLocation && (
                <div className="text-xs text-gray-400">
                  현재 위치: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </div>
              )}

              {/* 위치 오류 표시 */}
              {locationError && (
                <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                  {locationError}
                </div>
              )}

              {/* 경로 정보 */}
              <div className="border-t border-gray-700 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">경로 정보</span>
                  {isLoading && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-green-400">탐색 중...</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-200">{totalInfo}</p>
              </div>

              {/* 경로 재탐색 버튼 */}
              <button
                onClick={handleRefetchRoute}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '탐색 중...' : '경로 재탐색'}
              </button>
            </div>

            {/* 지도 */}
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">실시간 경로 안내</h2>
              <div className="relative">
                <div className="h-64 sm:h-80 rounded-lg overflow-hidden">
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* 현재 위치 마커 */}
                    {currentLocation && (
                      <Marker position={currentLocation} icon={customIcon}>
                        <Popup>현재 위치</Popup>
                      </Marker>
                    )}

                    {/* 출발지 마커 (현재 위치가 없을 때만) */}
                    {!currentLocation && (
                      <Marker position={start} icon={customIcon}>
                        <Popup>출발지</Popup>
                      </Marker>
                    )}

                    {/* 경유지 마커들 */}
                    {waypoints.map((waypoint, index) => (
                      <Marker key={index} position={waypoint} icon={customIcon}>
                        <Popup>경유지 {index + 1}</Popup>
                      </Marker>
                    ))}

                    {/* 도착지 마커 */}
                    <Marker position={end} icon={customIcon}>
                      <Popup>도착지</Popup>
                    </Marker>

                    {/* 경로 선 */}
                    {routePoints.length > 0 && (
                      <Polyline 
                        positions={routePoints} 
                        color="blue" 
                        weight={5} 
                        opacity={0.7}
                      />
                    )}
                  </MapContainer>
                </div>

                {/* 지도 설명 */}
                <div className="mt-3 text-xs text-gray-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>파란선: 추천 경로</span>
                  </div>
                  {isTracking && (
                    <div className="text-green-400">
                      • 실시간 위치 추적 중 (5초 간격)
                    </div>
                  )}
                  <div className="text-gray-500">
                    • 위치는 {currentLocation ? '실제 GPS' : '기본값'} 기준
                  </div>
                </div>
              </div>
            </div>

            {/* 경로 상세 정보 */}
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">경로 상세</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">출발지</span>
                  <span className="text-white text-sm">
                    {currentLocation ? '현재 위치' : '기본 출발지'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">경유지</span>
                  <span className="text-white text-sm">{waypoints.length}개</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">도착지</span>
                  <span className="text-white text-sm">목표 지점</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">경로 포인트</span>
                  <span className="text-white text-sm">{routePoints.length}개</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TabBar onTabChange={() => {}} />
    </>
  );
};

export default NavigatePage;
