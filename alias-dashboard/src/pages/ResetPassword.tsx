import { useMemo, useState } from 'react';

import { AliasMark } from '@/components/Brand';
import { resetPassword } from '@/lib/api';
import { cyan } from '@/lib/data';

export function ResetPassword() {
  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || '';
  }, []);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!password || password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await resetPassword(token, password);

      setMessage(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reset password.',
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
          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: cyan }}
          >
            Secure reset
          </p>

          <h1 className="mt-4 font-display text-4xl font-light tracking-[-.04em]">
            Create a new password.
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/45">
            Your new password should be secure and different from previous ones.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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

            {message ? (
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
                style={{ background: cyan }}
              >
                Back to login
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-60"
                style={{ background: cyan }}
              >
                {loading ? 'Updating password...' : 'Reset password'}
              </button>
            )}
              
          </div>
        </div>
      </div>
    </main>
  );
}