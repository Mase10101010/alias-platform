import { useState } from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

import { createCheckoutSession } from '@/lib/api';
import { cyan } from '@/lib/data';
import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';

export function TrialGate() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const language = detectDefaultLanguage();
  const t = translations[language];

  async function handleStartTrial() {
    try {
      setError(null);
      setIsRedirecting(true);

      const session = await createCheckoutSession();
      window.location.href = session.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t.trialError);
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
            {t.trialTitle}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/45">
            {t.trialDescription}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 text-sm text-white/65 md:grid-cols-2">
          <p>✓ {t.trialFeature1}</p>
          <p>✓ {t.trialFeature2}</p>
          <p>✓ {t.trialFeature3}</p>
          <p>✓ {t.trialFeature4}</p>
          <p>✓ {t.trialFeature5}</p>
          <p>✓ {t.trialFeature6}</p>
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
            {isRedirecting ? t.trialRedirecting : t.trialButton}
          </button>

          <p className="mt-4 text-xs text-white/35">
            {t.trialFooter}
          </p>
        </div>
      </div>
    </main>
  );
}