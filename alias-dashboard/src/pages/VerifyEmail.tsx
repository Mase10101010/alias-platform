import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

import { verifyEmail } from '@/lib/api';
import { AliasMark } from '@/components/Brand';

type VerificationStatus = 'loading' | 'success' | 'error';

export function VerifyEmail() {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    async function confirmEmail() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        const response = await verifyEmail(token);

        setStatus('success');
        setMessage(response.message || 'Email verified successfully.');
      } catch (error) {
        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'Unable to verify email.',
        );
      }
    }

    confirmEmail();
  }, []);

  return (
    <main className="grain flex min-h-screen items-center justify-center bg-ink px-6 text-white">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[.035] p-8 text-center shadow-2xl">
        <div className="mb-8 flex justify-center">
          <AliasMark />
        </div>

        <div className="mb-6 flex justify-center">
          {status === 'loading' && (
            <Loader2 className="h-12 w-12 animate-spin text-white/70" />
          )}

          {status === 'success' && (
            <CheckCircle2 className="h-12 w-12 text-white" />
          )}

          {status === 'error' && (
            <XCircle className="h-12 w-12 text-white/70" />
          )}
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          {status === 'loading' && 'Verifying email'}
          {status === 'success' && 'Email verified'}
          {status === 'error' && 'Verification failed'}
        </h1>

        <p className="mt-4 text-sm leading-7 text-white/55">
          {message}
        </p>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('alias_access_token');
            localStorage.removeItem('alias_user');
            localStorage.removeItem('alias_welcome_completed');
            window.location.href = '/';
          }}
          className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Go to login
        </button>
      </div>
    </main>
  );
}