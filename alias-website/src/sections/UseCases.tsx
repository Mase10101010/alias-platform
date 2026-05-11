import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { UseCaseCard, type UseCaseCardProps } from "@/components/UseCaseCard";

const CASES: ReadonlyArray<UseCaseCardProps> = [
  {
    tag: "Primary vertical",
    title: "Restaurants",
    body: "From neighborhood bistros to Michelin-starred destinations. Alias handles reservations, modifications, allergens, and waitlists with a host's discretion.",
    featured: true,
  },
  {
    tag: "Property operations",
    title: "Hotels",
    body: "Pre-arrival concierge, in-stay requests, and post-stay follow-ups. Multilingual, on-brand, and integrated with your PMS.",
  },
  {
    tag: "Estates & retreats",
    title: "Resorts",
    body: "Coordinate across spa, dining, activities, and transport. One guest, one continuous conversation across every touchpoint.",
  },
  {
    tag: "Quiet luxury",
    title: "Luxury hospitality",
    body: "For brands where every word matters. Alias is trained on your tone, your standards, and your guest history.",
  },
];

export function UseCases() {
  return (
    <section className="py-28 md:py-36 relative">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="max-w-[820px] mb-16">
          <Reveal>
            <SectionLabel>Use cases</SectionLabel>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="text-white headline-section text-balance">
              Designed for places where{" "}
              <span style={{ fontStyle: "italic" }}>
                service is the product
              </span>
              .
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={i + 1}>
              <UseCaseCard {...c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
