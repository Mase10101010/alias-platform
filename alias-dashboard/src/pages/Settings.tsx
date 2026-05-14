import { useEffect, useMemo, useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import { cyan } from '@/lib/data';
import { getRestaurants, type RestaurantResponse } from '@/lib/api';

function getPublicConciergeUrl(slug: string) {
  return `https://alias-platform.vercel.app/concierge?restaurant=${slug}`;
}

export function Settings() {
  const [restaurant, setRestaurant] = useState<RestaurantResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const restaurants = await getRestaurants();
        setRestaurant(restaurants[0] || null);
      } catch (error) {
        console.error('Failed to load restaurant settings', error);
      }
    }

    loadRestaurant();
  }, []);

  const conciergeUrl = useMemo(() => {
    if (!restaurant) return '';
    return getPublicConciergeUrl(restaurant.slug);
  }, [restaurant]);

  const iframeCode = useMemo(() => {
    if (!conciergeUrl) return '';

    return `<iframe src="${conciergeUrl}" width="100%" height="720" style="border:0;border-radius:24px;overflow:hidden;"></iframe>`;
  }, [conciergeUrl]);

  async function copyToClipboard(value: string, label: string) {
    if (!value) return;

    await navigator.clipboard.writeText(value);
    setCopied(label);

    window.setTimeout(() => {
      setCopied(null);
    }, 1800);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <p
        className="text-[11px] uppercase tracking-[0.28em]"
        style={{ color: cyan }}
      >
        Settings
      </p>

      <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
        Restaurant settings.
      </h1>

      <div className="glass mt-10 rounded-3xl p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField label="Restaurant name" value={restaurant?.name || '—'} />
          <ReadOnlyField label="Contact email" value={restaurant?.email || '—'} />
          <ReadOnlyField label="Phone number" value={restaurant?.phone || '—'} />
          <ReadOnlyField
            label="Opening hours"
            value={
              restaurant
                ? `${restaurant.opening_hour}:00 - ${restaurant.closing_hour}:00`
                : '—'
            }
          />
          <ReadOnlyField
            label="Business type"
            value={restaurant?.business_type || '—'}
          />
          <ReadOnlyField
            label="Concierge tone"
            value={restaurant?.concierge_tone || '—'}
          />
        </div>

        <div
          className="mt-8 rounded-2xl border p-5"
          style={{ borderColor: `${cyan}25`, background: `${cyan}08` }}
        >
          <p className="font-display text-2xl">Trial active</p>
          <p className="mt-2 text-white/50">
            Billing integration will be connected in the next product phase.
          </p>
        </div>
      </div>

      <div className="glass mt-8 rounded-3xl p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.28em]"
              style={{ color: cyan }}
            >
              Public Concierge
            </p>

            <h2 className="mt-3 font-display text-4xl font-light tracking-[-.04em]">
              Share or embed your AI concierge.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
              Use this public link on your website, Instagram bio, Google
              Business profile, QR code, or embed it directly with an iframe.
            </p>
          </div>

          {conciergeUrl && (
            <a
              href={conciergeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/65 transition hover:border-white/20 hover:text-white"
            >
              <ExternalLink size={16} />
              Open concierge
            </a>
          )}
        </div>

        <div className="mt-8 space-y-5">
          <CopyBox
            label="Public link"
            value={conciergeUrl || 'Create a restaurant first.'}
            onCopy={() => copyToClipboard(conciergeUrl, 'link')}
            copied={copied === 'link'}
            disabled={!conciergeUrl}
          />

          <CopyBox
            label="Iframe embed code"
            value={iframeCode || 'Create a restaurant first.'}
            onCopy={() => copyToClipboard(iframeCode, 'iframe')}
            copied={copied === 'iframe'}
            disabled={!iframeCode}
            multiline
          />
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.28em]"
                style={{ color: cyan }}
              >
                QR Access
              </p>

              <h3 className="mt-3 font-display text-3xl font-light tracking-[-.04em]">
                Instant guest access.
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/45">
                Guests can scan this QR code to instantly open your AI concierge
                and make reservations without downloading any app.
              </p>
            </div>

            {conciergeUrl && (
              <div className="rounded-3xl border border-white/10 bg-white p-5">
                <QRCodeSVG
                  value={conciergeUrl}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  includeMargin
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[.22em] text-white/35">
        {label}
      </label>

      <div className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white/70">
        {value}
      </div>
    </div>
  );
}

function CopyBox({
  label,
  value,
  onCopy,
  copied,
  disabled,
  multiline = false,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  disabled?: boolean;
  multiline?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-[.22em] text-white/35">
          {label}
        </label>

        <button
          onClick={onCopy}
          disabled={disabled}
          className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55 transition hover:border-white/20 hover:text-white disabled:opacity-40"
        >
          <Copy size={13} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div
        className={`rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-xs leading-6 text-white/60 ${
          multiline ? 'min-h-24 whitespace-pre-wrap break-all' : 'break-all'
        }`}
      >
        {value}
      </div>
    </div>
  );
}