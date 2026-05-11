import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { Problem } from "@/sections/Problem";
import { Solution } from "@/sections/Solution";
import { ProductPreview } from "@/sections/ProductPreview";
import { UseCases } from "@/sections/UseCases";
import { Trial } from "@/sections/Trial";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";

/**
 * Alias — root composition.
 * Section order is intentional and matches the brand brief.
 */
export default function App() {
  return (
    <div className="min-h-screen relative bg-ink text-white font-sans-tight">
      {/* Subtle global grain overlay — pure atmosphere */}
      <div
        aria-hidden
        className="grain-overlay fixed inset-0 pointer-events-none z-[1] opacity-[0.025] mix-blend-overlay"
      />

      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <ProductPreview />
        <UseCases />
        <Trial />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
