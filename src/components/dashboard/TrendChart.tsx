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
    <div className="bg-surface-800 rounded-xl border border-surface-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>

      <div className="flex items-end gap-1.5" style={{ height: chartHeight }}>
        {data.map((d, i) => {
          const height = (d.value / maxVal) * chartHeight;
          const color = getAQIColor(d.value);
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end gap-1"
            >
              <span className="text-[10px] text-gray-500 font-mono">
                {d.value}
              </span>
              <div
                className="w-full rounded-t-sm transition-all duration-300"
                style={{
                  height: Math.max(height, 4),
                  backgroundColor: color,
                  opacity: 0.7,
                }}
              />
              <span className="text-[9px] text-gray-500 truncate w-full text-center">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
