import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Users,
  Sparkles,
  Activity,
} from 'lucide-react';

import { cyan } from '@/lib/data';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';


type Restaurant = {
  id: string;
  name: string;
  subscription_status: string;
  concierge_tone: string;
};

type Reservation = {
  id: string;
  customer_name: string;
  party_size: number;
  reservation_time: string;
  status: string;
};

export function Overview() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [restaurantRes, reservationsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/restaurants`),
          fetch(`${API_BASE_URL}/api/v1/reservations`),
        ]);

        const restaurantData = await restaurantRes.json();
        const reservationsData = await reservationsRes.json();

        setRestaurant(restaurantData[0] || null);
        setReservations(reservationsData || []);
      } catch (error) {
        console.error('Failed to load dashboard', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const todayReservations = reservations.length;

  const confirmedReservations = reservations.filter(
    (r) => r.status === 'confirmed',
  ).length;

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: cyan }}
          >
            Overview
          </p>

          <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
            Good evening
            {restaurant ? `, ${restaurant.name}` : ''}.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
            Live operational overview powered by Alias Concierge AI.
          </p>
        </div>

        <div className="hidden rounded-full border border-white/10 bg-white/[.03] px-5 py-3 text-xs uppercase tracking-[.24em] text-white/40 lg:block">
          Trial Mode Active
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<CalendarDays size={18} />}
          label="Reservations"
          value={todayReservations}
        />

        <StatCard
          icon={<Users size={18} />}
          label="Confirmed"
          value={confirmedReservations}
        />

        <StatCard
          icon={<Sparkles size={18} />}
          label="Concierge"
          value={restaurant?.concierge_tone || '—'}
        />

        <StatCard
          icon={<Activity size={18} />}
          label="Subscription"
          value={restaurant?.subscription_status || 'trialing'}
        />
      </div>

      <div className="glass mt-10 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.22em] text-white/35">
              Live Activity
            </p>

            <h2 className="mt-3 font-display text-3xl font-light tracking-[-.04em]">
              Recent reservations.
            </h2>
          </div>

          <div
            className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[.2em]"
            style={{
              color: cyan,
              background: `${cyan}12`,
            }}
          >
            Live
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="text-sm text-white/45">
              Loading activity...
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-sm text-white/45">
              No activity yet.
            </div>
          ) : (
            reservations.slice(0, 5).map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between rounded-2xl border border-white/[.05] bg-white/[.02] px-5 py-4"
              >
                <div>
                  <p className="text-sm text-white/90">
                    {reservation.customer_name}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Party of {reservation.party_size}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-[.16em] text-white/35">
                    {reservation.status}
                  </p>

                  <p className="mt-1 text-sm text-white/65">
                    {new Date(
                      reservation.reservation_time,
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="glass rounded-3xl p-6">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-2xl"
        style={{
          background: `${cyan}14`,
          color: cyan,
        }}
      >
        {icon}
      </div>

      <p className="mt-6 text-xs uppercase tracking-[.18em] text-white/35">
        {label}
      </p>

      <h3 className="mt-3 font-display text-4xl font-light tracking-[-.04em] text-white">
        {value}
      </h3>
    </div>
  );
}