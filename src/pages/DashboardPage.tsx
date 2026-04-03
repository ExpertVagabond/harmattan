import { Grid, Column } from "@carbon/react";
import Dashboard from "../components/dashboard/Dashboard";
import ParticleField from "../components/viz/ParticleField";

export default function DashboardPage() {
  return (
    <div className="relative">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ top: 48 }}>
        <ParticleField aqi={81} />
      </div>
      <div className="relative z-10">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Dashboard />
          </Column>
        </Grid>
      </div>
    </div>
  );
}
