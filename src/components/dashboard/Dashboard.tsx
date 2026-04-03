import { useState, useEffect } from "react";
import { Grid, Column, Tile, InlineNotification, Row } from "@carbon/react";
import { GHANA_CITIES } from "../../data/ghana-cities";
import { fetchWAQICity, estimateAQIFromPM25 } from "../../lib/api";
import type { CityData } from "../../lib/types";
import AQIGauge from "../viz/AQIGauge";
import PollutionMap from "./PollutionMap";
import TrendChart from "./TrendChart";
import { getAQICategory, getAQIColor } from "../../lib/aqi";

const BASELINE_DATA: Record<string, { aqi: number; pm25: number; pm10: number }> = {
  Accra:     { aqi: 89, pm25: 31.2, pm10: 48.5 },
  Kumasi:    { aqi: 72, pm25: 24.8, pm10: 38.2 },
  Tema:      { aqi: 105, pm25: 39.1, pm10: 56.3 },
  Takoradi:  { aqi: 58, pm25: 17.4, pm10: 29.8 },
  Tamale:    { aqi: 118, pm25: 44.6, pm10: 71.2 },
  "Cape Coast": { aqi: 45, pm25: 12.3, pm10: 22.1 },
};

function generateMockTrend(baseAqi: number): { label: string; value: number }[] {
  const hours = ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"];
  return hours.map((label, i) => ({
    label,
    value: Math.max(10, Math.round(baseAqi + Math.sin(i * 0.8) * 20 + (i - 4) * 3)),
  }));
}

interface CityAQI {
  city: string;
  aqi: number;
  pm25: number;
  pm10: number;
  dominantPollutant: string;
  timestamp: string;
  live: boolean;
}

function baselineForCity(city: string): CityAQI {
  const b = BASELINE_DATA[city] ?? { aqi: 70, pm25: 25, pm10: 38 };
  return { city, aqi: b.aqi, pm25: b.pm25, pm10: b.pm10, dominantPollutant: "pm25", timestamp: new Date().toISOString(), live: false };
}

