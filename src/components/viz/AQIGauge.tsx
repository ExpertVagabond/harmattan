import { useEffect, useState } from "react";
import { getAQICategory } from "../../lib/aqi";

interface AQIGaugeProps {
  value: number;
  size?: number;
  label?: string;
}

export default function AQIGauge({ value, size = 120, label }: AQIGaugeProps) {
  const [animated, setAnimated] = useState(0);
  const cat = getAQICategory(value);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, value / 500);
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#252830"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={cat.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)",
              filter: `drop-shadow(0 0 6px ${cat.color}40)`,
            }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold font-mono"
            style={{ color: cat.color }}
          >
            {animated}
          </span>
          <span className="text-[9px] text-gray-500 uppercase tracking-wider">
            AQI
          </span>
        </div>
      </div>
      {label && (
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ color: cat.color, backgroundColor: cat.color + "15" }}
        >
          {cat.label}
        </span>
      )}
    </div>
  );
}
