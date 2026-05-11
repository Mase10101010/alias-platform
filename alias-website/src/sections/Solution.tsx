import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { CheckIcon } from "@/components/CheckIcon";
import { CYAN } from "@/lib/tokens";

const CAPABILITIES = [
  "Reservations",
  "Modifications",
  "Cancellations",
  "Guest questions",
  "Service recovery",
  "Operations",
] as const;

type InboxRow = readonly [string, string, string, boolean];

const INBOX: ReadonlyArray<InboxRow> = [
  ["WhatsApp", "Anna — table for 6, Saturday", "2m", true],
  ["Email", "Mr. Hayashi — allergy notes", "5m", true],
  ["Phone", "Voicemail transcribed · party of 2", "12m", true],
  ["Instagram", "DM — private event inquiry", "18m", false],
  ["Web chat", "Returning guest, anniversary", "24m", true],
];

export function Solution() {
  return (
    <section className="py-28 md:py-36 relative" id="solutions">
      {/* Atmospheric divider */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
        }}
      />
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-start">
          <div>
            <Reveal>
              <SectionLabel>AI guest operations</SectionLabel>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="text-white headline-section text-balance">
                Not a chatbot.
                <br />
                A <span style={{ fontStyle: "italic" }}>second house</span>{" "}
                that never sleeps
                <span style={{ color: CYAN }}>.</span>
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p
                className="mt-7 text-white/55 leading-relaxed text-[16px] max-w-[480px] font-sans-tight"
                style={{ fontWeight: 300 }}
              >
                Alias understands your menu, your tables, your tone, and your
                policies. It speaks to guests with the discretion of a trained
                maître d', and the consistency of infrastructure. Twenty-four
                hours a day. Every channel. Every language.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3">
              {CAPABILITIES.map((c, i) => (
                <Reveal key={c} delay={i + 3}>
                  <div
                    className="flex items-center gap-3 py-2.5 border-b"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <CheckIcon />
                    <span className="text-white/80 text-[14px] font-sans-tight">
                      {c}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={2}>
            <SolutionVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SolutionVisual() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-8 rounded-3xl -z-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${CYAN}18 0%, transparent 60%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        className="rounded-2xl overflow-hidden border p-7"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,21,24,0.9) 0%, rgba(10,12,14,0.92) 100%)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p
              className="text-[10px] uppercase text-white/40 font-sans-tight"
              style={{ letterSpacing: "0.25em" }}
            >
              Channels · Today
            </p>
            <p className="text-white text-lg mt-1 font-display">
              Unified inbox
            </p>
          </div>
          <span
            className="text-[10px] px-2.5 py-1 rounded-full border font-sans-tight"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.12em",
            }}
          >
            7 SOURCES
          </span>
        </div>

        <div className="space-y-2.5">
          {INBOX.map(([ch, msg, t, ok], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                className="text-[10px] uppercase text-white/40 w-20 font-sans-tight"
                style={{ letterSpacing: "0.15em" }}
              >
                {ch}
              </span>
              <span className="flex-1 text-[13px] text-white/85 font-sans-tight">
                {msg}
              </span>
              <span className="text-[11px] text-white/35 font-sans-tight">
                {t}
              </span>
              {ok ? (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-sans-tight"
                  style={{
                    background: `${CYAN}12`,
                    color: CYAN,
                    letterSpacing: "0.05em",
                  }}
                >
                  RESOLVED
                </span>
              ) : (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded text-white/40 font-sans-tight"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    letterSpacing: "0.05em",
                  }}
                >
                  HUMAN
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <div
          className="mt-5 pt-5 flex items-center justify-between border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="text-[11px] text-white/50 font-sans-tight">
            94% resolved without staff intervention
          </span>
          <span
            className="text-[11px] font-sans-tight"
            style={{ color: CYAN }}
          >
            View activity →
          </span>
        </div>
      </div>
    </div>
  );
}
