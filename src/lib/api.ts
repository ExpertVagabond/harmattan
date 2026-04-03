import type { AQIReading } from "./types";
import { GHANA_CITIES } from "../data/ghana-cities";

const WAQI_BASE = "https://api.waqi.info";
const OPENAQ_BASE = "https://api.openaq.org/v3";

// WAQI provides a free token for non-commercial use
// For production, register at https://aqicn.org/data-platform/token/
const WAQI_TOKEN = "demo";

export async function fetchWAQICity(city: string): Promise<AQIReading | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${WAQI_BASE}/feed/${city}/?token=${WAQI_TOKEN}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (data.status !== "ok" || !data.data) return null;

    const d = data.data;
    return {
      stationId: `waqi-${city}`,
      aqi: d.aqi,
      pm25: d.iaqi?.pm25?.v ?? 0,
      pm10: d.iaqi?.pm10?.v ?? 0,
      no2: d.iaqi?.no2?.v,
      so2: d.iaqi?.so2?.v,
      co: d.iaqi?.co?.v,
      o3: d.iaqi?.o3?.v,
      timestamp: d.time?.iso ?? new Date().toISOString(),
      dominantPollutant: d.dominentpol ?? "pm25",
    };
  } catch {
    return null;
  }
}

export async function fetchWAQIGeo(
  lat: number,
  lng: number,
  radius = 50
): Promise<AQIReading[]> {
  try {
    const bounds = `${lat - 0.5},${lng - 0.5},${lat + 0.5},${lng + 0.5}`;
    const res = await fetch(
      `${WAQI_BASE}/map/bounds/?latlng=${bounds}&token=${WAQI_TOKEN}`
    );
    const data = await res.json();
    if (data.status !== "ok" || !data.data) return [];

    return data.data.map(
      (s: { uid: number; aqi: string; station: { name: string; time: string }; lat: number; lon: number }) => ({
        stationId: `waqi-${s.uid}`,
        aqi: parseInt(s.aqi) || 0,
        pm25: parseInt(s.aqi) || 0,
        pm10: 0,
        timestamp: s.station?.time ?? new Date().toISOString(),
        dominantPollutant: "pm25",
      })
    );
  } catch {
    return [];
  }
}

export async function fetchOpenAQLocations(
  countryCode = "GH",
  limit = 100
): Promise<AQIReading[]> {
  try {
    const res = await fetch(
      `${OPENAQ_BASE}/locations?countries_id=80&limit=${limit}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map(
      (loc: {
        id: number;
        name: string;
        sensors: { parameter: { name: string }; summary: { avg: number } }[];
        datetime: { last: { utc: string } };
      }) => ({
        stationId: `openaq-${loc.id}`,
        aqi: estimateAQIFromPM25(
          loc.sensors?.find(
            (s: { parameter: { name: string } }) => s.parameter?.name === "pm25"
          )?.summary?.avg ?? 0
        ),
        pm25:
          loc.sensors?.find(
            (s: { parameter: { name: string } }) => s.parameter?.name === "pm25"
          )?.summary?.avg ?? 0,
        pm10:
          loc.sensors?.find(
            (s: { parameter: { name: string } }) => s.parameter?.name === "pm10"
          )?.summary?.avg ?? 0,
        timestamp: loc.datetime?.last?.utc ?? new Date().toISOString(),
        dominantPollutant: "pm25",
      })
    );
  } catch {
    return [];
  }
}

/** Convert raw PM2.5 (µg/m³) to US EPA AQI */
export function estimateAQIFromPM25(pm25: number): number {
  const breakpoints = [
    { bpLo: 0, bpHi: 12, aqiLo: 0, aqiHi: 50 },
    { bpLo: 12.1, bpHi: 35.4, aqiLo: 51, aqiHi: 100 },
    { bpLo: 35.5, bpHi: 55.4, aqiLo: 101, aqiHi: 150 },
    { bpLo: 55.5, bpHi: 150.4, aqiLo: 151, aqiHi: 200 },
    { bpLo: 150.5, bpHi: 250.4, aqiLo: 201, aqiHi: 300 },
    { bpLo: 250.5, bpHi: 500.4, aqiLo: 301, aqiHi: 500 },
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.bpLo && pm25 <= bp.bpHi) {
      return Math.round(
        ((bp.aqiHi - bp.aqiLo) / (bp.bpHi - bp.bpLo)) * (pm25 - bp.bpLo) +
          bp.aqiLo
      );
    }
  }
  return 500;
}

export async function fetchAllGhanaData(): Promise<
  Map<string, AQIReading[]>
> {
  const results = new Map<string, AQIReading[]>();

  // Fetch WAQI data for each city in parallel
  const cityNames = GHANA_CITIES.map((c) => c.city.toLowerCase());
  const waqiPromises = cityNames.map((city) => fetchWAQICity(city));
  const waqiResults = await Promise.allSettled(waqiPromises);

  for (let i = 0; i < cityNames.length; i++) {
    const result = waqiResults[i];
    if (result.status === "fulfilled" && result.value) {
      const city = GHANA_CITIES[i].city;
      results.set(city, [result.value]);
    }
  }

  // Supplement with OpenAQ
  const openaqData = await fetchOpenAQLocations();
  if (openaqData.length > 0) {
    for (const city of GHANA_CITIES) {
      const existing = results.get(city.city) ?? [];
      results.set(city.city, [...existing, ...openaqData.slice(0, 2)]);
    }
  }

  return results;
}
