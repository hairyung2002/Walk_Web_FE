import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';
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

  // URL 파라미터에서 데이터 가져오기 (새로고침 지원)
  const getDataFromUrlParams = (): NavigateState => {
    const urlParams = new URLSearchParams(window.location.search);
    const startX = parseFloat(urlParams.get('startX') || '127.0416');
    const startY = parseFloat(urlParams.get('startY') || '37.5035');
    const pointsParam = urlParams.get('points');
    
    let points: RoutePoint[] = [];
    if (pointsParam) {
      try {
        points = JSON.parse(decodeURIComponent(pointsParam));
      } catch (error) {
        console.error('URL 파라미터에서 points 파싱 실패:', error);
        points = [];
      }
    }
    
    return { startX, startY, points };
  };

  // location.state 우선, 없으면 URL 파라미터에서 가져오기
  const routeData = location.state || getDataFromUrlParams();
  const { startX, startY, points } = routeData;

  // 현재 진행 상태 관리
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  // 커스텀 훅 사용
  const { currentLocation } = useLocationTracking();

  // 동적 경유지 계산 함수
  const getDynamicWaypoints = () => {
    if (!points || points.length === 0) return { currentWaypoints: [], currentDestination: null };

    const windowSize = 4; // 한 번에 보여줄 경유지 개수
    const startIndex = currentWaypointIndex;
    const endIndex = Math.min(startIndex + windowSize, points.length);
    
    // 현재 보여줄 경유지들 (최대 4개)
    const currentWaypoints: Array<{ lat: number; lng: number; originalIndex: number }> = points
      .slice(startIndex, endIndex)
      .map((point: RoutePoint, index: number) => ({
        lat: point.pointY,
        lng: point.pointX,
        originalIndex: startIndex + index,
      }));

    // 현재 목표 도착지 (다음 경유지 또는 최종 도착지)
    let currentDestination;
    if (endIndex < points.length) {
      // 아직 경유지가 더 있으면 다음 경유지가 도착지
      const nextPoint = points[endIndex];
      currentDestination = { lat: nextPoint.pointY, lng: nextPoint.pointX };
    } else {
      // 마지막이면 출발지로 복귀
      currentDestination = { lat: startY, lng: startX };
    }

    return { currentWaypoints, currentDestination };
  };

  const { currentWaypoints, currentDestination } = getDynamicWaypoints();
  const start = { lat: startY, lng: startX };

  // 사용자 위치가 다음 경유지에 도착했는지 확인
  const checkWaypointArrival = useCallback(() => {
    if (!currentLocation || !points || currentWaypointIndex >= points.length) return;

    const nextWaypoint = points[currentWaypointIndex];
    if (!nextWaypoint) return;

    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      nextWaypoint.pointY,
      nextWaypoint.pointX,
    );

    // 50미터 이내로 접근하면 도착으로 간주
    if (distance < 0.05) {
      setCurrentWaypointIndex((prev) => prev + 1);
    }
  }, [currentLocation, points, currentWaypointIndex]);

  // 두 지점 간 거리 계산 (km 단위)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 현재 위치 변경 시 도착 여부 확인
  useEffect(() => {
    checkWaypointArrival();
  }, [checkWaypointArrival]);

  const { routePoints } = useRouteNavigation({
    start,
    end: currentDestination || start,
    waypoints: currentWaypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng })),
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
      waypoints: [start, ...currentWaypoints, currentDestination].filter(Boolean),
      visitedWaypointCount: currentWaypointIndex,
      totalWaypointCount: points?.length || 0,
    };

    navigate('/feedback', {
      state: routeData,
      replace: true,
    });
  };

  const handleLocationCenter = () => {
    console.log('현재 위치로 지도 중심 이동됨');
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
              end={currentDestination || start}
              waypoints={currentWaypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng }))}
              routePoints={routePoints}
              className="h-[400px] w-full"
              onLocationCenter={handleLocationCenter}
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
