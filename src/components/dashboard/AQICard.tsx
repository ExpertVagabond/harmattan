import { getAQICategory } from "../../lib/aqi";

interface AQICardProps {
  city: string;
  aqi: number;
  pm25: number;
  pm10: number;
  dominantPollutant: string;
  timestamp: string;
}

export default function AQICard({
  city,
  aqi,
  pm25,
  pm10,
  dominantPollutant,
  timestamp,
}: AQICardProps) {
  const category = getAQICategory(aqi);
  const time = new Date(timestamp).toLocaleTimeString("en-GH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 p-5 hover:border-surface-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{city}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Updated {time}</p>
        </div>
        <div
          className="flex items-center justify-center w-14 h-14 rounded-xl text-2xl font-bold"
          style={{ backgroundColor: category.color + "20", color: category.color }}
        >
          {aqi}
        </div>
      </div>

      <div
        className="inline-block px-2 py-0.5 rounded-md text-xs font-medium mb-3"
        style={{ backgroundColor: category.color + "20", color: category.color }}
      >
        {category.label}
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-500 text-xs">PM2.5</span>
          <p className="text-gray-200 font-mono">{pm25.toFixed(1)}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">PM10</span>
          <p className="text-gray-200 font-mono">{pm10.toFixed(1)}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Main</span>
          <p className="text-gray-200 font-mono uppercase text-xs mt-1">
            {dominantPollutant}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">{category.advice}</p>
    </div>
  );
}
