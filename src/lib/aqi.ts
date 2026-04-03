import type { AQICategory, AQILevel } from "./types";

export const AQI_CATEGORIES: AQICategory[] = [
  {
    level: "good",
    label: "Good",
    range: [0, 50],
    color: "#4ade80",
    advice:
      "Air quality is satisfactory. Enjoy outdoor activities.",
  },
  {
    level: "moderate",
    label: "Moderate",
    range: [51, 100],
    color: "#facc15",
    advice:
      "Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor exertion.",
  },
  {
    level: "unhealthy-sensitive",
    label: "Unhealthy for Sensitive Groups",
    range: [101, 150],
    color: "#fb923c",
    advice:
      "Members of sensitive groups may experience health effects. Children, elderly, and those with respiratory conditions should limit outdoor exertion.",
  },
  {
    level: "unhealthy",
    label: "Unhealthy",
    range: [151, 200],
    color: "#f87171",
    advice:
      "Everyone may begin to experience health effects. Avoid prolonged outdoor exertion. Keep windows closed.",
  },
  {
    level: "very-unhealthy",
    label: "Very Unhealthy",
    range: [201, 300],
    color: "#a855f7",
    advice:
      "Health alert — everyone may experience serious health effects. Avoid all outdoor physical activity. Use air filtration indoors if available.",
  },
  {
    level: "hazardous",
    label: "Hazardous",
    range: [301, 500],
    color: "#7f1d1d",
    advice:
      "Health emergency. All populations are at risk. Stay indoors. Seal windows and doors. Use wet cloth over nose and mouth if outdoors.",
  },
];

export function getAQICategory(aqi: number): AQICategory {
  for (const cat of AQI_CATEGORIES) {
    if (aqi >= cat.range[0] && aqi <= cat.range[1]) return cat;
  }
  return AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

export function getAQILevel(aqi: number): AQILevel {
  return getAQICategory(aqi).level;
}

export function getAQIColor(aqi: number): string {
  return getAQICategory(aqi).color;
}
