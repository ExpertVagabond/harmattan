import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleFieldProps {
  aqi: number;
}

const AQI_COLORS = ["#4ade80", "#facc15", "#fb923c", "#f87171", "#a855f7", "#7f1d1d"];

function aqiToConfig(aqi: number) {
  const count = Math.min(200, Math.max(20, Math.round(aqi * 1.2)));
  const speed = 0.15 + (aqi / 500) * 0.6;
  const maxSize = 1.5 + (aqi / 500) * 3;
  const idx = aqi <= 50 ? 0 : aqi <= 100 ? 1 : aqi <= 150 ? 2 : aqi <= 200 ? 3 : aqi <= 300 ? 4 : 5;
  return { count, speed, maxSize, color: AQI_COLORS[idx] };
}

export default function ParticleField({ aqi }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    const config = aqiToConfig(aqi);
    const particles: Particle[] = [];

    for (let i = 0; i < config.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * config.speed * (0.5 + Math.random()),
        vy: Math.sin(angle) * config.speed * (0.5 + Math.random()) - 0.1,
        size: 0.5 + Math.random() * config.maxSize,
        opacity: 0.1 + Math.random() * 0.4,
        color: config.color,
      });
    }

    let time = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      time += 0.005;

      for (const p of particles) {
        // Drift with slight wind from right + turbulence
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.15;
        p.y += p.vy + Math.cos(time + p.x * 0.01) * 0.1;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Pulsing opacity
        const pulse = 0.7 + Math.sin(time * 2 + p.x * 0.02) * 0.3;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * pulse;
        ctx.fill();
      }

      // Draw faint connection lines between nearby particles
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < 4000) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [aqi]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
