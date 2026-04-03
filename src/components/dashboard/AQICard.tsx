import { getAQICategory } from "../../lib/aqi";

interface AQICardProps {
  city: string;
  aqi: number;
  pm25: number;
  pm10: number;
  dominantPollutant: string;
  timestamp: string;
}

function MiniGauge({ value, color }: { value: number; color: string }) {
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, value / 500);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="#252830" strokeWidth={strokeWidth} fill="none"
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - pct)}
        style={{
          transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)",
          filter: `drop-shadow(0 0 4px ${color}40)`,
        }}
      />
    </svg>
  );
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
    <div className="bg-surface-800/80 backdrop-blur-sm rounded-xl border border-surface-700 p-5 hover:border-surface-600 transition-all hover:shadow-lg hover:shadow-black/20 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{city}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Updated {time}</p>
        </div>
        <div className="relative">
          <MiniGauge value={aqi} color={category.color} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-base font-bold font-mono"
              style={{ color: category.color }}
            >
              {aqi}
            </span>
          </div>
        </div>
      </div>

      <div
        className="inline-block px-2 py-0.5 rounded-md text-xs font-medium mb-3"
        style={{ backgroundColor: category.color + "15", color: category.color }}
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
