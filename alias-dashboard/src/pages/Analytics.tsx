import { useEffect, useMemo, useState } from 'react';

import { cyan } from '@/lib/data';
import { MetricCard } from '@/components/MetricCard';
import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';
import {
  getReservations,
  type ReservationResponse,
} from '@/lib/api';

export function Analytics() {
  const language = detectDefaultLanguage();
  const t = translations[language];

  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getReservations();
        setReservations(data);
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const confirmedReservations = reservations.filter(
    (reservation) => reservation.status === 'confirmed',
  );

  const totalBookings = reservations.length;
  const confirmedBookings = confirmedReservations.length;

  const averagePartySize = useMemo(() => {
    if (reservations.length === 0) return 0;

    const totalGuests = reservations.reduce(
      (total, reservation) => total + reservation.party_size,
      0,
    );

    return Math.round((totalGuests / reservations.length) * 10) / 10;
  }, [reservations]);

  const bars = useMemo(() => {
    const hours = Array.from({ length: 24 }, () => 0);

    reservations.forEach((reservation) => {
      const hour = new Date(reservation.reservation_time).getHours();
      hours[hour] += 1;
    });

    return hours;
  }, [reservations]);

  const max = Math.max(...bars, 1);

  return (
    <div>
      <p
        className="text-[11px] uppercase tracking-[0.28em]"
        style={{ color: cyan }}
      >
        {t.analytics}
      </p>

      <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
        {t.analyticsHeading}
      </h1>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <MetricCard
          label={t.totalBookings}
          value={loading ? '—' : String(totalBookings)}
          detail={t.realTime}
          accent
        />

        <MetricCard
          label={t.confirmedBookings}
          value={loading ? '—' : String(confirmedBookings)}
          detail={t.statConfirmed}
        />

        <MetricCard
          label={t.averagePartySize}
          value={loading ? '—' : String(averagePartySize)}
          detail={t.guests}
        />
      </div>

      <div className="glass mt-6 rounded-3xl p-6">
        <p className="mb-6 text-[10px] uppercase tracking-[.24em] text-white/35">
          {t.bookingsByHour}
        </p>

        <div className="flex h-72 items-end gap-2">
          {bars.map((bar, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-md"
              title={`${index}:00 · ${bar}`}
              style={{
                height: `${(bar / max) * 100}%`,
                minHeight: bar > 0 ? '8px' : '2px',
                background:
                  index > 16 && index < 21
                    ? `linear-gradient(to top, ${cyan}, ${cyan}55)`
                    : 'rgba(255,255,255,.12)',
              }}
            />
          ))}
        </div>

        {reservations.length === 0 && !loading && (
          <p className="mt-6 text-sm text-white/40">
            {t.noAnalyticsData}
          </p>
        )}
      </div>
    </div>
  );
}