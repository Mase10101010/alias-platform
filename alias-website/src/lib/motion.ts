import type { Variants } from "framer-motion";

/**
 * Premium easing curve used across Alias.
 * A custom cubic-bezier that feels expensive — not bouncy, not linear.
 */
export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

/**
 * Subtle fade-up reveal used on most content blocks.
 * Accepts a custom `i` value to stagger.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.08,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, delay: i * 0.08, ease: EASE_OUT_EXPO },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 60 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1.4, ease: EASE_OUT_EXPO },
  },
};
