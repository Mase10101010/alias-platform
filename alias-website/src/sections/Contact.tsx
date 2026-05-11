import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { Field, ContactRow } from "@/components/Form";
import { CYAN } from "@/lib/tokens";

type ClientType = "Restaurant" | "Hotel" | "Resort" | "Group";

const CLIENT_TYPES: ReadonlyArray<ClientType> = [
  "Restaurant",
  "Hotel",
  "Resort",
  "Group",
];

interface FormState {
  name: string;
  business: string;
  email: string;
  type: ClientType;
  message: string;
}

export function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    business: "",
    email: "",
    type: "Restaurant",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In production: POST to /api/contact or similar.
    setSent(true);
  };

  return (
    <section className="py-28 md:py-36 relative" id="contact">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-14 lg:gap-24">
          <div>
            <Reveal>
              <SectionLabel>Get in touch</SectionLabel>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="text-white headline-section text-balance">
                Let's design your{" "}
                <span style={{ fontStyle: "italic" }}>second house</span>
                <span style={{ color: CYAN }}>.</span>
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p
                className="mt-6 text-white/55 leading-relaxed text-[16px] max-w-[480px] font-sans-tight"
                style={{ fontWeight: 300 }}
              >
                Tell us about your establishment. A member of the Alias team
                will respond personally within one business day.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div
                className="mt-10 pt-10 border-t space-y-5"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <ContactRow label="General" value="hello@alias.systems" />
                <ContactRow
                  label="Partnerships"
                  value="partners@alias.systems"
                />
                <ContactRow label="Press" value="press@alias.systems" />
              </div>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border p-7 md:p-9"
              style={{
                background: "rgba(255,255,255,0.015)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-5"
                  >
                    <Field
                      label="Name"
                      value={form.name}
                      onChange={(v) => setForm({ ...form, name: v })}
                    />
                    <Field
                      label="Business"
                      value={form.business}
                      onChange={(v) => setForm({ ...form, business: v })}
                    />
                    <Field
                      label="Work email"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                    />
                    <div>
                      <label
                        className="block text-[10px] uppercase text-white/40 mb-2 font-sans-tight"
                        style={{ letterSpacing: "0.25em" }}
                      >
                        Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CLIENT_TYPES.map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setForm({ ...form, type: t })}
                            className="px-3.5 py-1.5 rounded-full text-[12px] transition-all border font-sans-tight"
                            style={{
                              borderColor:
                                form.type === t
                                  ? CYAN + "50"
                                  : "rgba(255,255,255,0.1)",
                              background:
                                form.type === t
                                  ? CYAN + "12"
                                  : "transparent",
                              color:
                                form.type === t
                                  ? CYAN
                                  : "rgba(255,255,255,0.65)",
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-[10px] uppercase text-white/40 mb-2 font-sans-tight"
                        style={{ letterSpacing: "0.25em" }}
                      >
                        How can we help?
                      </label>
                      <textarea
                        rows={4}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        className="w-full bg-transparent border rounded-lg px-3.5 py-3 text-white text-[14px] outline-none focus:border-white/20 resize-none transition-colors font-sans-tight"
                        style={{ borderColor: "rgba(255,255,255,0.1)" }}
                        placeholder="Tell us a little about your operation…"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full text-[13.5px] transition-all font-sans-tight"
                      style={{
                        color: "#0a0d0e",
                        background: CYAN,
                      }}
                    >
                      Request demo
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="py-10 text-center"
                  >
                    <div
                      className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-5"
                      style={{
                        background: `${CYAN}18`,
                        border: `1px solid ${CYAN}50`,
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke={CYAN}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-white text-xl mb-2 font-display">
                      We've received your note.
                    </p>
                    <p className="text-white/55 text-[14px] font-sans-tight">
                      A member of Alias will reach out within one business day.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
