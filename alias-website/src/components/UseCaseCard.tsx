import { CYAN } from "@/lib/tokens";

export interface UseCaseCardProps {
  tag: string;
  title: string;
  body: string;
  featured?: boolean;
}

/**
 * Use-case card. Restaurants is featured (primary launch vertical) with
 * a subtle cyan glow and a "LAUNCH" badge.
 */
export function UseCaseCard({ tag, title, body, featured }: UseCaseCardProps) {
  return (
    <div
      className="group relative p-8 md:p-10 rounded-2xl border overflow-hidden h-full transition-all duration-500"
      style={{
        background: featured
          ? `linear-gradient(160deg, rgba(127,227,230,0.06) 0%, rgba(10,12,14,0.5) 60%)`
          : "rgba(255,255,255,0.015)",
        borderColor: featured ? `${CYAN}25` : "rgba(255,255,255,0.06)",
      }}
    >
      {/* Hover ornament */}
      <div
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, ${CYAN}15 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      <div className="relative flex items-center justify-between mb-8">
        <span
          className="text-[10px] uppercase font-sans-tight"
          style={{
            color: featured ? CYAN : "rgba(255,255,255,0.4)",
            letterSpacing: "0.28em",
          }}
        >
          {tag}
        </span>
        {featured && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-sans-tight"
            style={{
              background: `${CYAN}15`,
              color: CYAN,
              border: `1px solid ${CYAN}30`,
              letterSpacing: "0.1em",
            }}
          >
            LAUNCH
          </span>
        )}
      </div>

      <h3
        className="text-white text-3xl md:text-4xl mb-4 font-display"
        style={{
          fontWeight: 400,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>
      <p
        className="text-white/55 leading-relaxed text-[15px] max-w-[420px] font-sans-tight"
        style={{ fontWeight: 300 }}
      >
        {body}
      </p>

      <div className="mt-10 flex items-center gap-2 text-[12.5px] text-white/45 group-hover:text-white transition-colors">
        <span className="font-sans-tight">Learn more</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}