function MiniGauge({ value, color }: { value: number; color: string }) {
  const size = 48;
  const sw = 4;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#393939" strokeWidth={sw} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={sw} fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, value / 500))}
        style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 4px ${color}40)` }}
      />
    </svg>
  );
}

export default function Dashboard() {
  const [cityData, setCityData] = useState<CityAQI[]>(GHANA_CITIES.map((c) => baselineForCity(c.city)));
  const [loading, setLoading] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLiveData() {
      setLoading(true);
      try {
        const results = await Promise.allSettled(
          GHANA_CITIES.map(async (city) => {
            const reading = await fetchWAQICity(city.city.toLowerCase());
            if (reading) {
              return { city: city.city, aqi: reading.aqi, pm25: reading.pm25, pm10: reading.pm10, dominantPollutant: reading.dominantPollutant, timestamp: reading.timestamp, live: true };
            }
            return baselineForCity(city.city);
          })
        );
        const data = results.filter((r): r is PromiseFulfilledResult<CityAQI> => r.status === "fulfilled").map((r) => r.value);
        setCityData(data);
        setLiveCount(data.filter((d) => d.live).length);
      } catch {
        setError("Live API unavailable — showing baseline estimates.");
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
    const interval = setInterval(loadLiveData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const avgAqi = cityData.length > 0 ? Math.round(cityData.reduce((s, c) => s + c.aqi, 0) / cityData.length) : 0;
  const worstCity = cityData.reduce((w, c) => (c.aqi > w.aqi ? c : w), cityData[0] ?? { city: "—", aqi: 0 });
  const mapCities = GHANA_CITIES.map((c) => ({ ...c, currentAqi: cityData.find((d) => d.city === c.city)?.aqi ?? 0 }));
  const now = new Date().toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Status banner */}
      {(error || liveCount === 0) && (
        <InlineNotification
          kind={error ? "warning" : "info"}
          title={liveCount > 0 ? `${liveCount}/${cityData.length} cities live` : "Baseline mode"}
          subtitle={liveCount > 0 ? "" : "Showing EPA Ghana estimates — live API connecting..."}
          lowContrast
          hideCloseButton
        />
      )}

      {/* National gauge + stat tiles */}
      <Grid condensed>
        <Column lg={4} md={3} sm={4}>
          <Tile style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            <span style={{ fontSize: "0.625rem", color: "#8d8d8d", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              National Average
            </span>
            <AQIGauge value={avgAqi} size={140} label="current" />
          </Tile>
        </Column>
        <Column lg={12} md={5} sm={4}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, height: "100%" }}>
            {[
              { label: "Monitoring Stations", value: GHANA_CITIES.reduce((s, c) => s + c.stations.length, 0).toString() },
              { label: "Cities Covered", value: cityData.length.toString() },
              { label: "Worst City", value: worstCity.city, sub: `AQI ${worstCity.aqi}` },
              { label: "Last Updated", value: now },
            ].map((stat) => (
              <Tile key={stat.label} style={{ padding: 16 }}>
                <p style={{ fontSize: "0.6875rem", color: "#8d8d8d", marginBottom: 4 }}>{stat.label}</p>
                <p style={{ fontSize: "1.5rem", fontWeight: 600, color: "#f4f4f4", fontFamily: "'IBM Plex Mono', monospace" }}>
                  {stat.value}
                </p>
                {stat.sub && <p style={{ fontSize: "0.6875rem", color: "#c6c6c6" }}>{stat.sub}</p>}
              </Tile>
            ))}
          </div>
        </Column>
      </Grid>

      {/* Map + health advisory */}
      <Grid condensed>
        <Column lg={11} md={5} sm={4}>
          <PollutionMap cities={mapCities} />
        </Column>
        <Column lg={5} md={3} sm={4}>
          <Tile style={{ padding: 20, marginBottom: 12 }}>
            <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 12 }}>
              Health Advisory
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: getAQIColor(avgAqi) }} />
              <span style={{ fontSize: "0.75rem", color: "#a8a8a8" }}>National: {getAQICategory(avgAqi).label}</span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#c6c6c6", lineHeight: 1.6, marginBottom: 12 }}>
              {getAQICategory(avgAqi).advice}
            </p>
            {worstCity.aqi > avgAqi && (
              <div style={{ borderTop: "1px solid #393939", paddingTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: getAQIColor(worstCity.aqi) }} />
                  <span style={{ fontSize: "0.75rem", color: "#a8a8a8" }}>Alert: {worstCity.city}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#c6c6c6", lineHeight: 1.6 }}>
                  {getAQICategory(worstCity.aqi).advice}
                </p>
              </div>
            )}
          </Tile>
          <Tile style={{ padding: 20 }}>
            <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 12 }}>
              AQI Scale
            </h3>
            {[
              { range: "0–50", label: "Good", color: "#4ade80" },
              { range: "51–100", label: "Moderate", color: "#facc15" },
              { range: "101–150", label: "Unhealthy (Sensitive)", color: "#fb923c" },
              { range: "151–200", label: "Unhealthy", color: "#f87171" },
              { range: "201–300", label: "Very Unhealthy", color: "#a855f7" },
              { range: "301–500", label: "Hazardous", color: "#7f1d1d" },
            ].map((level) => (
              <div key={level.range} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: level.color, flexShrink: 0 }} />
                <span style={{ fontSize: "0.6875rem", color: "#8d8d8d", width: 48, fontFamily: "monospace" }}>{level.range}</span>
                <span style={{ fontSize: "0.75rem", color: "#c6c6c6" }}>{level.label}</span>
              </div>
            ))}
          </Tile>
        </Column>
      </Grid>

      {/* City cards */}
      <div>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#f4f4f4", marginBottom: 16 }}>
          City Air Quality
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {cityData.map((city) => {
            const cat = getAQICategory(city.aqi);
            return (
              <Tile key={city.city} style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f4f4f4" }}>{city.city}</h3>
                    <p style={{ fontSize: "0.6875rem", color: "#6f6f6f" }}>
                      Updated {new Date(city.timestamp).toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div style={{ position: "relative" }}>
                    <MiniGauge value={city.aqi} color={cat.color} />
                    <span style={{
                      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.875rem", fontWeight: 700, color: cat.color, fontFamily: "'IBM Plex Mono', monospace",
                    }}>
                      {city.aqi}
                    </span>
                  </div>
                </div>
                <span style={{
                  display: "inline-block", fontSize: "0.6875rem", fontWeight: 500,
                  padding: "2px 8px", borderRadius: 4, color: cat.color, background: cat.color + "15",
                  marginBottom: 12,
                }}>
                  {cat.label}
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: "0.625rem", color: "#6f6f6f" }}>PM2.5</span>
                    <p style={{ fontSize: "0.875rem", color: "#c6c6c6", fontFamily: "'IBM Plex Mono', monospace" }}>{city.pm25.toFixed(1)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.625rem", color: "#6f6f6f" }}>PM10</span>
                    <p style={{ fontSize: "0.875rem", color: "#c6c6c6", fontFamily: "'IBM Plex Mono', monospace" }}>{city.pm10.toFixed(1)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.625rem", color: "#6f6f6f" }}>Main</span>
                    <p style={{ fontSize: "0.75rem", color: "#c6c6c6", fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>
                      {city.dominantPollutant}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#8d8d8d", lineHeight: 1.5 }}>{cat.advice}</p>
              </Tile>
            );
          })}
        </div>
      </div>

      {/* Trend charts */}
      <Grid condensed>
        <Column lg={8} md={4} sm={4}>
          <TrendChart title="Accra — Today's AQI Trend" data={generateMockTrend(cityData.find((c) => c.city === "Accra")?.aqi ?? 75)} />
        </Column>
        <Column lg={8} md={4} sm={4}>
          <TrendChart title="Kumasi — Today's AQI Trend" data={generateMockTrend(cityData.find((c) => c.city === "Kumasi")?.aqi ?? 60)} />
        </Column>
      </Grid>
    </div>
  );
}
