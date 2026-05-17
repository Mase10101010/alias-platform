import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import { AliasMark } from '@/components/Brand';
import { forgotPassword } from '@/lib/api';
import { cyan } from '@/lib/data';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await forgotPassword(email.trim());
      setMessage(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to send reset email.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grain flex min-h-screen items-center justify-center bg-ink px-6 text-white">
      <div className="w-full max-w-md">
        <AliasMark />

        <div className="glass mt-10 rounded-3xl p-7">
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[.18em] text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to login
          </button>

          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: cyan }}
          >
            Password recovery
          </p>

          <h1 className="mt-4 font-display text-4xl font-light tracking-[-.04em]">
            Reset your password.
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/45">
            Enter your account email and we’ll send you a secure reset link.
          </p>

          <div className="mt-8 space-y-4">
            <input
              className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
              placeholder="Work email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-60"
              style={{ background: cyan }}
            >
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}