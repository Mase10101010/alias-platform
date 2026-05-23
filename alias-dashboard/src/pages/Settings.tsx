import { useEffect, useMemo, useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

import { cyan } from '@/lib/data';
import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';
import { getRestaurants, type RestaurantResponse } from '@/lib/api';

function getPublicConciergeUrl(slug: string) {
  return `https://alias-platform.vercel.app/concierge?restaurant=${slug}`;
}

export function Settings() {
  const [restaurant, setRestaurant] = useState<RestaurantResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const language = detectDefaultLanguage();
  const t = translations[language];

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
        {t.settings}
      </p>

      <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
        {t.settingsHeading}
      </h1>

      <div className="glass mt-10 rounded-3xl p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField
            label={t.restaurantName}
            value={restaurant?.name || '—'}
          />

          <ReadOnlyField
            label={t.contactEmail}
            value={restaurant?.email || '—'}
          />

          <ReadOnlyField
            label={t.phoneNumber}
            value={restaurant?.phone || '—'}
          />

          <ReadOnlyField
            label={t.openingHoursLabel}
            value={
              restaurant
                ? `${restaurant.opening_hour}:00 - ${restaurant.closing_hour}:00`
                : '—'
            }
          />

          <ReadOnlyField
            label={t.businessType}
            value={restaurant?.business_type || '—'}
          />

          <ReadOnlyField
            label={t.conciergeTone}
            value={restaurant?.concierge_tone || '—'}
          />
        </div>

        <div
          className="mt-8 rounded-2xl border p-5"
          style={{
            borderColor: `${cyan}25`,
            background: `${cyan}08`,
          }}
        >
          <p className="font-display text-2xl">{t.trialActive}</p>

          <p className="mt-2 text-white/50">
           {t.billingNextPhase}
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
              {t.publicConcierge}
            </p>

            <h2 className="mt-3 font-display text-4xl font-light tracking-[-.04em]">
              {t.shareEmbedTitle}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
              {t.shareEmbedDescription}
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
              {t.openConcierge}
            </a>
          )}
        </div>

        <div className="mt-8 space-y-5">
          <CopyBox
            label={t.publicLink}
            value={conciergeUrl || t.createRestaurantFirst}
            onCopy={() => copyToClipboard(conciergeUrl, 'link')}
            copied={copied === 'link'}
            disabled={!conciergeUrl}
            copiedLabel={t.copied}
            copyLabel={t.copy}
          />

          <CopyBox
            label={t.iframeEmbedCode}
            value={iframeCode || t.createRestaurantFirst}
            onCopy={() => copyToClipboard(iframeCode, 'iframe')}
            copied={copied === 'iframe'}
            disabled={!iframeCode}
            copiedLabel={t.copied}
            copyLabel={t.copy}
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
                {t.qrAccess}
              </p>

              <h3 className="mt-3 font-display text-3xl font-light tracking-[-.04em]">
                {t.instantGuestAccess}
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/45">
                {t.qrDescription}
              </p>
            </div>

            {conciergeUrl && (
              <div className="rounded-3xl border border-white/10 bg-white p-5">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                      conciergeUrl,
                    )}`}
                    alt="Alias Concierge QR code"
                    className="h-[180px] w-[180px]"
                  />

                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(
                      conciergeUrl,
                    )}`}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[.18em] text-black transition hover:opacity-90"
                    style={{
                      background: cyan,
                    }}
                  >
                    {t.downloadQr}
                  </a>
                </div>
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
  copiedLabel,
  copyLabel,
  multiline = false,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  disabled?: boolean;
  copiedLabel: string;
  copyLabel: string;
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
          {copied ? copiedLabel : copyLabel}
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