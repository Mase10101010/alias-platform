/**
 * Brand design tokens.
 * Single source of truth for colors used in inline styles
 * where Tailwind classes can't be used (e.g. SVG fills, dynamic gradients).
 */

export const CYAN = "#7FE3E6";
export const CYAN_DEEP = "#5BC8CC";
export const INK = "#06080a";
export const INK_50 = "#0a0d0e";

export const BORDER = {
  soft: "rgba(255,255,255,0.06)",
  medium: "rgba(255,255,255,0.1)",
  strong: "rgba(255,255,255,0.14)",
} as const;

export const SURFACE = {
  card: "linear-gradient(180deg, rgba(18,21,24,0.9) 0%, rgba(10,12,14,0.9) 100%)",
  faint: "rgba(255,255,255,0.015)",
  raised: "rgba(255,255,255,0.02)",
} as const;
