import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { sendVerificationEmail } from '@/lib/api';

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
  initialStep = 0, 
}: { 
  onComplete: () => void;
  requireEmailVerification?: boolean;
  initialStep?: number;
}) {
  const [step, setStep] = useState(initialStep);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
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
              {t.welcomeToAlias}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/45">
              {t.welcomeLanguageDescription}
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

        {verificationError && (
          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {verificationError}
          </div>
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
            onClick={async () => {
              if (step === 0) {
                if (requireEmailVerification){
                  try {
                    setVerificationError(null);
                    setIsSendingVerification(true);

                    await sendVerificationEmail();
                    

                    localStorage.setItem('alias_welcome_completed', 'true');
                    setStep(1);
                  } catch (error){
                    setVerificationError(
                        error instanceof Error
                          ? error.message
                          : 'Unable to send verification email.',
                    );      
                  } finally {
                    setIsSendingVerification(false);
                  }

                  return;
                }
                
                setStep(1);
                return;
                
              }

              onComplete();
            }}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-sm text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            {isSendingVerification
              ? t.sendingVerificationEmail
              : step === 0
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