import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  active: boolean;
};

export function AISuggestionNotificationDot({ active }: Props) {
  const reduceMotion = useReducedMotion();

  if (!active) return null;

  return (
    <span
      className="pointer-events-none absolute right-0 top-0"
      aria-hidden="true"
    >
      {!reduceMotion && (
        <motion.span
          className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-cyanAlias"
          animate={{
            scale: [1, 2.4],
            opacity: [0.65, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: 'easeOut',
          }}
        />
      )}
      <span className="relative block h-2.5 w-2.5 rounded-full border-2 border-ink bg-cyanAlias" />
    </span>
  );
}
