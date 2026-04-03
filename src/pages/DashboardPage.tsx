import Dashboard from "../components/dashboard/Dashboard";
import ParticleField from "../components/viz/ParticleField";

export default function DashboardPage() {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, top: 48, zIndex: 0, pointerEvents: "none" }}>
        <ParticleField aqi={81} />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Dashboard />
      </div>
    </div>
  );
}
