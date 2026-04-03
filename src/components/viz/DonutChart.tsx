import { useEffect, useState } from "react";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export default function DonutChart({
  segments,
  size = 180,
  thickness = 24,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1400;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const offset = accumulated;
    accumulated += pct;
    return {
      ...seg,
      pct,
      dashArray: `${circumference * pct * progress} ${circumference}`,
      rotation: offset * 360 - 90,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#252830"
            strokeWidth={thickness}
            fill="none"
          />
          {/* Segments */}
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={arc.color}
              strokeWidth={thickness}
              fill="none"
              strokeDasharray={arc.dashArray}
              strokeLinecap="butt"
              transform={`rotate(${arc.rotation} ${size / 2} ${size / 2})`}
              style={{
                transition: "stroke-dasharray 1.4s cubic-bezier(0.16,1,0.3,1)",
                filter: `drop-shadow(0 0 4px ${arc.color}30)`,
              }}
            />
          ))}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-xl font-bold text-gray-100 font-mono">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-[10px] text-gray-500">{centerLabel}</span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[10px] text-gray-400">
              {seg.label}{" "}
              <span className="font-mono text-gray-500">
                {Math.round((seg.value / total) * 100)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
