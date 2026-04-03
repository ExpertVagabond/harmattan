import { useEffect, useRef } from "react";
import type { CityData } from "../../lib/types";
import { getAQIColor, getAQICategory } from "../../lib/aqi";

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

    // Inject pulse animation CSS
    if (!document.getElementById("pulse-css")) {
      const style = document.createElement("style");
      style.id = "pulse-css";
      style.textContent = `
        @keyframes map-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .pulse-ring {
          animation: map-pulse 2.5s ease-out infinite;
          border-radius: 50%;
          position: absolute;
          pointer-events: none;
        }
        .leaflet-popup-content-wrapper {
          background: #1a1d24 !important;
          border: 1px solid #31353e !important;
          border-radius: 10px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip { background: #1a1d24 !important; }
        .leaflet-popup-close-button { color: #9ca3af !important; }
      `;
      document.head.appendChild(style);
    }

    const map = L.map(mapRef.current, {
      center: [7.9, -1.2],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

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
      const cat = getAQICategory(city.currentAqi);
      const radius = Math.max(10, Math.min(22, city.currentAqi / 6));

      // Outer pulse ring for unhealthy+ cities
      if (city.currentAqi > 100) {
        const pulseIcon = L.divIcon({
          className: "",
          html: `<div class="pulse-ring" style="width:${radius * 4}px;height:${radius * 4}px;background:${color};margin-left:-${radius * 2}px;margin-top:-${radius * 2}px;"></div>`,
          iconSize: [0, 0],
        });
        L.marker([city.lat, city.lng], { icon: pulseIcon, interactive: false }).addTo(map);
      }

      // Main circle marker
      L.circleMarker([city.lat, city.lng], {
        radius,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.5,
      }).addTo(map).bindPopup(
        `<div style="font-family:system-ui;padding:4px 2px;">
          <div style="font-size:15px;font-weight:700;color:#e5e7eb;margin-bottom:6px;">${city.city}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="font-size:28px;font-weight:800;color:${color};">${city.currentAqi}</span>
            <span style="font-size:11px;color:${color};background:${color}20;padding:2px 8px;border-radius:6px;">${cat.label}</span>
          </div>
          <div style="font-size:11px;color:#9ca3af;">${city.stations.length} monitoring station${city.stations.length > 1 ? "s" : ""}</div>
        </div>`,
        { className: "dark-popup" }
      );

      // AQI label on map
      const labelIcon = L.divIcon({
        className: "",
        html: `<div style="color:${color};font-size:11px;font-weight:700;font-family:ui-monospace,monospace;text-shadow:0 1px 3px rgba(0,0,0,0.8);white-space:nowrap;transform:translateY(-22px);text-align:center;">${city.currentAqi}</div>`,
        iconSize: [40, 20],
        iconAnchor: [20, 10],
      });
      L.marker([city.lat, city.lng], { icon: labelIcon, interactive: false }).addTo(map);
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [cities]);

  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 overflow-hidden">
      <div className="px-5 py-3 border-b border-surface-700 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300">
          Ghana Air Quality Map
        </h2>
        <span className="text-[10px] text-gray-500">
          Circle size = AQI severity
        </span>
      </div>
      <div ref={mapRef} className="h-[420px] w-full" />
    </div>
  );
}
