import { motion } from "framer-motion";
import { CYAN } from "@/lib/tokens";

/**
 * A trio of cyan dots that fade in/out — concierge typing indicator.
 */
export function TypingDots() {
  return (
    <div className="flex gap-1.5 pl-1 pt-1">
      {[0, 0.2, 0.4].map((delay) => (
        <motion.span
          key={delay}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.4, repeat: Infinity, delay }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: CYAN }}
        />
      ))}
    </div>
  );
}
