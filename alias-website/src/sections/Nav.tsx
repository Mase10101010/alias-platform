import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AliasMark } from "@/components/AliasMark";
import { CYAN } from "@/lib/tokens";
import { EASE_OUT_EXPO } from "@/lib/motion";

const links: ReadonlyArray<readonly [string, string]> = [
  ["Product", "#product"],
  ["Solutions", "#solutions"],
  ["Pricing", "#pricing"],
  ["Contact", "#contact"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: scrolled ? "blur(20px) saturate(140%)" : "blur(0px)",
        background: scrolled ? "rgba(8,10,12,0.72)" : "transparent",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        transition: "all 0.5s ease",
      }}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#" aria-label="Alias home">
          <AliasMark size={20} />
        </a>
        <nav className="hidden md:flex items-center gap-9">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[13px] text-white/70 hover:text-white transition-colors font-sans-tight"
              style={{ letterSpacing: "0.01em" }}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden md:inline-block text-[13px] text-white/70 hover:text-white transition-colors font-sans-tight"
          >
            Sign in
          </a>
          <a
            href="#trial"
            className="text-[12.5px] px-4 py-2 rounded-full border transition-all duration-300 font-sans-tight"
            style={{
              color: "#0a0d0e",
              background: CYAN,
              borderColor: CYAN,
              letterSpacing: "0.01em",
              boxShadow: `0 0 0 0 ${CYAN}40`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = `0 0 30px 0 ${CYAN}40`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = `0 0 0 0 ${CYAN}40`)
            }
          >
            Start free trial
          </a>
          <button
            className="md:hidden text-white/80 ml-1"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/5"
            style={{ background: "rgba(8,10,12,0.95)" }}
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-white/80 text-sm font-sans-tight"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
