export type AIRequestRoute = {
  duration: string;
  purpose: string;
  addressJibun: string;
  withPet: boolean;
  longitude: number;
  latitude: number;
};

export type AIResponseRoute = {
  title: string;
  content: string;
  summary: string;
  distanceInKm: number;
  duration: string;
  purpose: string;
  addressJibun: string;
  withPet: boolean;
  routeStartX: number;
  routeStartY: number;
  cross: number;
  points: Point[];
};

export interface Point {
  pointX: number;
  pointY: number;
}
