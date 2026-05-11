import { motion } from "framer-motion";
import { CYAN } from "@/lib/tokens";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { ChatBubble } from "@/components/ChatBubble";
import { TypingDots } from "@/components/TypingDots";
import { Stat } from "@/components/Stat";
import { MiniChart } from "@/components/Charts";

const BOOKING_ROWS: ReadonlyArray<readonly [string, string, string]> = [
  ["19:00", "Almeida · 2", "Terrace"],
  ["19:30", "Okonkwo · 4", "Window"],
  ["20:00", "Tan + party · 6", "Private"],
];

/**
 * The premium hero mockup. Two-column UI:
 *  - left: live concierge conversation
 *  - right: reservation flow dashboard
 * Plus two floating side cards on lg+ for spatial depth.
 */
export function HeroMockup() {
  return (
    <div className="relative max-w-[1100px] mx-auto">
      {/* Soft glow under the card */}
      <div
        className="absolute -inset-6 -z-10 rounded-3xl"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${CYAN}25 0%, transparent 60%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Main card */}
      <div
        className="relative rounded-2xl overflow-hidden border"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,21,24,0.9) 0%, rgba(10,12,14,0.9) 100%)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow:
            "0 60px 120px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          </div>
          <div className="flex-1 text-center">
            <span
              className="text-[10.5px] text-white/35 font-sans-tight"
              style={{ letterSpacing: "0.18em" }}
            >
              alias.app / maison-lumière
            </span>
          </div>
          <div className="w-12" />
        </div>

        <div className="grid md:grid-cols-[1fr_1.2fr]">
          {/* LEFT: chat */}
          <div
            className="p-5 md:p-7 border-b md:border-b-0 md:border-r"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: `${CYAN}18`,
                  border: `1px solid ${CYAN}40`,
                }}
              >
                <span
                  className="font-display"
                  style={{ color: CYAN, fontSize: 12 }}
                >
                  A
                </span>
              </div>
              <div>
                <p className="text-white text-[12.5px] font-sans-tight">
                  Alias Concierge
                </p>
                <p className="text-white/40 text-[10px] font-sans-tight">
                  Active · 0.4s avg response
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <ChatBubble side="left">
                Hi — could I move my reservation tomorrow night to 8:30 instead
                of 7?
              </ChatBubble>
              <ChatBubble side="right" highlight>
                Of course, Mr. Almeida. I've moved your table for two from 7:00
                to <span style={{ color: CYAN }}>8:30 PM</span> on Friday, May
                15. The terrace table is still yours.
              </ChatBubble>
              <ChatBubble side="left">
                Wonderful. We'll be celebrating an anniversary — anything
                special?
              </ChatBubble>
              <ChatBubble side="right" highlight>
                Noted with the kitchen. Chef has a complimentary amuse paired
                for the occasion. A confirmation is on its way to your email.
              </ChatBubble>
              <TypingDots />
            </div>
          </div>

          {/* RIGHT: dashboard */}
          <div className="p-5 md:p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p
                  className="text-[10px] text-white/40 uppercase font-sans-tight"
                  style={{ letterSpacing: "0.25em" }}
                >
                  Tonight · Service
                </p>
                <p
                  className="text-white text-lg mt-1 font-display"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Reservation flow
                </p>
              </div>
              <span
                className="text-[10px] px-2 py-1 rounded-full font-sans-tight"
                style={{
                  background: `${CYAN}12`,
                  color: CYAN,
                  border: `1px solid ${CYAN}30`,
                  letterSpacing: "0.1em",
                }}
              >
                LIVE
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Stat label="Covers" value="84" delta="+12" />
              <Stat label="Avg. response" value="0.4s" delta="−18%" />
              <Stat label="Handled by Alias" value="96%" cyan />
            </div>

            <MiniChart />

            {/* Booking rows */}
            <div className="mt-5 space-y-2">
              {BOOKING_ROWS.map(([t, n, r], i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + i * 0.15, duration: 0.6 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  <span className="text-[11px] text-white/45 w-10 font-sans-tight">
                    {t}
                  </span>
                  <span className="text-[12.5px] text-white/85 flex-1 font-sans-tight">
                    {n}
                  </span>
                  <span
                    className="text-[10.5px] text-white/40 font-sans-tight"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {r}
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: CYAN }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating LEFT card */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1.6, duration: 0.9, ease: EASE_OUT_EXPO }}
        className="hidden lg:flex absolute -left-10 top-1/3 items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl"
        style={{
          background: "rgba(14,17,20,0.85)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: `${CYAN}18`,
            border: `1px solid ${CYAN}40`,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke={CYAN}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-[11px] text-white/50 font-sans-tight">
            Cancellation
          </p>
          <p className="text-[12.5px] text-white font-sans-tight">
            Rebooked automatically
          </p>
        </div>
      </motion.div>

      {/* Floating RIGHT card */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1.8, duration: 0.9, ease: EASE_OUT_EXPO }}
        className="hidden lg:block absolute -right-8 top-20 px-4 py-3 rounded-xl border backdrop-blur-xl"
        style={{
          background: "rgba(14,17,20,0.85)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <p
          className="text-[10px] uppercase text-white/40 mb-1 font-sans-tight"
          style={{ letterSpacing: "0.2em" }}
        >
          This week
        </p>
        <p
          className="text-white text-2xl font-display"
          style={{ letterSpacing: "-0.02em" }}
        >
          1,247
          <span className="text-[11px] text-white/40 ml-1 font-sans-tight">
            requests handled
          </span>
        </p>
      </motion.div>
    </div>
  );
}
