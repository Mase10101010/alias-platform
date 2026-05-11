import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CYAN } from "@/lib/tokens";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface ChatBubbleProps {
  side: "left" | "right";
  children: ReactNode;
  highlight?: boolean;
}

/**
 * Premium concierge chat bubble.
 * `right` side bubbles are Alias responses; `left` are guest messages.
 */
export function ChatBubble({ side, children, highlight }: ChatBubbleProps) {
  const isRight = side === "right";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      className="flex justify-start"
    >
      <div
        className="max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-snug font-sans-tight"
        style={{
          color: isRight ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)",
          background: isRight ? "rgba(255,255,255,0.04)" : "transparent",
          border: isRight
            ? `1px solid ${highlight ? CYAN + "25" : "rgba(255,255,255,0.06)"}`
            : "1px solid rgba(255,255,255,0.06)",
          borderTopLeftRadius: 6,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
