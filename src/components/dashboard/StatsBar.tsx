interface StatsBarProps {
  totalStations: number;
  citiesMonitored: number;
  avgAqi: number;
  lastUpdate: string;
}

export default function StatsBar({
  totalStations,
  citiesMonitored,
  avgAqi,
  lastUpdate,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Monitoring Stations", value: totalStations.toString() },
        { label: "Cities Covered", value: citiesMonitored.toString() },
        { label: "National Avg AQI", value: avgAqi.toString() },
        { label: "Last Updated", value: lastUpdate },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-surface-800 border border-surface-700 rounded-lg px-4 py-3"
        >
          <p className="text-xs text-gray-500">{stat.label}</p>
          <p className="text-xl font-bold text-gray-100 font-mono mt-0.5">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
