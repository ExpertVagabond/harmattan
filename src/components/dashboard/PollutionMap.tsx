import { useEffect, useRef } from "react";
import type { CityData } from "../../lib/types";
import { getAQIColor } from "../../lib/aqi";

interface PollutionMapProps {
  cities: (CityData & { currentAqi: number })[];
}

export default function PollutionMap({ cities }: PollutionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: [7.5, -1.5],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    for (const city of cities) {
      const color = getAQIColor(city.currentAqi);
      const marker = L.circleMarker([city.lat, city.lng], {
        radius: 12,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.4,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:system-ui;color:#111">
          <strong>${city.city}</strong><br/>
          AQI: <span style="color:${color};font-weight:bold">${city.currentAqi}</span><br/>
          <small>${city.stations.length} station(s)</small>
        </div>`
      );
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [cities]);

  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 overflow-hidden">
      <div className="px-5 py-3 border-b border-surface-700">
        <h2 className="text-sm font-semibold text-gray-300">
          Ghana Air Quality Map
        </h2>
      </div>
      <div ref={mapRef} className="h-[420px] w-full" />
    </div>
  );
}
