import { useState } from 'react';
import { motion } from 'framer-motion';

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
  };
};

export function Auth({ onEnter }: { onEnter: () => void }) {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string |null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

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
        throw new Error(data?.detail || 'Authentication failed.');
      }

      const auth = data as AuthResponse;

      localStorage.setItem('alias_access_token', auth.access_token);
      localStorage.setItem('alias_user', JSON.stringify(auth.user));

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
              AI operations for places where service matters
              <span style={{ color: cyan }}>.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/55">
              Create your restaurant workspace, configure your AI concierge, and
              begin the 14-day trial in minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="glass rounded-3xl p-7"
          >
            <p className="text-[11px] uppercase tracking-[0.26em] text-white/40">
              Private beta
            </p>

            <h2 className="mt-3 font-display text-3xl font-light text-white">
              {mode === 'register'
                ? 'Create your Alias account'
                : 'Welcome back to Alias'}
            </h2>

            <div className="mt-6 grid grid-cols-2 rounded-full border border-white/10 bg-white/[.03] p-1">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="rounded-full px-4 py-2 text-sm transition"
                style={{
                  background: mode === 'register' ? cyan : 'transparent',
                  color: mode === 'register' ? '#050707' : 'rgba(255,255,255,.5)',
                }}
              >
                Register
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="rounded-full px-4 py-2 text-sm transition"
                style={{
                  background: mode === 'login' ? cyan : 'transparent',
                  color: mode === 'login' ? '#050707' : 'rgba(255,255,255,.5)',
                }}
              >
                Login
              </button>
            </div>

            <form
              className="mt-8 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              

              <input
                className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <input
                className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/forgot-password';
                  }}
                  disabled={isResettingPassword}
                  className="text-left text-xs uppercase tracking-[.18em] text-white/40 transition hover:text-white disabled:opacity-50"
                >
                  {isResettingPassword ? 'Sending reset link...' : 'Forgot password?'}
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
                  ? 'Please wait...'
                  : mode === 'register'
                    ? 'Start 14-day trial'
                    : 'Login'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-white/38">
              No installation required. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}