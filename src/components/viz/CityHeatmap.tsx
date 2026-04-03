import { Tile } from "@carbon/react";
import { getAQIColor } from "../../lib/aqi";

interface CityHeatmapProps {
  cities: { city: string; baseAqi: number }[];
}

function generate24hPattern(baseAqi: number): number[] {
  const hourlyFactors = [
    0.7, 0.65, 0.6, 0.58, 0.6, 0.7,
    0.85, 1.1, 1.25, 1.15, 1.0, 0.9,
    0.85, 0.88, 0.92, 0.98, 1.1, 1.2,
    1.15, 1.05, 0.95, 0.88, 0.8, 0.75,
  ];
  return hourlyFactors.map((f) => Math.round(baseAqi * f));
}

export default function CityHeatmap({ cities }: CityHeatmapProps) {
  const hours = Array.from({ length: 24 }, (_, i) =>
    i === 0 ? "12a" : i < 12 ? `${i}a` : i === 12 ? "12p" : `${i - 12}p`
  );

  const data = cities.map((c) => ({
    city: c.city,
    values: generate24hPattern(c.baseAqi),
  }));

  return (
    <Tile style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#c6c6c6" }}>
          24-Hour Air Quality Pattern
        </h3>
        <span style={{ fontSize: 10, color: "#6f6f6f" }}>Estimated hourly AQI</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 600 }}>
          {/* Hour labels */}
          <div style={{ display: "flex", marginBottom: 4, paddingLeft: 80 }}>
            {hours.map((h, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 8, color: "#525252" }}>
                {i % 3 === 0 ? h : ""}
              </div>
            ))}
          </div>

          {/* Rows */}
          {data.map((row) => (
            <div key={row.city} style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <span style={{ width: 80, fontSize: "0.75rem", color: "#a8a8a8", textAlign: "right", paddingRight: 8, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {row.city}
              </span>
              <div style={{ display: "flex", flex: 1, gap: 1 }}>
                {row.values.map((val, i) => (
                  <div
                    key={i}
                    title={`${row.city} ${hours[i]}: AQI ${val}`}
                    style={{
                      flex: 1,
                      height: 28,
                      borderRadius: 2,
                      backgroundColor: getAQIColor(val) + "60",
                      cursor: "default",
                      transition: "transform 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "scaleY(1.2)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "scaleY(1)"; }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Time axis */}
          <div style={{ display: "flex", marginTop: 8, paddingLeft: 80 }}>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", fontSize: 9, color: "#525252" }}>
              <span>Midnight</span>
              <span>6 AM</span>
              <span>Noon</span>
              <span>6 PM</span>
              <span>Midnight</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginTop: 16, paddingTop: 12, borderTop: "1px solid #393939" }}>
        <span style={{ fontSize: 9, color: "#525252", marginRight: 4 }}>Low</span>
        {[30, 60, 90, 120, 160, 200].map((v) => (
          <div key={v} style={{ width: 16, height: 12, borderRadius: 2, backgroundColor: getAQIColor(v) + "60" }} />
        ))}
        <span style={{ fontSize: 9, color: "#525252", marginLeft: 4 }}>High</span>
      </div>
    </Tile>
  );
}
