import { divIcon } from 'leaflet';

// 커스텀 마커 아이콘 생성 함수 (모바일 최적화)
export const createNumberIcon = (number: number) => {
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
export const currentLocationIcon = divIcon({
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
export const startEndIcon = divIcon({
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

// 마커 스타일 CSS
export const markerStyles = `
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
`;
