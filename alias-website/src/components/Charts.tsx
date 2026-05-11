import { motion } from "framer-motion";
import { CYAN } from "@/lib/tokens";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * Compact animated area chart used inside the hero mockup.
 * Plots a generic 12-hour conversation volume curve.
 */
export function MiniChart() {
  const points = [10, 18, 14, 28, 22, 38, 32, 44, 50, 46, 58, 64];
  const max = Math.max(...points);
  const w = 100;
  const h = 60;
  const step = w / (points.length - 1);
  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`
    )
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div
      className="p-3 rounded-lg border"
      style={{
        background: "rgba(255,255,255,0.015)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] text-white/40 uppercase font-sans-tight"
          style={{ letterSpacing: "0.2em" }}
        >
          Conversations · 12h
        </span>
        <span
          className="text-[10px] font-sans-tight"
          style={{ color: CYAN }}
        >
          +42%
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.35" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill="url(#chartFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
        />
        <motion.path
          d={path}
          stroke={CYAN}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 1.8, ease: EASE_OUT_EXPO }}
        />
      </svg>
    </div>
  );
}

/**
 * Tall bar chart used in the analytics panel.
 * Peak service hours (dinner) highlighted in cyan.
 */
export function BigChart() {
  const bars = [
    8, 6, 4, 3, 4, 7, 12, 18, 22, 19, 16, 14, 18, 24, 28, 26, 22, 30, 38, 44, 36,
    22, 14, 10,
  ];
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-[3px] h-32">
      {bars.map((b, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${(b / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{
            delay: i * 0.02,
            duration: 0.6,
            ease: EASE_OUT_EXPO,
          }}
          className="flex-1 rounded-sm"
          style={{
            background:
              i >= 18 && i <= 21
                ? `linear-gradient(to top, ${CYAN}, ${CYAN}40)`
                : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}
