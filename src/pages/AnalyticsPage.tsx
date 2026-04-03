import { useState } from "react";
import { Grid, Column, Tile, Tabs, TabList, Tab, TabPanels, TabPanel, Tag } from "@carbon/react";
import { GHANA_CITIES } from "../data/ghana-cities";
import CityHeatmap from "../components/viz/CityHeatmap";
import DonutChart from "../components/viz/DonutChart";
import AQIGauge from "../components/viz/AQIGauge";
import TrendChart from "../components/dashboard/TrendChart";

const BASELINE: Record<string, number> = {
  Accra: 89, Kumasi: 72, Tema: 105, Takoradi: 58, Tamale: 118, "Cape Coast": 45,
};

const POLLUTANT_SEGMENTS = [
  { label: "Vehicles", value: 38, color: "#f87171" },
  { label: "Waste Burning", value: 24, color: "#fb923c" },
  { label: "Harmattan Dust", value: 18, color: "#facc15" },
  { label: "Industrial", value: 12, color: "#a855f7" },
  { label: "Cooking Fuel", value: 8, color: "#60a5fa" },
];

const SEASONAL_DATA = [
  { label: "Jan", value: 145 },
  { label: "Feb", value: 138 },
  { label: "Mar", value: 112 },
  { label: "Apr", value: 85 },
  { label: "May", value: 72 },
  { label: "Jun", value: 65 },
  { label: "Jul", value: 58 },
  { label: "Aug", value: 55 },
  { label: "Sep", value: 62 },
  { label: "Oct", value: 78 },
  { label: "Nov", value: 105 },
  { label: "Dec", value: 132 },
];

function generateDayTrend(base: number): { label: string; value: number }[] {
  const hours = ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"];
  return hours.map((label, i) => ({
    label,
    value: Math.max(10, Math.round(base + Math.sin(i * 0.8) * 20 + (i - 4) * 3)),
  }));
}

export default function AnalyticsPage() {
  const [selectedCity, setSelectedCity] = useState("Accra");

  return (
    <Grid>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: 8, color: "#f4f4f4" }}>
          Analytics
        </h1>
        <p style={{ color: "#c6c6c6", marginBottom: 24, fontSize: "0.875rem" }}>
          Deep analysis of air quality patterns across Ghana
        </p>
      </Column>

      {/* City comparison gauges */}
      <Column lg={16} md={8} sm={4} style={{ marginBottom: 24 }}>
        <Tile style={{ padding: 24 }}>
          <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 20 }}>
            City Comparison
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
            {Object.entries(BASELINE).map(([city, aqi]) => (
              <div
                key={city}
                onClick={() => setSelectedCity(city)}
                style={{
                  cursor: "pointer",
                  opacity: selectedCity === city ? 1 : 0.6,
                  transition: "opacity 0.2s",
                  textAlign: "center",
                }}
              >
                <AQIGauge value={aqi} size={100} />
                <p style={{
                  fontSize: "0.75rem",
                  color: selectedCity === city ? "#f4f4f4" : "#8d8d8d",
                  fontWeight: selectedCity === city ? 600 : 400,
                  marginTop: 8,
                }}>
                  {city}
                </p>
              </div>
            ))}
          </div>
        </Tile>
      </Column>

      {/* Tabbed analysis */}
      <Column lg={16} md={8} sm={4} style={{ marginBottom: 24 }}>
        <Tabs>
          <TabList aria-label="Analytics tabs">
            <Tab>24-Hour Patterns</Tab>
            <Tab>Seasonal Trends</Tab>
            <Tab>Pollution Sources</Tab>
          </TabList>
          <TabPanels>
            {/* 24h Heatmap */}
            <TabPanel>
              <div style={{ marginTop: 16 }}>
                <CityHeatmap
                  cities={Object.entries(BASELINE).map(([city, aqi]) => ({ city, baseAqi: aqi }))}
                />
                <div style={{ marginTop: 24 }}>
                  <TrendChart
                    title={`${selectedCity} — Hourly Breakdown`}
                    data={generateDayTrend(BASELINE[selectedCity] ?? 70)}
                  />
                </div>
              </div>
            </TabPanel>

            {/* Seasonal */}
            <TabPanel>
              <Grid style={{ marginTop: 16 }}>
                <Column lg={10} md={5} sm={4}>
                  <Tile style={{ padding: 24 }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 16 }}>
                      Monthly Average AQI — Ghana National
                    </h4>
                    <TrendChart title="" data={SEASONAL_DATA} unit="AQI" />
                    <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Tag type="red" size="sm">Harmattan Peak: Jan-Feb</Tag>
                      <Tag type="green" size="sm">Cleanest: Jul-Aug</Tag>
                      <Tag type="warm-gray" size="sm">Rainy Season: Apr-Sep</Tag>
                    </div>
                  </Tile>
                </Column>
                <Column lg={6} md={3} sm={4}>
                  <Tile style={{ padding: 24 }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 8 }}>
                      Seasonal Context
                    </h4>
                    <div style={{ fontSize: "0.8125rem", color: "#a8a8a8", lineHeight: 1.6 }}>
                      <p style={{ marginBottom: 12 }}>
                        <strong style={{ color: "#f4f4f4" }}>Harmattan Season (Nov–Mar):</strong> Saharan
                        dust carried by northeast trade winds dramatically increases PM10 levels.
                        Accra and Tamale see AQI spike 60–80% above annual average.
                      </p>
                      <p style={{ marginBottom: 12 }}>
                        <strong style={{ color: "#f4f4f4" }}>Rainy Season (Apr–Sep):</strong> Precipitation
                        washes particulates from the air. Best air quality months. Kumasi benefits
                        most due to forest canopy.
                      </p>
                      <p>
                        <strong style={{ color: "#f4f4f4" }}>Dry Season Transition (Oct):</strong> Waste
                        burning increases as harmattan approaches. Urban areas see vehicle emissions
                        compound with reduced ventilation.
                      </p>
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Sources */}
            <TabPanel>
              <Grid style={{ marginTop: 16 }}>
                <Column lg={6} md={4} sm={4}>
                  <Tile style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 24 }}>
                      Emission Breakdown
                    </h4>
                    <DonutChart
                      segments={POLLUTANT_SEGMENTS}
                      size={200}
                      thickness={28}
                      centerValue="5"
                      centerLabel="sources"
                    />
                  </Tile>
                </Column>
                <Column lg={10} md={4} sm={4}>
                  <Tile style={{ padding: 24 }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 16 }}>
                      Source Details
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {POLLUTANT_SEGMENTS.map((src) => (
                        <div key={src.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: "0.8125rem", color: "#f4f4f4" }}>{src.label}</span>
                            <span style={{ fontSize: "0.75rem", color: "#8d8d8d", fontFamily: "monospace" }}>{src.value}%</span>
                          </div>
                          <div style={{ height: 6, background: "#393939", borderRadius: 3, overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${src.value}%`,
                                background: src.color,
                                borderRadius: 3,
                                transition: "width 1s ease",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.6875rem", color: "#525252", marginTop: 16, paddingTop: 12, borderTop: "1px solid #393939" }}>
                      Source: EPA Ghana Air Quality Report 2024 / World Bank estimates
                    </p>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}
