import { getAQICategory } from "../../lib/aqi";

interface HealthAdvisoryProps {
  nationalAvgAqi: number;
  worstCity: string;
  worstAqi: number;
}

export default function HealthAdvisory({
  nationalAvgAqi,
  worstCity,
  worstAqi,
}: HealthAdvisoryProps) {
  const avgCat = getAQICategory(nationalAvgAqi);
  const worstCat = getAQICategory(worstAqi);

  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Health Advisory
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: avgCat.color }}
            />
            <span className="text-xs text-gray-400">National Average</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {avgCat.advice}
          </p>
        </div>

        {worstAqi > nationalAvgAqi && (
          <div className="border-t border-surface-700 pt-4">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: worstCat.color }}
              />
              <span className="text-xs text-gray-400">
                Alert: {worstCity}
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {worstCat.advice}
            </p>
          </div>
        )}

        <div className="border-t border-surface-700 pt-4">
          <h4 className="text-xs font-medium text-gray-400 mb-2">
            Protective Measures
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-harmattan-500 mt-0.5">-</span>
              Check AQI before outdoor exercise, especially during harmattan season (Nov-Mar)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-harmattan-500 mt-0.5">-</span>
              Use damp cloth or N95 mask when AQI exceeds 150
            </li>
            <li className="flex items-start gap-2">
              <span className="text-harmattan-500 mt-0.5">-</span>
              Keep children and elderly indoors during hazardous conditions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-harmattan-500 mt-0.5">-</span>
              Report visible pollution sources to help your community
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
