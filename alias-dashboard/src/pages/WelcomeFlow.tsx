import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { AliasMark } from '@/components/Brand';
import { cyan } from '@/lib/data';
import {
  detectDefaultLanguage,
  languages,
  saveLanguage,
  translations,
  type LanguageCode,
} from '@/lib/i18n';

export function WelcomeFlow({
   onComplete,
  requireEmailVerification = false, 
}: { 
  onComplete: () => void;
requireEmailVerification?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<LanguageCode>(
    detectDefaultLanguage(),
  );

  const t = translations[language];

  return (
    <main className="grain flex min-h-screen items-center justify-center bg-ink px-6 py-10 text-white">
      <div className="glass w-full max-w-3xl rounded-3xl p-8 text-center">
        <div className="mx-auto flex justify-center">
          <AliasMark />
        </div>

        {step === 0 && (
          <>
            <p
              className="mt-10 text-[11px] uppercase tracking-[0.28em]"
              style={{ color: cyan }}
            >
              Welcome · Benvenuto · Bienvenido · Bienvenue · Willkommen
            </p>

            <h1 className="mt-5 font-display text-5xl font-light tracking-[-.04em]">
              Welcome to Alias.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/45">
              Choose your language before configuring your restaurant workspace.
            </p>

            <select
              value={language}
              onChange={(event) => {
                const nextLanguage = event.target.value as LanguageCode;
                setLanguage(nextLanguage);
                saveLanguage(nextLanguage);
              }}
              className="mt-8 rounded-full border border-white/10 bg-white/[.03] px-5 py-3 text-sm text-white outline-none"
            >
              {languages.map((item) => (
                <option
                  key={item.code}
                  value={item.code}
                  className="bg-[#050816]"
                >
                  {item.label}
                </option>
              ))}
            </select>
          </>
        )}

        {step === 1 && (
            <>
              <p
                className="mt-10 text-[11px] uppercase tracking-[0.28em]"
                style={{ color: cyan }}
              >
                {requireEmailVerification
                  ? 'EMAIL VERIFICATION'
                  : t.onboardingTitle}
              </p>

              <h1 className="mt-5 font-display text-5xl font-light tracking-[-.04em]">
                {requireEmailVerification
                  ? t.verifyEmailHeading
                  : t.welcomeFlowHeading}
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/45">
                {requireEmailVerification
                  ? t.verifyEmailDescription
                  : t.welcomeFlowDescription}
              </p>
            </>
          )}

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/55 transition hover:text-white disabled:opacity-30"
          >
            <ArrowLeft size={16} />
            {t.back}
          </button>

          <button
            onClick={() => {
              if (step === 0) {
                setStep(1);
                return;
              }

              onComplete();
            }}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-sm text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            {step === 0
              ? t.continue 
              : requireEmailVerification
                ? t.emailVerifiedButton
                : t.launchConcierge}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}