import { CYAN } from "@/lib/tokens";

/**
 * Small cyan-bordered checkmark icon used in feature lists.
 */
export function CheckIcon() {
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ border: `1px solid ${CYAN}50`, background: `${CYAN}10` }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13l4 4L19 7"
          stroke={CYAN}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
