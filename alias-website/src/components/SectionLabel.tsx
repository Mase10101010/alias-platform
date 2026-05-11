import type { ReactNode } from "react";
import { CYAN } from "@/lib/tokens";

interface SectionLabelProps {
  children: ReactNode;
}

/**
 * Eyebrow label used at the top of every section:
 * a thin cyan rule + tracked uppercase text.
 */
export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="h-px w-8"
        style={{ background: CYAN, opacity: 0.6 }}
      />
      <span className="eyebrow">{children}</span>
    </div>
  );
}
