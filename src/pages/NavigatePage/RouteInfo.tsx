import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../../components/Navbar';
import TabBar from '../../components/TabBar';
import { useRouteNavigation } from '../../hooks/useRouteNavigation';
import { useLocationTracking } from '../../hooks/useLocationTracking';

// 타입 정의
interface RoutePoint {
  pointX: number;
  pointY: number;
}

interface NavigateState {
  startX: number;
  startY: number;
  points: RoutePoint[];
}

const RouteInfoPage = () => {
  // React Router의 state에서 데이터 가져오기
  const location = useLocation();
  const { startX, startY, points }: NavigateState = location.state || {
    startX: 127.0416,
    startY: 37.5035,
    points: [],
  };

  // 커스텀 훅 사용 (먼저 호출해야 함)
  const { currentLocation } = useLocationTracking();

  const start = { lat: startY, lng: startX };
  // 출발지, 경유지, 도착지 설정 (훅에서 관리되는 값들)
  const waypoints = (points || []).map((point: RoutePoint) => ({ lat: point.pointY, lng: point.pointX }));
  const end = { lat: startY, lng: startX }; // 출발지와 같은 위치로 복귀

  const { routePoints, totalInfo, isLoading } = useRouteNavigation({
    start,
    end,
    waypoints,
  });

  // 커스텀 마커 아이콘 생성 함수
  const createNumberIcon = (number: number) => {
    return divIcon({
      html: `<div style="
        background: linear-gradient(135deg, #10b981, #059669);
        border: 3px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      ">${number}</div>`,
      className: 'custom-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // 현재 위치 아이콘
  const currentLocationIcon = divIcon({
    html: `<div style="
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border: 4px solid white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      animation: pulse 2s infinite;
    "></div>`,
    className: 'current-location-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // 출발지/도착지 아이콘
  const startEndIcon = divIcon({
    html: `<div style="
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      border: 3px solid white;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    ">🎯</div>`,
    className: 'start-end-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  const navigate = useNavigate();

  const handleStartNavigation = () => {
    navigate('/navigate', { state: { startX, startY, points } });
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .current-location-icon {
          background: transparent !important;
          border: none !important;
        }
        .start-end-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pb-16 sm:pb-20">
        {/* 헤더 */}
        <div className="max-w-sm sm:max-w-md mx-auto">
          <div className="px-4 pt-16 sm:pt-20 pb-4 sm:pb-6">
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                  네비게이션
                </span>{' '}
                안내
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">실시간 경로 탐색으로 목적지까지 안내해드려요</p>
            </div>

            {/* 경로 정보 카드 */}
            <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 bg-gray-800 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium text-sm sm:text-base">경로 정보</h3>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <p className="text-gray-300 text-xs sm:text-sm">{isLoading ? '경로 검색 중...' : totalInfo}</p>
              {routePoints && routePoints.length > 0 && (
                <p className="text-green-400 text-xs mt-1">경로 포인트: {routePoints.length}개</p>
              )}
            </div>
          </div>
        </div>

        {/* 지도 컨테이너 */}
        <div className="px-4">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <MapContainer
              center={start}
              zoom={17}
              className="h-96 sm:h-[500px] w-full"
              key={`${start.lat}-${start.lng}`}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* 현재 위치 마커 (실시간) */}
              {currentLocation && (
                <Marker position={currentLocation} icon={currentLocationIcon}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-medium text-red-600">� 현재 위치 (실시간)</p>
                      <p className="text-xs text-gray-600">
                        {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* 기본 출발지 마커 (현재 위치가 없을 때만 표시) */}
              {!currentLocation && (
                <Marker position={start} icon={startEndIcon}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-medium text-blue-600">🚀 출발지 (기본값)</p>
                      <p className="text-xs text-gray-600">
                        {start.lat.toFixed(6)}, {start.lng.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* 경유지 마커들 - 숫자 순서 표시 */}
              {waypoints.map((wp, idx) => (
                <Marker key={idx} position={wp} icon={createNumberIcon(idx + 1)}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-medium text-green-600">🌟 경유지 {idx + 1}</p>
                      <p className="text-xs text-gray-600">
                        {wp.lat.toFixed(6)}, {wp.lng.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* 도착지 마커 */}
              <Marker position={end} icon={startEndIcon}>
                <Popup>
                  <div className="text-center">
                    <p className="font-medium text-blue-600">� 도착지 (목적지)</p>
                    <p className="text-xs text-gray-600">
                      {end.lat.toFixed(6)}, {end.lng.toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* 경로 라인 */}
              {routePoints && routePoints.length > 0 && (
                <Polyline
                  positions={routePoints.filter(
                    (point) =>
                      point &&
                      typeof point.lat === 'number' &&
                      typeof point.lng === 'number' &&
                      !isNaN(point.lat) &&
                      !isNaN(point.lng),
                  )}
                  color="#10b981"
                  weight={5}
                  opacity={0.8}
                />
              )}
            </MapContainer>
          </div>
        </div>

        {/* 하단 액션 버튼들 */}
        <div className="px-4 mt-4 sm:mt-6">
          <button
            onClick={() => handleStartNavigation()}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 shadow-lg">
            경로 안내 시작
          </button>
        </div>
      </div>
      <TabBar onTabChange={() => {}} />
    </>
  );
};

export default RouteInfoPage;
