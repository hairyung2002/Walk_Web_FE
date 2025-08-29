export interface MyRoute {
  myRouteId: number;
  routeId: number;
  routeTitle: string;
  walkCount: number;
  rating: number;
  distanceInKm: number;
  isFavorite: boolean;
}

export interface MyRouteQueryParams {
  isFavorite?: boolean;
}

export interface MyRouteDetailParams {
  myRouteId: number;
}

export interface MyRouteApiError {
  message: string;
  status: number;
}
