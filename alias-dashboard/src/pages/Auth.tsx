import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import {
  detectDefaultLanguage,
  languages,
  saveLanguage,
  translations,
  type LanguageCode,
} from '@/lib/i18n';

import { AliasMark } from '@/components/Brand';
import { cyan } from '@/lib/data';
import { forgotPassword } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type AuthResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    is_active: boolean;
    is_email_verified: boolean;
  };
};

export function Auth({ onEnter }: { onEnter: () => void }) {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [language, setLanguage] = useState<LanguageCode>(
    detectDefaultLanguage(),
  );
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string |null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  async function handleForgotPassword() {
  if (!email) {
    setError('Enter your email first.');
    return;
  }

  try {
    setError(null);
    setMessage(null);
    setIsResettingPassword(true);

    const response = await forgotPassword(email);

    setMessage(response.message);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Unable to request password reset.',
    );
  } finally {
    setIsResettingPassword(false);
  }
}

  async function handleSubmit() {
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    if (mode === 'register' && !acceptedPolicies) {
      setError(t.privacyRequired);
      return;
    }

    if (mode === 'register') {
      localStorage.removeItem('alias_access_token');
      localStorage.removeItem('alias_user');
      localStorage.removeItem('alias_welcome_completed');
    }

    setIsSubmitting(true);

    try {
      const endpoint =
        mode === 'register'
          ? '/api/v1/auth/register'
          : '/api/v1/auth/login';

      const payload =
        mode === 'register'
          ? { email, password, full_name: fullName }
          : { email, password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detail = data?.detail;
        const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map((item) => item.msg).join(', ')
            : 'Authentication failed.';

        throw new Error(message);
      }

      const auth = data as AuthResponse;

      localStorage.setItem('alias_access_token', auth.access_token);
      localStorage.setItem('alias_user', JSON.stringify(auth.user));

      onEnter();

      onEnter();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grain relative min-h-screen overflow-hidden bg-ink">
      <div
        className="absolute inset-0 opacity-[.07]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage:
            'radial-gradient(circle at 50% 25%, black, transparent 70%)',
        }}
      />

      <div
        className="absolute left-1/2 top-24 h-[520px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `${cyan}18` }}
      />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_440px] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AliasMark />

            <h1 className="mt-14 font-display text-5xl font-light leading-[1.02] tracking-[-.04em] text-white md:text-7xl">
              {t.authHeroTitle}
              <span style={{ color: cyan }}>.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/55">
              {t.authHeroDescription}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="glass rounded-3xl p-7"
          >
            

            <div className="flex justify-end">
              <select 
                value={language}
                onChange={(event) => {
                  const nextLanguage = event.target.value as LanguageCode;
                  setLanguage(nextLanguage);
                  saveLanguage(nextLanguage);
                }}
                className="rounded-full border border-white/10 bg-white/[.03] px-3 py-2 text-xs uppercase tracking-[.18em] text-white/70 outline-none"
              >
                {languages.map((item) => (
                  <option
                    key={item.code}
                    value={item.code}
                    className="bg-[#050816]"
                  >
                    {item.shortLabel}
                  </option>
                ))}
              </select>
            </div>

            <h2 className="mt-3 font-display text-3xl font-light text-white">
              {mode === 'register'
                ? t.authCreateAccount
                : t.authWelcomeBack}
            </h2>

            <div className="mt-6 grid grid-cols-2 rounded-full border border-white/10 bg-white/[.03] p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setEmail('');
                  setPassword('');
                  setFullName('');
                  setError(null);
                  setMessage(null);
                  setAcceptedPolicies(false);
                }}
                className="rounded-full px-4 py-2 text-sm transition"
                style={{
                  background: mode === 'register' ? cyan : 'transparent',
                  color: mode === 'register' ? '#050707' : 'rgba(255,255,255,.5)',
                }}
              >
                {t.authRegister}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setEmail('');
                  setPassword('');
                  setFullName('');
                  setError(null);
                  setMessage(null);
                  setAcceptedPolicies(false);
                }}
                className="rounded-full px-4 py-2 text-sm transition"
                style={{
                  background: mode === 'login' ? cyan : 'transparent',
                  color: mode === 'login' ? '#050707' : 'rgba(255,255,255,.5)',
                }}
              >
                {t.authLogin}
              </button>
            </div>

            <form
              autoComplete="off"
              className="mt-8 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              {mode === 'register' && (
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
                  autoComplete="off"
                  placeholder={t.authFullNamePlaceholder}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
               )}

              <input
                className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
                autoComplete="new-email"
                placeholder={t.authEmailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <div className='relative'>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
                  placeholder={t.authPasswordPlaceholder}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {mode === 'register' && (
                <label className="flex items-start gap-3 text-sm leading-6 text-white/50">
                  <input
                    type="checkbox"
                    checked={acceptedPolicies}
                    onChange={(event) => setAcceptedPolicies(event.target.checked)}
                    className="mt-1 h-4 w-4"
                  />

                  <span>
                    {t.privacyAcceptancePrefix}{' '}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {t.privacyPolicy}
                    </a>{' '}
                    {t.privacyAcceptanceMiddle}{' '}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {t.termsOfService}
                    </a>
                    .
                  </span>
                </label>
              )}

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/forgot-password';
                  }}
                  disabled={isResettingPassword}
                  className="text-left text-xs uppercase tracking-[.18em] text-white/40 transition hover:text-white disabled:opacity-50"
                >
                  {isResettingPassword 
                    ? t.authSendingResetLink 
                    : t.authForgotPassword}
                </button>
              )}

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-x1 border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  {message}
                </div>
              )}

              <button
                disabled={isSubmitting}
                className="w-full rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-60"
                style={{ background: cyan }}
              >
                {isSubmitting
                  ? t.authPleaseWait
                  : mode === 'register'
                    ? t.authStartTrial
                    : t.authLogin}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-white/38">
              {t.authFooter}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}