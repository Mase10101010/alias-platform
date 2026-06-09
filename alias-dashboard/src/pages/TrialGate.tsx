import { useState } from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

import { createCheckoutSession } from '@/lib/api';
import { cyan } from '@/lib/data';

export function TrialGate() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStartTrial() {
    try {
      setError(null);
      setIsRedirecting(true);

      const session = await createCheckoutSession();
      window.location.href = session.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start free trial.');
      setIsRedirecting(false);
    }
  }

  return (
    <main className="grain flex min-h-screen items-center justify-center bg-ink px-6 py-10 text-white">
      <div className="glass w-full max-w-4xl rounded-3xl p-8">
        <div className="text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: `${cyan}18`, color: cyan }}
          >
            <ShieldCheck size={28} />
          </div>

          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: cyan }}
          >
            Alias Pro
          </p>

          <h1 className="mt-5 font-display text-5xl font-light tracking-[-.04em]">
            Start your free trial
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/45">
            Try Alias free for 7 days. After your trial, your subscription renews automatically at €99/month.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 text-sm text-white/65 md:grid-cols-2">
          <p>✓ AI concierge</p>
          <p>✓ Automatic reservations</p>
          <p>✓ Table availability</p>
          <p>✓ Public booking widget</p>
          <p>✓ Multilingual support</p>
          <p>✓ Customer email flows</p>
        </div>

        {error && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={handleStartTrial}
            disabled={isRedirecting}
            className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium text-black disabled:opacity-60"
            style={{ background: cyan }}
          >
            <CreditCard size={17} />
            {isRedirecting ? 'Redirecting...' : 'Start 7-day free trial'}
          </button>

          <p className="mt-4 text-xs text-white/35">
            No charge today. Cancel anytime from your billing portal.
          </p>
        </div>
      </div>
    </main>
  );
}