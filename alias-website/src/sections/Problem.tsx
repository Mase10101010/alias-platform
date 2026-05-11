import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

interface ProblemItem {
  n: string;
  title: string;
  text: string;
}

const ITEMS: ReadonlyArray<ProblemItem> = [
  {
    n: "01",
    title: "Missed bookings",
    text: "Calls go unanswered after hours. Reservation requests sit in inboxes until morning, lost to a faster competitor.",
  },
  {
    n: "02",
    title: "Repetitive communication",
    text: "Hosts answer the same questions hundreds of times a week. Hours that should belong to guests, spent on coordination.",
  },
  {
    n: "03",
    title: "Late-night requests",
    text: "Guests live everywhere. Your team doesn't. Inquiries arrive at 2 AM and require an answer that doesn't come.",
  },
  {
    n: "04",
    title: "Inconsistent experience",
    text: "Tone, accuracy, and attention drift across shifts. Your brand standard is only as strong as your weakest service.",
  },
];

export function Problem() {
  return (
    <section className="py-28 md:py-36 relative">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal>
          <SectionLabel>The problem</SectionLabel>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="text-white max-w-[820px] headline-section text-balance">
            Hospitality runs on{" "}
            <span style={{ fontStyle: "italic" }}>presence</span> —
            <br />
            but presence doesn't scale.
          </h2>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-2 gap-x-16 gap-y-14">
          {ITEMS.map((it, i) => (
            <Reveal key={it.n} delay={i + 2}>
              <div className="flex gap-6">
                <span
                  className="text-white/30 text-[13px] pt-1 font-display"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {it.n}
                </span>
                <div>
                  <h3
                    className="text-white text-xl mb-3 font-display"
                    style={{ fontWeight: 400, letterSpacing: "-0.01em" }}
                  >
                    {it.title}
                  </h3>
                  <p
                    className="text-white/55 leading-relaxed text-[15px] font-sans-tight"
                    style={{ fontWeight: 300 }}
                  >
                    {it.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
