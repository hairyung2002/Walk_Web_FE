import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { createNumberIcon, currentLocationIcon, startEndIcon } from './MapIcons';
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
}

const NavigationMap = ({
  center,
  currentLocation,
  start,
  end,
  waypoints,
  routePoints,
  className = 'h-[400px] w-full',
}: NavigationMapProps) => {
  return (
    <MapContainer center={center} zoom={17} className={className} key={`${center.lat}-${center.lng}`}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
