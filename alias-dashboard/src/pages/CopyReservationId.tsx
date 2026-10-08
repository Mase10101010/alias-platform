import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyReservationId() {
  const [copied, setCopied] = useState(false);
  const reservationId = new URLSearchParams(window.location.search).get('id') || '';
  const validId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reservationId);

  async function copyId() {
    if (!validId) return;
    try {
      await navigator.clipboard.writeText(reservationId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  useEffect(() => {
    if (!validId) return;
    if (!navigator.clipboard?.writeText) return;

    void navigator.clipboard.writeText(reservationId)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  }, [reservationId, validId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[.03] p-7">
        <p className="mb-5 text-xs uppercase tracking-[.2em] text-cyanAlias">
          Alias Concierge
        </p>

        <h1 className="mb-6 text-xl font-semibold">Reservation ID</h1>

        {validId ? (
          <>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
              <span className="min-w-0 flex-1 break-all font-mono text-sm">
                {reservationId}
              </span>

              <button
                type="button"
                onClick={() => void copyId()}
                aria-label="Copy reservation ID"
                title="Copy reservation ID"
                className="shrink-0 rounded-lg p-2 text-cyanAlias hover:bg-white/10"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>

            <p className="mt-4 text-sm text-white/50">
              {copied ? 'Copied to clipboard.' : 'Tap the copy icon to copy your ID.'}
            </p>
          </>
        ) : (
          <p className="text-sm text-white/60">Invalid reservation ID.</p>
        )}
      </div>
    </main>
  );
}
