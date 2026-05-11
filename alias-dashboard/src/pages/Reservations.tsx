import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { cyan } from '@/lib/data';

type Reservation = {
  id: string;
  customer_name: string;
  party_size: number;
  reservation_time: string;
  status: string;
  special_requests?: string | null;
};

export function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReservations() {
      try {
        const response = await fetch(
          '/api/v1/reservations',
        );

        const data = await response.json();

        setReservations(data);
      } catch (error) {
        console.error('Failed to load reservations', error);
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, []);

  function formatTime(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: cyan }}
          >
            Reservations
          </p>

          <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
            Dinner service overview.
          </h1>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[.03] px-4 py-3 text-white/45">
          <Search size={16} />
          <span className="text-sm">Live reservation feed</span>
        </div>
      </div>

      <div className="glass mt-10 overflow-hidden rounded-3xl">
        <div className="grid grid-cols-[90px_1fr_80px_120px_1fr] border-b border-white/[.06] px-5 py-4 text-[10px] uppercase tracking-[.2em] text-white/35">
          <span>Time</span>
          <span>Guest</span>
          <span>Party</span>
          <span>Status</span>
          <span>Notes</span>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-sm text-white/45">
            Loading reservations...
          </div>
        ) : reservations.length === 0 ? (
          <div className="px-5 py-10 text-sm text-white/45">
            No reservations found.
          </div>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="grid grid-cols-[90px_1fr_80px_120px_1fr] items-center border-b border-white/[.04] px-5 py-4 text-sm last:border-none"
            >
              <span className="text-white/50">
                {formatTime(reservation.reservation_time)}
              </span>

              <span className="text-white/88">
                {reservation.customer_name}
              </span>

              <span className="text-white/55">
                {reservation.party_size}
              </span>

              <span
                className="justify-self-start rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[.12em]"
                style={{
                  color:
                    reservation.status === 'confirmed'
                      ? cyan
                      : 'rgba(255,255,255,.62)',
                  background:
                    reservation.status === 'confirmed'
                      ? `${cyan}12`
                      : 'rgba(255,255,255,.05)',
                }}
              >
                {reservation.status}
              </span>

              <span className="text-white/45">
                {reservation.special_requests || '—'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
