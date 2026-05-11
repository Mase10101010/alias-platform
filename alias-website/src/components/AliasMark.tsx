import { CYAN_DEEP } from "@/lib/tokens";

interface AliasMarkProps {
  size?: number;
  showWord?: boolean;
}

/**
 * Alias brand mark — the "A" with cyan gradient + ALIAS wordmark.
 * Used in Nav, Footer, and the hero mockup.
 */
export function AliasMark({ size = 22, showWord = true }: AliasMarkProps) {
  return (
    <div
      className="flex items-center gap-2.5 select-none"
      style={{ height: size * 1.1 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="aliasA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8F4F6" />
            <stop offset="100%" stopColor={CYAN_DEEP} />
          </linearGradient>
        </defs>
        <path
          d="M12 2 L21 22 H17.2 L15.6 18 H8.4 L6.8 22 H3 Z M9.6 15 H14.4 L12 9 Z"
          fill="url(#aliasA)"
        />
      </svg>
      {showWord && (
        <span
          className="text-white font-light font-sans-tight"
          style={{
            fontSize: size * 0.78,
            letterSpacing: "0.28em",
            paddingLeft: "0.05em",
          }}
        >
          ALIAS
        </span>
      )}
    </div>
  );
}
