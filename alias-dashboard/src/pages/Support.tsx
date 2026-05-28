import { Mail, MessageCircle } from 'lucide-react';
import { cyan } from '@/lib/data';

export function Support() {
  return (
    <div className="mx-auto max-w-4xl">
      <p
        className="text-[11px] uppercase tracking-[0.28em]"
        style={{ color: cyan }}
      >
        SUPPORT
      </p>

      <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em] text-white">
        Need help?
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
        Our team is here to help you with onboarding,
        reservations, integrations and concierge setup.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: `${cyan}15`,
              color: cyan,
            }}
          >
            <Mail size={20} />
          </div>

          <h2 className="mt-6 font-display text-2xl font-light">
            Email support
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/45">
            Contact us anytime and we’ll get back to you as soon as possible.
          </p>

          <a
            href="mailto:support@aliasconcierge.com"
            className="mt-6 inline-flex rounded-full px-5 py-3 text-sm text-black"
            style={{ background: cyan }}
          >
            support@aliasconcierge.com
          </a>
        </div>

        <div className="glass rounded-3xl p-6">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: `${cyan}15`,
              color: cyan,
            }}
          >
            <MessageCircle size={20} />
          </div>

          <h2 className="mt-6 font-display text-2xl font-light">
            Fast response
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/45">
            We usually reply within a few hours during business days.
          </p>
        </div>
      </div>
    </div>
  );
}