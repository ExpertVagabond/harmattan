export interface Station {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  source: "openaq" | "waqi" | "community";
}

export interface AQIReading {
  stationId: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
  timestamp: string;
  dominantPollutant: string;
}

export interface CityData {
  city: string;
  lat: number;
  lng: number;
  stations: Station[];
  currentAqi?: number;
  readings?: AQIReading[];
}

export type AQILevel =
  | "good"
  | "moderate"
  | "unhealthy-sensitive"
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous";

export interface AQICategory {
  level: AQILevel;
  label: string;
  range: [number, number];
  color: string;
  advice: string;
}

export interface CommunityReport {
  id?: string;
  lat: number;
  lng: number;
  type: "smoke" | "dust" | "industrial" | "waste-burning" | "other";
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  reporter: string;
  timestamp: string;
  city: string;
}
