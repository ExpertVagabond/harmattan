import { useState } from "react";
import {
  Grid, Column, Tile, Select, SelectItem, RadioButtonGroup, RadioButton,
  TextArea, Button, InlineNotification, NumberInput,
} from "@carbon/react";
import { SendFilled, WarningAlt } from "@carbon/react/icons";

const CITIES = ["Accra", "Kumasi", "Tema", "Takoradi", "Tamale", "Cape Coast"];
const TYPES = [
  { value: "smoke", label: "Smoke / Burning" },
  { value: "dust", label: "Dust / Harmattan Haze" },
  { value: "industrial", label: "Industrial Emissions" },
  { value: "vehicle", label: "Vehicle Exhaust" },
  { value: "waste", label: "Waste Burning" },
  { value: "other", label: "Other" },
];

export default function ReportPage() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("3");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reports, setReports] = useState<unknown[]>(() => {
    try { return JSON.parse(localStorage.getItem("harmattan-reports") || "[]"); }
    catch { return []; }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location || !type) return;

    const report = { location, type, severity, description, timestamp: new Date().toISOString() };
    const updated = [...reports, report];
    localStorage.setItem("harmattan-reports", JSON.stringify(updated));
    setReports(updated);

    setLocation("");
    setType("");
    setSeverity("3");
    setDescription("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <Grid>
      <Column lg={10} md={6} sm={4}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: 8, color: "#f4f4f4" }}>
          Report a Pollution Event
        </h1>
        <p style={{ color: "#c6c6c6", marginBottom: 24, fontSize: "0.875rem" }}>
          Help improve air quality data in your community. Your reports contribute to a
          more accurate picture of pollution across Ghana.
        </p>

        {submitted && (
          <div style={{ marginBottom: 16 }}>
            <InlineNotification
              kind="success"
              title="Report submitted"
              subtitle="Thank you for helping monitor air quality in Ghana."
              lowContrast
              onClose={() => setSubmitted(false)}
            />
          </div>
        )}

        <Tile style={{ padding: 24 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <Select
                id="location"
                labelText="Location"
                value={location}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocation(e.target.value)}
              >
                <SelectItem value="" text="Select a city" />
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c.toLowerCase().replace(" ", "-")} text={c} />
                ))}
              </Select>

              <Select
                id="type"
                labelText="Pollution Type"
                value={type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
              >
                <SelectItem value="" text="Select type" />
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value} text={t.label} />
                ))}
              </Select>

              <div>
                <label style={{ fontSize: "0.75rem", color: "#c6c6c6", display: "block", marginBottom: 8 }}>
                  Severity
                </label>
                <RadioButtonGroup
                  name="severity"
                  valueSelected={severity}
                  onChange={(val: string) => setSeverity(val)}
                  orientation="horizontal"
                  legendText=""
                >
                  <RadioButton labelText="1 — Mild" value="1" id="sev-1" />
                  <RadioButton labelText="2" value="2" id="sev-2" />
                  <RadioButton labelText="3 — Medium" value="3" id="sev-3" />
                  <RadioButton labelText="4" value="4" id="sev-4" />
                  <RadioButton labelText="5 — Severe" value="5" id="sev-5" />
                </RadioButtonGroup>
              </div>

              <TextArea
                id="description"
                labelText="Description"
                placeholder="Describe what you observed — smell, visibility, duration, health effects..."
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                rows={4}
              />

              <Button
                type="submit"
                renderIcon={SendFilled}
                disabled={!location || !type}
                size="lg"
              >
                Submit Report
              </Button>
            </div>
          </form>
        </Tile>
      </Column>

      <Column lg={6} md={2} sm={4}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 16 }}>
          Recent Reports ({reports.length})
        </h3>

        {reports.length === 0 ? (
          <Tile style={{ padding: 24, textAlign: "center" }}>
            <WarningAlt size={32} style={{ color: "#525252", marginBottom: 8 }} />
            <p style={{ color: "#8d8d8d", fontSize: "0.875rem" }}>
              No reports yet. Be the first to contribute.
            </p>
          </Tile>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...reports].reverse().slice(0, 8).map((r: any, i) => (
              <Tile key={i} style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#f4f4f4", textTransform: "capitalize" }}>
                    {r.location?.replace("-", " ")}
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "#8d8d8d" }}>
                    Severity {r.severity}/5
                  </span>
                </div>
                <span style={{
                  fontSize: "0.6875rem",
                  padding: "1px 6px",
                  background: "#393939",
                  borderRadius: 4,
                  color: "#a8a8a8",
                }}>
                  {TYPES.find((t) => t.value === r.type)?.label ?? r.type}
                </span>
                {r.description && (
                  <p style={{ fontSize: "0.75rem", color: "#8d8d8d", marginTop: 6, lineHeight: 1.4 }}>
                    {r.description.slice(0, 100)}{r.description.length > 100 ? "..." : ""}
                  </p>
                )}
                <p style={{ fontSize: "0.625rem", color: "#525252", marginTop: 4 }}>
                  {new Date(r.timestamp).toLocaleString("en-GH")}
                </p>
              </Tile>
            ))}
          </div>
        )}
      </Column>
    </Grid>
  );
}
