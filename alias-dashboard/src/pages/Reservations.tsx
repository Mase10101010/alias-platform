import { useEffect, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';

import { cyan } from '@/lib/data';
import {
  createReservation,
  getReservations,
  type ReservationResponse,
} from '@/lib/api';

type FormState = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  party_size: string;
  reservation_date: string;
  reservation_time: string;
  special_requests: string;
};

const initialForm: FormState = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  party_size: '2',
  reservation_date: '',
  reservation_time: '19:30',
  special_requests: '',
};

export function Reservations() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadReservations() {
    try {
      setLoading(true);
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      console.error('Failed to load reservations', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  async function handleCreateReservation() {
    setError(null);

    if (!form.customer_name.trim()) {
      setError('Guest name is required.');
      return;
    }

    if (!form.customer_phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    if (!form.reservation_date || !form.reservation_time) {
      setError('Reservation date and time are required.');
      return;
    }

    setSubmitting(true);

    try {
      const reservationDateTime = new Date(
        `${form.reservation_date}T${form.reservation_time}:00`,
      );

      await createReservation({
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        customer_email: form.customer_email.trim() || undefined,
        party_size: Number(form.party_size),
        reservation_time: reservationDateTime.toISOString(),
        special_requests: form.special_requests.trim() || undefined,
      });

      setForm(initialForm);
      setShowForm(false);
      await loadReservations();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create reservation.',
      );
    } finally {
      setSubmitting(false);
    }
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

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[.03] px-4 py-3 text-white/45 md:flex">
            <Search size={16} />
            <span className="text-sm">Live reservation feed</span>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            <Plus size={16} />
            New Reservation
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass mt-10 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[.22em] text-white/35">
                Manual booking
              </p>

              <h2 className="mt-2 font-display text-3xl font-light">
                Create reservation.
              </h2>
            </div>

            <button
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
              className="rounded-full border border-white/10 p-2 text-white/50 transition hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Guest name"
              value={form.customer_name}
              onChange={(value) => updateField('customer_name', value)}
            />

            <Input
              placeholder="Phone number"
              value={form.customer_phone}
              onChange={(value) => updateField('customer_phone', value)}
            />

            <Input
              placeholder="Email optional"
              value={form.customer_email}
              onChange={(value) => updateField('customer_email', value)}
            />

            <Input
              placeholder="Party size"
              value={form.party_size}
              onChange={(value) => updateField('party_size', value)}
            />

            <Input
              type="date"
              placeholder="Date"
              value={form.reservation_date}
              onChange={(value) => updateField('reservation_date', value)}
            />

            <Input
              type="time"
              placeholder="Time"
              value={form.reservation_time}
              onChange={(value) => updateField('reservation_time', value)}
            />

            <div className="md:col-span-2">
              <Input
                placeholder="Special requests optional"
                value={form.special_requests}
                onChange={(value) => updateField('special_requests', value)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mt-7 flex justify-end">
            <button
              onClick={handleCreateReservation}
              disabled={submitting}
              className="rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-60"
              style={{ background: cyan }}
            >
              {submitting ? 'Creating…' : 'Create reservation'}
            </button>
          </div>
        </div>
      )}

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

function Input({
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}