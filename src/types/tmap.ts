// T-map API 타입 정의
export interface TmapLatLng {
  lat: number;
  lng: number;
}

export interface TmapMarkerOptions {
  position: TmapLatLng | { lat: number; lng: number };
  icon?: string;
  iconSize?: { width: number; height: number };
  title?: string;
  visible?: boolean;
  zIndex?: number;
}

export interface TmapPolylineOptions {
  path: (TmapLatLng | { lat: number; lng: number })[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  strokeStyle?: string;
}

export interface TmapRouteResponse {
  features: Array<{
    geometry: {
      coordinates: number[][];
      type: string;
    };
    properties: {
      totalDistance: number;
      totalTime: number;
      index: number;
      pointIndex: number;
      description: string;
      direction: string;
      nearPoiName: string;
      nearPoiX: string;
      nearPoiY: string;
    };
  }>;
}

// Window 객체에 Tmapv2 추가
declare global {
  interface Window {
    Tmapv2: {
      Map: new (
        element: string,
        options: {
          center: TmapLatLng | { lat: number; lng: number };
          width: string;
          height: string;
          zoom: number;
          zoomControl: boolean;
          scrollwheel: boolean;
        },
      ) => TmapMap;
      LatLng: new (lat: number, lng: number) => TmapLatLng;
      Marker: new (options: TmapMarkerOptions & { map: TmapMap }) => TmapMarker;
      Polyline: new (options: TmapPolylineOptions & { map: TmapMap }) => TmapPolyline;
    };
  }

  interface TmapMap {
    setCenter(latlng: TmapLatLng): void;
    setZoom(zoom: number): void;
    panTo(latlng: TmapLatLng): void;
    addListener(event: string, callback: () => void): void;
  }

  interface TmapMarker {
    setMap(map: TmapMap | null): void;
    setPosition(position: TmapLatLng): void;
    setVisible(visible: boolean): void;
  }

  interface TmapPolyline {
    setMap(map: TmapMap | null): void;
    setPath(path: TmapLatLng[]): void;
  }
}

export {};
