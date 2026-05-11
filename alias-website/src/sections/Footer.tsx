import { AliasMark } from "@/components/AliasMark";
import { CYAN } from "@/lib/tokens";

interface LinkGroup {
  title: string;
  links: ReadonlyArray<string>;
}

const GROUPS: ReadonlyArray<LinkGroup> = [
  {
    title: "Product",
    links: [
      "Concierge",
      "Reservations",
      "Analytics",
      "Integrations",
      "Changelog",
    ],
  },
  {
    title: "Solutions",
    links: ["Restaurants", "Hotels", "Resorts", "Groups & estates"],
  },
  {
    title: "Company",
    links: ["About", "Press", "Careers", "Contact"],
  },
];

const LEGAL = ["Privacy", "Terms", "Security", "Status"] as const;

export function Footer() {
  return (
    <footer
      className="relative pt-24 pb-12 border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Massive backdrop ALIAS wordmark */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none overflow-hidden"
      >
        <span
          className="select-none whitespace-nowrap font-sans-tight"
          style={{
            fontWeight: 200,
            fontSize: "clamp(8rem, 22vw, 22rem)",
            lineHeight: 0.85,
            letterSpacing: "0.04em",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 80%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            transform: "translateY(15%)",
          }}
        >
          <span style={{ color: "rgba(127,227,230,0.08)" }}>A</span>LIAS
        </span>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-10 relative">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 mb-16">
          <div>
            <AliasMark size={22} />
            <p
              className="mt-6 text-white/45 text-[13.5px] max-w-[280px] leading-relaxed font-sans-tight"
              style={{ fontWeight: 300 }}
            >
              Premium AI concierge systems for restaurants, hotels, and
              resorts. Built quietly. Designed to feel like service.
            </p>
            <div className="mt-6 flex items-center gap-2">
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
                className="text-[11px] text-white/50 font-sans-tight"
                style={{ letterSpacing: "0.05em" }}
              >
                All systems operational
              </span>
            </div>
          </div>

          {GROUPS.map((g) => (
            <div key={g.title}>
              <p
                className="text-[10px] uppercase text-white/40 mb-5 font-sans-tight"
                style={{ letterSpacing: "0.28em" }}
              >
                {g.title}
              </p>
              <ul className="space-y-3">
                {g.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-white/65 hover:text-white text-[13.5px] transition-colors font-sans-tight"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-[12px] text-white/40 font-sans-tight">
            © 2026 Alias Systems. Crafted for hospitality.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL.map((l) => (
              <a
                key={l}
                href="#"
                className="text-[12px] text-white/45 hover:text-white/80 transition-colors font-sans-tight"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
