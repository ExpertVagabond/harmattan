import { useState, useEffect } from "react";

interface Report {
  location: string;
  type: string;
  severity: string;
  description: string;
  timestamp: string;
}

const TYPE_LABELS: Record<string, string> = {
  smoke: "Smoke / Burning",
  dust: "Dust / Harmattan Haze",
  industrial: "Industrial Emissions",
  vehicle: "Vehicle Exhaust",
  waste: "Waste Burning",
  other: "Other",
};

const SEVERITY_COLORS = ["", "#4ade80", "#facc15", "#fb923c", "#f87171", "#a855f7"];

export default function CommunityReports() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("harmattan-reports") || "[]");
      setReports(stored.reverse().slice(0, 10));
    } catch {
      // ignore
    }

    const handler = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("harmattan-reports") || "[]");
        setReports(stored.reverse().slice(0, 10));
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (reports.length === 0) {
    return (
      <div className="bg-surface-800 rounded-xl border border-surface-700 p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          Community Reports
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm mb-2">No reports yet</p>
          <a
            href="/report"
            className="text-harmattan-400 hover:text-harmattan-300 text-sm underline underline-offset-2"
          >
            Be the first to report a pollution event
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">
          Community Reports
        </h3>
        <span className="text-[10px] text-gray-500">{reports.length} recent</span>
      </div>
      <div className="space-y-3">
        {reports.map((r, i) => {
          const sev = parseInt(r.severity) || 1;
          const sevColor = SEVERITY_COLORS[sev] ?? SEVERITY_COLORS[1];
          return (
            <div
              key={i}
              className="border border-surface-600 rounded-lg p-3 hover:border-surface-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-200 capitalize">
                  {r.location?.replace("-", " ")}
                </span>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }, (_, j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: j < sev ? sevColor : "#31353e",
                      }}
                    />
                  ))}
                </div>
              </div>
              <span
                className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-surface-700 text-gray-400 mb-1.5"
              >
                {TYPE_LABELS[r.type] ?? r.type}
              </span>
              {r.description && (
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {r.description}
                </p>
              )}
              <p className="text-[10px] text-gray-600 mt-1">
                {r.timestamp
                  ? new Date(r.timestamp).toLocaleString("en-GH", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
