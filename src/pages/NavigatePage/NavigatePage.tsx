import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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

const NavigatePage = () => {
  // React Router의 state에서 데이터 가져오기
  const location = useLocation();
  const { startX, startY, points }: NavigateState = location.state || {
    startX: 127.0416,
    startY: 37.5035,
    points: [],
  };

  // 커스텀 훅 사용 (먼저 호출해야 함)
  const { currentLocation } = useLocationTracking();

  // 타이머 상태 관리 (리렌더링 최소화)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // 타이머 로직 (DOM 직접 업데이트로 리렌더링 방지)
  useEffect(() => {
    if (isTimerRunning && startTime) {
      intervalRef.current = window.setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const formattedTime = formatTime(elapsedSeconds);

        // DOM 직접 업데이트 (리렌더링 없음)
        if (timerDisplayRef.current) {
          timerDisplayRef.current.textContent = formattedTime;
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerRunning, startTime]);

  // 시간 포맷팅 함수 (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 현재 경과 시간 계산 함수
  const getCurrentElapsedTime = () => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  // 타이머 시작/일시정지
  const toggleTimer = () => {
    if (!isTimerRunning) {
      if (!startTime) {
        // 처음 시작
        setStartTime(Date.now());
      } else {
        // 재개 - 기존 경과 시간을 고려
        const currentElapsed = getCurrentElapsedTime();
        setStartTime(Date.now() - currentElapsed * 1000);
      }
      setIsTimerRunning(true);
    } else {
      // 일시정지
      setIsTimerRunning(false);
    }
  };

  // 타이머 리셋
  const resetTimer = () => {
    setIsTimerRunning(false);
    setStartTime(null);
    // DOM 직접 업데이트
    if (timerDisplayRef.current) {
      timerDisplayRef.current.textContent = '00:00';
    }
  };

  const start = { lat: startY, lng: startX };
  // 출발지, 경유지, 도착지 설정 (훅에서 관리되는 값들)
  const waypoints = (points || []).map((point: RoutePoint) => ({ lat: point.pointY, lng: point.pointX }));
  const end = { lat: startY, lng: startX }; // 출발지와 같은 위치로 복귀
  
  const { routePoints } = useRouteNavigation({
    start,
    end,
    waypoints,
  });

  // 커스텀 마커 아이콘 생성 함수 (모바일 최적화)
  const createNumberIcon = (number: number) => {
    return divIcon({
      html: `<div style="
        background: linear-gradient(135deg, #10b981, #059669);
        border: 2px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${number}</div>`,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // 현재 위치 아이콘 (모바일 최적화)
  const currentLocationIcon = divIcon({
    html: `<div style="
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border: 3px solid white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
      animation: pulse 2s infinite;
    "></div>`,
    className: 'current-location-icon',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  // 출발지/도착지 아이콘
  const startEndIcon = divIcon({
    html: `<div style="
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      border: 2px solid white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">🎯</div>`,
    className: 'start-end-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

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
        /* 스톱워치 오버레이가 항상 최상단에 보이도록 */
        .stopwatch-overlay {
          z-index: 10000 !important;
          position: relative !important;
        }
        /* Leaflet 지도 컨테이너의 z-index 제한 */
        .leaflet-container {
          z-index: 1 !important;
        }
      `}</style>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pb-16">
        {/* 컴팩트한 헤더 - 모바일 최적화 */}
        <div className="px-3 pt-16 pb-2">
          <div className="text-center mb-3">
            <h1 className="text-xl font-bold text-white mb-1 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                네비게이션
              </span>{' '}
              안내
            </h1>
            <p className="text-gray-400 text-xs">실시간 경로 탐색으로 목적지까지 안내해드려요</p>
          </div>
        </div>

        {/* 지도 컨테이너 - 모바일 최적화 */}
        <div className="px-2 relative">
          <div className="rounded-lg overflow-hidden shadow-xl border border-gray-700 relative">
            {/* 스톱워치 오버레이 - 모바일 최적화 */}
            <div className="absolute top-2 left-2 right-2 z-[1000] stopwatch-overlay">
              <div className="rounded-lg p-2 bg-gray-800/95 border border-gray-700 backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-between">
                  {/* 상태 표시 - 컴팩트 */}
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        isTimerRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                    <span className="text-white text-xs font-medium">
                      {isTimerRunning ? '🏃‍♂️' : '⏸️'}
                    </span>
                  </div>

                  {/* 시간 디스플레이 - 컴팩트 */}
                  <div
                    ref={timerDisplayRef}
                    className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 font-mono tracking-wider">
                    00:00
                  </div>

                  {/* 컨트롤 버튼들 - 모바일 최적화 */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={toggleTimer}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                        isTimerRunning
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}>
                      {isTimerRunning ? '⏸️' : '▶️'}
                    </button>

                    <button
                      onClick={resetTimer}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs font-medium transition-all duration-200">
                      🔄
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <MapContainer center={start} zoom={17} className="h-[400px] w-full" key={`${start.lat}-${start.lng}`}>
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

          {/* 하단 액션 버튼들 */}
          <div className="px-3 py-2 bg-white border-t">
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                <span>📍</span>
                <span>내 위치</span>
              </button>
              <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                <span>🧭</span>
                <span>경로 안내</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <TabBar onTabChange={() => {}} />
    </>
  );
};

export default NavigatePage;
