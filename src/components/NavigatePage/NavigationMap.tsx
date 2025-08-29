import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { createNumberIcon, currentLocationIcon, startEndIcon } from './MapIcons';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// 타입 정의
interface LatLng {
  lat: number;
  lng: number;
}

interface NavigationMapProps {
  center: LatLng;
  currentLocation?: LatLng | null;
  start: LatLng;
  end: LatLng;
  waypoints: LatLng[];
  routePoints?: LatLng[];
  className?: string;
  onLocationCenter?: () => void;
}

// 지도 중심 이동을 위한 컴포넌트
const MapCenterController = ({ center }: { center: LatLng }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  
  return null;
};

// 현재 위치 버튼 컴포넌트
const LocationButton = ({
  currentLocation,
  onLocationCenter,
}: {
  currentLocation?: LatLng | null;
  onLocationCenter?: () => void;
}) => {
  const map = useMap();

  const handleLocationClick = () => {
    if (currentLocation) {
      map.setView([currentLocation.lat, currentLocation.lng], 17);
      onLocationCenter?.();
    }
  };

  if (!currentLocation) return null;

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleLocationClick}
          className="bg-white hover:bg-gray-50 border border-gray-300 rounded shadow-md p-2 m-1 flex items-center justify-center transition-colors"
          title="현재 위치로 이동">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const NavigationMap = ({
  center,
  currentLocation,
  start,
  end,
  waypoints,
  routePoints,
  className = 'h-[400px] w-full',
  onLocationCenter,
}: NavigationMapProps) => {
  return (
    <MapContainer center={center} zoom={17} className={className} key={`${center.lat}-${center.lng}`}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* 현재 위치 버튼 */}
      <LocationButton currentLocation={currentLocation} onLocationCenter={onLocationCenter} />
      
      {/* 지도 중심 이동 컨트롤러 */}
      <MapCenterController center={center} />

      {/* 현재 위치 마커 (실시간) */}
      {currentLocation && (
        <Marker position={currentLocation} icon={currentLocationIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-medium text-red-600">📍 현재 위치 (실시간)</p>
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
            <p className="font-medium text-blue-600">🏁 도착지 (목적지)</p>
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
  );
};

export default NavigationMap;
