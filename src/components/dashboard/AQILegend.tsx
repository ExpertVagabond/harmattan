import { AQI_CATEGORIES } from "../../lib/aqi";

export default function AQILegend() {
  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Air Quality Index Scale
      </h3>
      <div className="space-y-2">
        {AQI_CATEGORIES.map((cat) => (
          <div key={cat.level} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-xs text-gray-400 w-16">
              {cat.range[0]}-{cat.range[1]}
            </span>
            <span className="text-xs text-gray-300">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
