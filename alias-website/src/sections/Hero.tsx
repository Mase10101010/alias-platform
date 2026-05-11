import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CYAN } from "@/lib/tokens";
import { fadeUp, EASE_OUT_EXPO } from "@/lib/motion";
import { HeroMockup } from "@/components/HeroMockup";

const LOGOS = [
  "MAISON·LUMIÈRE",
  "AURELIA",
  "NORDÅ",
  "THE CONSERVATORY",
  "VELLUM HOTEL",
  "OKURA",
] as const;

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden"
    >
      {/* Background atmosphere ---------------------------------------------- */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse at 50% 30%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 30%, black 30%, transparent 80%)",
          }}
        />
        {/* Cyan glow */}
        <motion.div
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(ellipse, ${CYAN}1c 0%, transparent 60%)`,
            filter: "blur(60px)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: "linear-gradient(to bottom, transparent, #06080a)",
          }}
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="max-w-content mx-auto px-6 md:px-10"
      >
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="flex justify-center mb-10"
        >
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: CYAN, opacity: 0.5 }}
              />
              <span
                className="relative rounded-full h-1.5 w-1.5"
                style={{ background: CYAN }}
              />
            </span>
            <span
              className="text-[11px] text-white/70 uppercase font-sans-tight"
              style={{ letterSpacing: "0.22em" }}
            >
              Now in private beta · Hospitality OS
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={1}
          className="text-center text-white mx-auto max-w-[980px] headline-hero text-balance"
        >
          24/7 AI concierge
          <br />
          for{" "}
          <span style={{ fontStyle: "italic", fontWeight: 300 }}>
            modern hospitality
          </span>
          <span style={{ color: CYAN }}>.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={3}
          className="mt-8 text-center text-white/55 mx-auto max-w-[640px] text-[16px] md:text-[17px] leading-relaxed font-sans-tight"
          style={{ fontWeight: 300 }}
        >
          Alias automates reservations, guest communication, and operations
          with premium AI systems designed for restaurants, hotels, and resorts.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={4}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#trial"
            className="group relative px-6 py-3 rounded-full text-[13.5px] transition-all duration-300 font-sans-tight"
            style={{
              color: "#0a0d0e",
              background: CYAN,
              boxShadow: `0 0 40px ${CYAN}25`,
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start free trial
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </span>
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-full text-[13.5px] text-white/85 border transition-all duration-300 hover:bg-white/5 hover:text-white font-sans-tight"
            style={{ borderColor: "rgba(255,255,255,0.14)" }}
          >
            Book a demo
          </a>
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.7, ease: EASE_OUT_EXPO }}
          className="mt-20 md:mt-24"
        >
          <HeroMockup />
        </motion.div>

        {/* Logo strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-20 md:mt-28"
        >
          <p
            className="text-center text-[10.5px] text-white/35 uppercase mb-7 font-sans-tight"
            style={{ letterSpacing: "0.34em" }}
          >
            Trusted by establishments that define hospitality
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50">
            {LOGOS.map((n) => (
              <span
                key={n}
                className="text-white/60 text-[12px] font-display"
                style={{
                  letterSpacing: "0.18em",
                  fontWeight: 300,
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
