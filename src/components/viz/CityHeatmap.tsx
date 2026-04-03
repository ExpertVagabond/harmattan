import { getAQIColor } from "../../lib/aqi";

interface CityHeatmapProps {
  cities: { city: string; baseAqi: number }[];
}

// Generate 24h simulated pattern based on known urban air quality cycles
function generate24hPattern(baseAqi: number): number[] {
  // Air quality typically worst in morning rush (7-9am) and evening (5-8pm)
  // Best in early morning (2-5am) and midday with wind
  const hourlyFactors = [
    0.7, 0.65, 0.6, 0.58, 0.6, 0.7,    // 12am-5am: low activity
    0.85, 1.1, 1.25, 1.15, 1.0, 0.9,    // 6am-11am: morning rush peak
    0.85, 0.88, 0.92, 0.98, 1.1, 1.2,   // 12pm-5pm: afternoon buildup
    1.15, 1.05, 0.95, 0.88, 0.8, 0.75,  // 6pm-11pm: evening decline
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
    <div className="bg-surface-800 rounded-xl border border-surface-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">
          24-Hour Air Quality Pattern
        </h3>
        <span className="text-[10px] text-gray-500">Estimated hourly AQI</span>
      </div>

      <div className="overflow-x-auto -mx-1">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex mb-1 pl-20">
            {hours.map((h, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[8px] text-gray-600"
              >
                {i % 3 === 0 ? h : ""}
              </div>
            ))}
          </div>

          {/* Heatmap rows */}
          {data.map((row) => (
            <div key={row.city} className="flex items-center mb-0.5">
              <span className="w-20 text-xs text-gray-400 truncate pr-2 text-right shrink-0">
                {row.city}
              </span>
              <div className="flex flex-1 gap-px">
                {row.values.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 h-7 rounded-[3px] transition-all duration-300 hover:scale-y-125 cursor-default group relative"
                    style={{ backgroundColor: getAQIColor(val) + "60" }}
                    title={`${row.city} ${hours[i]}: AQI ${val}`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                      <div className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-[10px] text-gray-300 whitespace-nowrap shadow-lg">
                        <span className="font-mono font-bold" style={{ color: getAQIColor(val) }}>
                          {val}
                        </span>
                        {" "}at {hours[i]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Time axis markers */}
          <div className="flex mt-2 pl-20">
            <div className="flex-1 flex justify-between text-[9px] text-gray-600">
              <span>Midnight</span>
              <span>6 AM</span>
              <span>Noon</span>
              <span>6 PM</span>
              <span>Midnight</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 mt-4 pt-3 border-t border-surface-700">
        <span className="text-[9px] text-gray-600 mr-1">Low</span>
        {[30, 60, 90, 120, 160, 200].map((v) => (
          <div
            key={v}
            className="w-4 h-3 rounded-sm"
            style={{ backgroundColor: getAQIColor(v) + "60" }}
          />
        ))}
        <span className="text-[9px] text-gray-600 ml-1">High</span>
      </div>
    </div>
  );
}
