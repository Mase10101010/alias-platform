import { CYAN } from "@/lib/tokens";

interface StatProps {
  label: string;
  value: string;
  delta?: string;
  cyan?: boolean;
}

/**
 * Small metric card used inside the hero mockup.
 */
export function Stat({ label, value, delta, cyan }: StatProps) {
  return (
    <div
      className="p-3 rounded-lg border"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <p
        className="text-[10px] uppercase text-white/40 mb-1 font-sans-tight"
        style={{ letterSpacing: "0.18em" }}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-white text-xl font-display"
          style={{
            letterSpacing: "-0.02em",
            color: cyan ? CYAN : undefined,
          }}
        >
          {value}
        </span>
        {delta && (
          <span className="text-[10px] text-white/40 font-sans-tight">
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

interface BigStatProps {
  label: string;
  value: string;
  trend: string;
  cyan?: boolean;
}

/**
 * Larger metric card used in the analytics panel.
 */
export function BigStat({ label, value, trend, cyan }: BigStatProps) {
  return (
    <div
      className="p-5 rounded-xl border"
      style={{
        background: "rgba(255,255,255,0.015)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <p
        className="text-[10px] uppercase text-white/40 font-sans-tight"
        style={{ letterSpacing: "0.22em" }}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-2">
        <span
          className="text-3xl font-display"
          style={{
            letterSpacing: "-0.02em",
            color: cyan ? CYAN : "white",
          }}
        >
          {value}
        </span>
        <span className="text-[11px] text-white/45 font-sans-tight">
          {trend}
        </span>
      </div>
    </div>
  );
}
