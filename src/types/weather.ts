export type Weather = {
  baseDateTime: string;
  fcstDateTime: string;
  temperature: number;
  humidity: number;
  precipitationMm: number;
  precipitationTypeCode: number;
  precipitationType: string;
  windSpeed: number;
};
