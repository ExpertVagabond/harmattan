import { Tile } from "@carbon/react";
import { getAQIColor } from "../../lib/aqi";

interface DataPoint {
  label: string;
  value: number;
}

interface TrendChartProps {
  title: string;
  data: DataPoint[];
  unit?: string;
}

export default function TrendChart({ title, data, unit = "AQI" }: TrendChartProps) {
  if (data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = 160;

  return (
    <Tile style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#c6c6c6" }}>{title}</h3>
        <span style={{ fontSize: "0.6875rem", color: "#6f6f6f" }}>{unit}</span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: chartHeight }}>
        {data.map((d, i) => {
          const height = (d.value / maxVal) * chartHeight;
          const color = getAQIColor(d.value);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
              <span style={{ fontSize: 10, color: "#6f6f6f", fontFamily: "'IBM Plex Mono', monospace" }}>
                {d.value}
              </span>
              <div style={{
                width: "100%",
                height: Math.max(height, 4),
                backgroundColor: color,
                opacity: 0.7,
                borderRadius: "2px 2px 0 0",
                transition: "height 0.3s ease",
              }} />
              <span style={{ fontSize: 9, color: "#6f6f6f", textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </Tile>
  );
}
