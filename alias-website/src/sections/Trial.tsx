import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { CheckIcon } from "@/components/CheckIcon";
import { CYAN } from "@/lib/tokens";

const FEATURES = [
  "14-day free trial",
  "No installation required",
  "Cloud-based platform",
  "Cancel anytime",
] as const;

export function Trial() {
  return (
    <section className="py-28 md:py-36 relative" id="trial">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal>
          <div
            className="relative rounded-3xl overflow-hidden border p-10 md:p-16 text-center"
            style={{
              background:
                "linear-gradient(180deg, rgba(18,22,26,0.95) 0%, rgba(8,10,12,0.95) 100%)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            {/* Soft glow */}
            <div
              className="absolute inset-0 -z-10 opacity-60"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${CYAN}1f 0%, transparent 60%)`,
              }}
            />
            {/* Faint grid */}
            <div
              className="absolute inset-0 -z-10 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            <div className="flex justify-center">
              <SectionLabel>Free trial</SectionLabel>
            </div>
            <h2 className="text-white mt-2 max-w-[820px] mx-auto headline-section text-balance">
              Try Alias for{" "}
              <span style={{ color: CYAN, fontStyle: "italic" }}>
                fourteen days
              </span>
              .
              <br />
              The first night, you'll notice the silence.
            </h2>
            <p
              className="mt-7 text-white/55 max-w-[560px] mx-auto text-[16px] leading-relaxed font-sans-tight"
              style={{ fontWeight: 300 }}
            >
              No installation. Cloud-based, fully managed. Continue on a
              monthly subscription whenever you're ready — or don't.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#contact"
                className="px-7 py-3.5 rounded-full text-[13.5px] font-sans-tight"
                style={{
                  color: "#0a0d0e",
                  background: CYAN,
                  boxShadow: `0 0 40px ${CYAN}30`,
                }}
              >
                Start your free trial
              </a>
              <a
                href="#contact"
                className="px-7 py-3.5 rounded-full text-[13.5px] text-white/85 border hover:bg-white/5 transition-all font-sans-tight"
                style={{ borderColor: "rgba(255,255,255,0.14)" }}
              >
                Talk to a specialist
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-white/65 text-[13px] font-sans-tight">
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
