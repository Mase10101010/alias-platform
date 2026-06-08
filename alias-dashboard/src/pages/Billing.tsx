import { useEffect, useState } from 'react';
import { CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';

import {
  createCheckoutSession,
  createCustomerPortal,
  getBillingStatus,
  type BillingStatusResponse,
} from '@/lib/api';
import { cyan } from '@/lib/data';

export function Billing() {
  const [billing, setBilling] = useState<BillingStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadBilling() {
    try {
      setError(null);
      setIsLoading(true);
      const data = await getBillingStatus();
      setBilling(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load billing.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBilling();
  }, []);

  async function handleCheckout() {
    try {
      setError(null);
      setIsRedirecting(true);
      const session = await createCheckoutSession();
      window.location.href = session.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout.');
      setIsRedirecting(false);
    }
  }

  async function handlePortal() {
    try {
      setError(null);
      setIsRedirecting(true);
      const session = await createCustomerPortal();
      window.location.href = session.portal_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to open billing portal.');
      setIsRedirecting(false);
    }
  }

  const status = billing?.subscription_status ?? 'unknown';
  const isActive = status === 'active' || status === 'lifetime';
  const isLifetime = status === 'lifetime';
  const hasStripeCustomer = Boolean(billing?.stripe_customer_id);

  return (
    <div className="mx-auto max-w-5xl">
      <p
        className="text-[11px] uppercase tracking-[0.28em]"
        style={{ color: cyan }}
      >
        Billing
      </p>

      <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
        Subscription
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
        Manage your Alias subscription, trial, payment method and customer portal.
      </p>

      {isLoading ? (
        <div className="glass mt-10 rounded-3xl p-8 text-white/50">
          Loading billing status...
        </div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="glass rounded-3xl p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[.22em] text-white/35">
                  Current plan
                </p>

                <h2 className="mt-3 font-display text-4xl font-light">
                  {isLifetime
                    ? 'Lifetime'
                    : isActive
                      ? 'Active subscription'
                      : 'Inactive'}
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  Restaurant: {billing?.restaurant_name || 'Restaurant'}
                </p>
              </div>

              <div
                className="rounded-full px-4 py-2 text-xs uppercase tracking-[.18em]"
                style={{
                  background: isActive ? `${cyan}18` : 'rgba(248,113,113,.12)',
                  color: isActive ? cyan : '#fca5a5',
                }}
              >
                {status}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <InfoCard label="Trial used" value={billing?.has_used_trial ? 'Yes' : 'No'} />
              <InfoCard label="Trial ends" value={formatDate(billing?.trial_end_date)} />
              <InfoCard label="Subscription starts" value={formatDate(billing?.subscription_start_date)} />
              <InfoCard label="Subscription ends" value={formatDate(billing?.subscription_end_date)} />
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {!isActive && (
                <button
                  onClick={handleCheckout}
                  disabled={isRedirecting}
                  className="flex items-center gap-2 rounded-full px-5 py-3 text-sm text-black disabled:opacity-60"
                  style={{ background: cyan }}
                >
                  <CreditCard size={16} />
                  {billing?.has_used_trial ? 'Subscribe now' : 'Start free trial'}
                </button>
              )}

              {hasStripeCustomer && !isLifetime && (
                <button
                  onClick={handlePortal}
                  disabled={isRedirecting}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:border-white/20 hover:text-white disabled:opacity-60"
                >
                  <ExternalLink size={16} />
                  Manage subscription
                </button>
              )}
            </div>
          </div>

          <div className="glass rounded-3xl p-8">
            <div
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: `${cyan}18`, color: cyan }}
            >
              <ShieldCheck size={24} />
            </div>

            <h3 className="font-display text-3xl font-light">
              Alias Pro
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/45">
              Unlock AI reservations, table management, availability, public concierge and premium automation.
            </p>

            <div className="mt-7 space-y-3 text-sm text-white/55">
              <p>✓ AI concierge</p>
              <p>✓ Public booking widget</p>
              <p>✓ Reservation management</p>
              <p>✓ Table availability</p>
              <p>✓ Customer emails</p>
              <p>✓ Multilingual support</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
      <p className="text-xs uppercase tracking-[.18em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm text-white/75">
        {value}
      </p>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return '—';

  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}