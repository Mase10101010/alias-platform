import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { ChatBubble } from "@/components/ChatBubble";
import { BigStat } from "@/components/Stat";
import { BigChart } from "@/components/Charts";
import { CYAN } from "@/lib/tokens";
import { EASE_OUT_EXPO } from "@/lib/motion";

type TabId = "concierge" | "reservations" | "analytics";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: ReadonlyArray<Tab> = [
  { id: "concierge", label: "Concierge" },
  { id: "reservations", label: "Reservations" },
  { id: "analytics", label: "Analytics" },
];

export function ProductPreview() {
  const [active, setActive] = useState<TabId>("concierge");

  return (
    <section className="py-28 md:py-36 relative" id="product">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="max-w-[820px] mb-16">
          <Reveal>
            <SectionLabel>The product</SectionLabel>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="text-white headline-section text-balance">
              An operations layer that{" "}
              <span style={{ fontStyle: "italic" }}>disappears</span> into your
              service.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p
              className="mt-6 text-white/55 leading-relaxed text-[16px] max-w-[600px] font-sans-tight"
              style={{ fontWeight: 300 }}
            >
              Three connected surfaces. One quiet, attentive system behind the
              scenes — built for the cadence of real hospitality.
            </p>
          </Reveal>
        </div>

        {/* Tabs */}
        <Reveal delay={1}>
          <div
            className="inline-flex p-1 rounded-full border mb-10"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className="relative px-4 py-1.5 text-[12.5px] rounded-full transition-colors font-sans-tight"
                style={{
                  color:
                    active === t.id ? "#0a0d0e" : "rgba(255,255,255,0.65)",
                }}
              >
                {active === t.id && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: CYAN }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 35,
                    }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={2}>
          <div
            className="rounded-2xl overflow-hidden border relative"
            style={{
              background:
                "linear-gradient(180deg, rgba(18,21,24,0.9) 0%, rgba(10,12,14,0.92) 100%)",
              borderColor: "rgba(255,255,255,0.08)",
              boxShadow: "0 60px 120px -30px rgba(0,0,0,0.7)",
            }}
          >
            <AnimatePresence mode="wait">
              {active === "concierge" && <ConciergePanel key="c" />}
              {active === "reservations" && <ReservationsPanel key="r" />}
              {active === "analytics" && <AnalyticsPanel key="a" />}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Panels                                                             */
/* ------------------------------------------------------------------ */

function PanelWrap({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      className="p-6 md:p-10"
    >
      {children}
    </motion.div>
  );
}

function ConciergePanel() {
  const meta: ReadonlyArray<readonly [string, string]> = [
    ["Sentiment", "Warm"],
    ["Intent", "Modify reservation"],
    ["Resolution", "Self-served"],
    ["Handoff", "Not required"],
  ];

  return (
    <PanelWrap>
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-8">
        <div>
          <p
            className="text-[10px] uppercase text-white/40 mb-2 font-sans-tight"
            style={{ letterSpacing: "0.25em" }}
          >
            Active conversation
          </p>
          <p
            className="text-white text-xl mb-1 font-display"
            style={{ letterSpacing: "-0.01em" }}
          >
            Sebastián Almeida
          </p>
          <p className="text-white/40 text-[12.5px] mb-6 font-sans-tight">
            VIP · 14 prior visits · prefers terrace
          </p>

          <div className="space-y-3">
            {meta.map(([k, v]) => (
              <div key={k} className="flex justify-between text-[12.5px]">
                <span className="text-white/40 font-sans-tight">{k}</span>
                <span className="text-white/85 font-sans-tight">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl p-5 border"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <div className="space-y-3.5">
            <ChatBubble side="left">
              Can we make it 8:30 instead of 7? And could the kitchen
              accommodate shellfish allergy for one in our party?
            </ChatBubble>
            <ChatBubble side="right" highlight>
              Of course. Moved to{" "}
              <span style={{ color: CYAN }}>8:30 PM</span> on Friday. Allergy
              flagged for the kitchen with confirmation from Chef Aurel.
            </ChatBubble>
            <ChatBubble side="left">Thank you — see you Friday.</ChatBubble>
            <ChatBubble side="right" highlight>
              Looking forward to having you back. Confirmation sent to your
              email.
            </ChatBubble>
          </div>
        </div>
      </div>
    </PanelWrap>
  );
}

type ReservationRow = readonly [string, string, number, string, string];

const RESERVATIONS: ReadonlyArray<ReservationRow> = [
  ["18:30", "Lindqvist", 2, "Bar", "Confirmed"],
  ["19:00", "Almeida", 2, "Terrace", "Modified"],
  ["19:30", "Okonkwo", 4, "Window", "Confirmed"],
  ["20:00", "Tan + party", 6, "Private", "VIP"],
  ["20:30", "De Luca", 3, "Main", "Confirmed"],
  ["21:00", "Karimov", 2, "Terrace", "New"],
];

function ReservationsPanel() {
  const filters = ["All", "Terrace", "Private", "Bar"] as const;

  return (
    <PanelWrap>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p
            className="text-[10px] uppercase text-white/40 font-sans-tight"
            style={{ letterSpacing: "0.25em" }}
          >
            Friday · 15 May
          </p>
          <p className="text-white text-xl mt-1 font-display">
            Reservations · dinner service
          </p>
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f, i) => (
            <span
              key={f}
              className="text-[11px] px-2.5 py-1 rounded-full border font-sans-tight"
              style={{
                borderColor:
                  i === 0 ? CYAN + "50" : "rgba(255,255,255,0.08)",
                color: i === 0 ? CYAN : "rgba(255,255,255,0.55)",
                background: i === 0 ? CYAN + "10" : "transparent",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div
        className="overflow-hidden rounded-xl border"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="grid grid-cols-[80px_1fr_60px_120px_120px] px-4 py-3 text-[10px] uppercase text-white/40 font-sans-tight"
          style={{
            background: "rgba(255,255,255,0.02)",
            letterSpacing: "0.18em",
          }}
        >
          <span>Time</span>
          <span>Guest</span>
          <span>Party</span>
          <span>Section</span>
          <span>Status</span>
        </div>
        {RESERVATIONS.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="grid grid-cols-[80px_1fr_60px_120px_120px] px-4 py-3.5 text-[13px] text-white/85 border-t items-center font-sans-tight"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}
          >
            <span className="text-white/55">{r[0]}</span>
            <span>{r[1]}</span>
            <span className="text-white/55">{r[2]}</span>
            <span className="text-white/55">{r[3]}</span>
            <span
              className="text-[10.5px] px-2 py-0.5 rounded justify-self-start"
              style={{
                background:
                  r[4] === "VIP"
                    ? CYAN + "18"
                    : r[4] === "New"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.04)",
                color: r[4] === "VIP" ? CYAN : "rgba(255,255,255,0.65)",
                letterSpacing: "0.1em",
              }}
            >
              {r[4].toUpperCase()}
            </span>
          </motion.div>
        ))}
      </div>
    </PanelWrap>
  );
}

type ChannelRow = readonly [string, number];

const CHANNELS: ReadonlyArray<ChannelRow> = [
  ["WhatsApp", 38],
  ["Web chat", 24],
  ["Email", 18],
  ["Phone", 14],
  ["Instagram", 6],
];

function AnalyticsPanel() {
  return (
    <PanelWrap>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <BigStat label="Requests handled" value="12,840" trend="+34%" />
        <BigStat label="Avg. resolution time" value="0.4s" trend="−18%" />
        <BigStat
          label="No-show reduction"
          value="42%"
          trend="vs. industry"
          cyan
        />
      </div>
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-4">
        <div
          className="p-5 rounded-xl border"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <p
            className="text-[10px] uppercase text-white/40 mb-3 font-sans-tight"
            style={{ letterSpacing: "0.22em" }}
          >
            Requests by hour
          </p>
          <BigChart />
        </div>
        <div
          className="p-5 rounded-xl border"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <p
            className="text-[10px] uppercase text-white/40 mb-4 font-sans-tight"
            style={{ letterSpacing: "0.22em" }}
          >
            Channel mix
          </p>
          {CHANNELS.map(([k, v]) => (
            <div key={k} className="mb-3">
              <div className="flex justify-between text-[11.5px] mb-1.5">
                <span className="text-white/65 font-sans-tight">{k}</span>
                <span className="text-white/40 font-sans-tight">{v}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${v}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                  className="h-full rounded-full"
                  style={{ background: CYAN }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelWrap>
  );
}
