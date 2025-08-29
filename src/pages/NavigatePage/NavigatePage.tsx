import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import Navbar from '../../components/Navbar';
import { useRouteNavigation } from '../../hooks/useRouteNavigation';
import { useLocationTracking } from '../../hooks/useLocationTracking';
import { Stopwatch, NavigationMap, NavigationActions, markerStyles } from '../../components/NavigatePage';
import type { StopwatchRef } from '../../components/NavigatePage/Stopwatch';

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
  const navigate = useNavigate();
  const stopwatchRef = useRef<StopwatchRef>(null);

  const { startX, startY, points }: NavigateState = location.state || {
    startX: 127.0416,
    startY: 37.5035,
    points: [],
  };

  // 커스텀 훅 사용
  const { currentLocation } = useLocationTracking();

  const start = { lat: startY, lng: startX };
  const waypoints = (points || []).map((point: RoutePoint) => ({ lat: point.pointY, lng: point.pointX }));
  const end = { lat: startY, lng: startX };

  const { routePoints } = useRouteNavigation({
    start,
    end,
    waypoints,
  });

  const handleEndNavigation = () => {
    // 스톱워치에서 타이머 데이터 가져오기
    const timerData = stopwatchRef.current?.getTimerData() || {
      startTime: null,
      duration: 0,
      isRunning: false,
    };

    // 경로 정보와 타이머 데이터를 피드백 페이지로 전달
    const routeData = {
      ...timerData,
      route: points,
      waypoints: [start, ...waypoints, end].filter(Boolean),
    };

    navigate('/feedback', {
      state: routeData,
      replace: true,
    });
  };

  return (
    <>
      <style>{markerStyles}</style>
      <style>{`
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
      <div className="min-h-screen bg-gray-900 pb-16 mt-[45px]">
        {/* 지도 컨테이너 - 모바일 최적화 */}
        <div className="px-2 relative mt-[10px] py-[13px]">
          <div className="rounded-lg overflow-hidden shadow-xl border border-gray-700 relative">
            {/* 스톱워치 오버레이 - 모바일 최적화 */}
            <Stopwatch ref={stopwatchRef} />

            <NavigationMap
              center={start}
              currentLocation={currentLocation}
              start={start}
              end={end}
              waypoints={waypoints}
              routePoints={routePoints}
              className="h-[400px] w-full"
            />
          </div>

          {/* 하단 액션 버튼들 */}
          <NavigationActions onEndNavigation={handleEndNavigation} />
        </div>
      </div>
    </>
  );
};

export default NavigatePage;
