import {
  CalendarClock,
  Clock3,
  Hash,
  Users,
  X,
} from 'lucide-react';

import type {
  ReservationResponse,
  TableResponse,
} from '@/lib/api';

import type {
  LiveTableStatus,
} from '@/hooks/useLiveFloor';

type LiveReservationPanelProps = {
  table: TableResponse | null;
  status: LiveTableStatus;
  reservation: ReservationResponse | null;
  onClose: () => void;
};

function formatReservationDate(value: string) {
  return new Date(value).toLocaleDateString([], {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatReservationTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusAppearance(status: LiveTableStatus) {
  if (status === 'occupied') {
    return {
      label: 'Occupied',
      className:
        'border-red-400/20 bg-red-400/10 text-red-200',
    };
  }

  if (status === 'reserved') {
    return {
      label: 'Reserved',
      className:
        'border-amber-400/20 bg-amber-400/10 text-amber-200',
    };
  }

  return {
    label: 'Available',
    className:
      'border-green-400/20 bg-green-400/10 text-green-200',
  };
}

export function LiveReservationPanel({
  table,
  status,
  reservation,
  onClose,
}: LiveReservationPanelProps) {
  if (!table) {
    return null;
  }

  const statusAppearance = getStatusAppearance(status);

  return (
    <aside className="w-full shrink-0 rounded-3xl border border-white/10 bg-[#090b0d] p-5 lg:w-[340px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[.24em] text-white/30">
            Live table
          </p>

          <h2 className="mt-2 font-display text-2xl text-white">
            Table {table.table_number}
          </h2>
        </div>

        <button
          type="button"
          aria-label="Close live table panel"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/40 transition hover:bg-white/[.05] hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <div
        className={`mt-5 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusAppearance.className}`}
      >
        {statusAppearance.label}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[.025] p-3">
          <div className="flex items-center gap-2 text-white/35">
            <Users size={14} />
            <span className="text-[10px] uppercase tracking-[.18em]">
              Capacity
            </span>
          </div>

          <p className="mt-2 text-sm font-medium text-white">
            {table.seats}{' '}
            {table.seats === 1 ? 'seat' : 'seats'}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[.025] p-3">
          <div className="flex items-center gap-2 text-white/35">
            <Hash size={14} />
            <span className="text-[10px] uppercase tracking-[.18em]">
              Table
            </span>
          </div>

          <p className="mt-2 truncate text-sm font-medium text-white">
            {table.table_number}
          </p>
        </div>
      </div>

      {reservation ? (
        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-[.24em] text-white/30">
            Current reservation
          </p>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[.025] p-4">
            <h3 className="truncate text-lg font-medium text-white">
              {reservation.customer_name}
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <CalendarClock
                  size={16}
                  className="mt-0.5 shrink-0 text-white/35"
                />

                <div>
                  <p className="text-white/80">
                    {formatReservationDate(
                      reservation.reservation_time,
                    )}
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    Reservation date
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Clock3
                  size={16}
                  className="mt-0.5 shrink-0 text-white/35"
                />

                <div>
                  <p className="text-white/80">
                    {formatReservationTime(
                      reservation.reservation_time,
                    )}
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    {reservation.duration_minutes} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Users
                  size={16}
                  className="mt-0.5 shrink-0 text-white/35"
                />

                <div>
                  <p className="text-white/80">
                    {reservation.party_size}{' '}
                    {reservation.party_size === 1
                      ? 'guest'
                      : 'guests'}
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    Party size
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-[10px] uppercase tracking-[.18em] text-white/30">
                Reservation status
              </p>

              <p className="mt-1 text-sm capitalize text-white/75">
                {reservation.status.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[.015] px-4 py-8 text-center">
          <p className="text-sm font-medium text-white/60">
            No reservation assigned
          </p>

          <p className="mt-2 text-xs leading-relaxed text-white/30">
            This table is currently available for a reservation
            or walk-in guest.
          </p>
        </div>
      )}
    </aside>
  );
}