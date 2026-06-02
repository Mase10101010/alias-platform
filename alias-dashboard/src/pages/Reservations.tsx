import { useEffect, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';

import { cyan } from '@/lib/data';
import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';

import {
  createReservation,
  getConversationHistory,
  getReservations,
  type ConversationHistoryResponse,
  type ReservationResponse,
  getRestaurants,
  getTables,
  type TableResponse,
} from '@/lib/api';

type FormState = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  party_size: string;
  table_id: string;
  reservation_date: string;
  reservation_time: string;
  special_requests: string;
};

const initialForm: FormState = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  party_size: '2',
  table_id: '',
  reservation_date: '',
  reservation_time: '19:30',
  special_requests: '',
};

function formatReservationTimeOption(time: string, language: string) {
  const [hourRaw, minute] = time.split(':');
  const hour = Number(hourRaw);

  if (language === 'en') {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute} ${period}`;
  }

  return time;
}

const reservationTimeOptions = [
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
];

export function Reservations() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'name' | 'party'>('date');
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const language = detectDefaultLanguage();
  const t = translations[language];

  const [selectedReservation, setSelectedReservation] =
    useState<ReservationResponse | null>(null);
  const [conversation, setConversation] =
    useState<ConversationHistoryResponse | null>(null);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(
    null,
  );

  async function loadReservations(showLoader = false) {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const data = await getReservations();
      setReservations(data);
      const restaurants = await getRestaurants();
      const restaurant = restaurants[0];

      if (restaurant) {
        const restaurantTables = await getTables(restaurant.id);
        setTables(restaurantTables);
      }
    } catch (err) {
      console.error('Failed to load reservations', err);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
  loadReservations(true);

  const interval = setInterval(() => {
    loadReservations(false);
  }, 10000);

  return () => clearInterval(interval);
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

  function getLocale(language: string) {
    if (language === 'it') return 'it-IT';
    if (language === 'es') return 'es-ES';
    if (language === 'fr') return 'fr-FR';
    if (language === 'de') return 'de-DE';
    return 'en-US';
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString(getLocale(language), {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const visibleReservations = reservations.filter((reservation) => {
    const reservationDate = new Date(reservation.reservation_time);

    if (reservationDate < todayStart) {
      return false;
    }

    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      reservation.customer_name.toLowerCase().includes(query) ||
      reservation.customer_phone.toLowerCase().includes(query) ||
      (reservation.customer_email || '').toLowerCase().includes(query)
    );
  });

  const sortedReservations = [...visibleReservations].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'date' || sortBy === 'time') {
      comparison =
        new Date(a.reservation_time).getTime() -
        new Date(b.reservation_time).getTime();
    }

    if (sortBy === 'name') {
      comparison = a.customer_name.localeCompare(b.customer_name);
    }

    if (sortBy === 'party') {
      comparison = a.party_size - b.party_size;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  async function openConversation(reservation: ReservationResponse) {
    setSelectedReservation(reservation);
    setConversation(null);
    setConversationError(null);

    if (!reservation.session_id) {
      setConversationError(
        'No AI conversation is linked to this reservation.',
      );
      return;
    }

    setConversationLoading(true);

    try {
      const history = await getConversationHistory(reservation.session_id);
      setConversation(history);
    } catch (err) {
      console.error('Failed to load conversation history', err);
      setConversationError('Unable to load conversation history.');
    } finally {
      setConversationLoading(false);
    }
  }

  function closeConversation() {
    setSelectedReservation(null);
    setConversation(null);
    setConversationError(null);
    setConversationLoading(false);
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

    if (!form.customer_email.trim()) {
      setError(t.emailRequiredError);
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
        customer_email: form.customer_email.trim(),
        party_size: Number(form.party_size),
        reservation_time: reservationDateTime.toISOString(),
        special_requests: form.special_requests.trim() || undefined,
        table_id: form.table_id || null,
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
    <div className="min-w-0 overflow-x-hidden">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: cyan }}
          >
            {t.reservationsTitle}
          </p>

          <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
            {t.reservationsHeading}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            <Plus size={16} />
            {t.newReservation}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass mt-10 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[.22em] text-white/35">
                {t.manualBooking}
              </p>

              <h2 className="mt-2 font-display text-3xl font-light">
                {t.createReservationTitle}
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
              placeholder={t.guestName}
              value={form.customer_name}
              onChange={(value) => updateField('customer_name', value)}
            />

            <Input
              placeholder={t.phoneNumber}
              value={form.customer_phone}
              onChange={(value) => updateField('customer_phone', value)}
            />

            <Input
              placeholder={t.emailRequired}
              value={form.customer_email}
              onChange={(value) => updateField('customer_email', value)}
            />

            <Input
              placeholder={t.partySize}
              value={form.party_size}
              onChange={(value) => updateField('party_size', value)}
            />

            <select
              value={form.table_id}
              onChange={(event) => updateField('table_id', event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
            >
              <option 
                value=""
                style={{ backgroundColor: '#111827', color: 'white' }}
              >
                {t.automaticTableAssignment}
              </option>

              {tables.map((table) => (
                <option 
                  key={table.id} 
                  value={table.id}
                  style={{ backgroundColor: '#111827', color: 'white' }}
                >
                  {t.tableLabel} {table.table_number} · {table.seats} {t.seatsLabel}
                </option>
              ))}
            </select>

            <Input
              type="date"
              placeholder="Date"
              value={form.reservation_date}
              onChange={(value) => updateField('reservation_date', value)}
            />

            <select
              value={form.reservation_time}
              onChange={(event) => updateField('reservation_time', event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
            >
              {reservationTimeOptions.map((time) => (
                <option 
                  key={time} 
                  value={time}
                  style={{ backgroundColor: '#111827', color: 'white' }}
                >
                  {formatReservationTimeOption(time, language)}
                </option>
              ))}
            </select>

            <div className="md:col-span-2">
              <Input
                placeholder={t.specialRequestsOptional}
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
              {submitting 
                ? t.creating 
                : t.createReservationButton}
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.22em] text-white/35">
            {t.searchAndSortReservations}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white/45 lg:w-80">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t.searchReservationsPlaceholder}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as 'date' | 'time' | 'name' | 'party',
              )
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="date">{t.date}</option>
            <option value="time">{t.time}</option>
            <option value="name">{t.guestName}</option>
            <option value="party">{t.partySize}</option>
          </select>

          <select
            value={sortDirection}
            onChange={(event) =>
              setSortDirection(event.target.value as 'asc' | 'desc')
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="desc">{t.newestFirst}</option>
            <option value="asc">{t.oldestFirst}</option>
          </select>
        </div>
      </div>

      <div className="glass mt-10 max-w-full overflow-x-auto rounded-3xl">
        <div className="grid min-w-[1050px] grid-cols-[120px_80px_1fr_80px_110px_240px_1fr_170px] items-center gap-3 border-b border-white/[.04] px-5 py-4 text-sm last:border-none">
          <span>{t.date}</span>
          <span>{t.timeColumn}</span>
          <span>{t.guestColumn}</span>
          <span>{t.partyColumn}</span>
          <span>{t.tableLabel}</span>
          <span>{t.contactDetails}</span>
          <span>{t.notesColumn}</span>
          <span>{t.actionsColumn}</span>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-sm text-white/45">
            {t.loadingReservations}
          </div>
        ) : visibleReservations.length === 0 ? (
          <div className="px-5 py-10 text-sm text-white/45">
            {t.noReservations}
          </div>
        ) : (
          sortedReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="grid min-w-[920px] grid-cols-[120px_90px_1fr_80px_150px_1fr_190px] items-center border-b border-white/[.04] px-5 py-4 text-sm last:border-none"
            >
              <span className="text-white/50">
                {formatDate(reservation.reservation_time)}
              </span>

              <span className="text-white/50">
                {formatTime(reservation.reservation_time)}
              </span>

              <span className="text-white/88">
                {reservation.customer_name}
              </span>

              <span className="text-white/55">
                {reservation.party_size}
              </span>

              

              <span className="text-white/55">
                {reservation.table_number
                  ? `${t.tableLabel} ${reservation.table_number}`
                  : '—'}
              </span>

              <div className="min-w-0 text-white/55">
                <div className="truncate">{reservation.customer_phone || '—'}</div>
                <div className="mt-1 truncate text-xs text-white/35">
                  {reservation.customer_email || '—'}
                </div>
              </div>

              <span className="text-white/45">
                {reservation.special_requests || '—'}
              </span>

              <div className="flex flex-col items-center justify-center gap-2">
                {reservation.session_id && (
                  <span
                    className="rounded-full px-2 py-1 text-[10px] uppercase tracking-[.18em]"
                    style={{
                      background: `${cyan}18`,
                      color: cyan,
                    }}
                  >
                    AI
                  </span>
                )}

                <button
                  onClick={() => openConversation(reservation)}
                  className="rounded-full border border-white/10 px-4 py-2 text-center text-xs uppercase tracking-[.18em] text-white/60 transition hover:border-white/20 hover:text-white"
                >
                  {t.viewConversation}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl border-l border-white/10 bg-ink p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.28em]"
                  style={{ color: cyan }}
                >
                  {t.aiConversation}
                </p>

                <h2 className="mt-3 font-display text-4xl font-light tracking-[-.04em]">
                  {selectedReservation.customer_name}
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  {t.partyOfLabel} {selectedReservation.party_size} ·{' '}
                  {formatTime(selectedReservation.reservation_time)}
                </p>
              </div>

              <button
                onClick={closeConversation}
                className="rounded-full border border-white/10 p-2 text-white/50 transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8 h-[calc(100vh-180px)] space-y-4 overflow-y-auto pr-2">
              {conversationLoading ? (
                <div className="text-sm text-white/45">
                  {t.loadingConversation}
                </div>
              ) : conversationError ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {conversationError}
                </div>
              ) : conversation?.messages.length ? (
                conversation.messages
                  .filter((message) => message.role !== 'tool')
                  .map((message) => {
                    const isUser = message.role === 'user';

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isUser ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className="max-w-[82%] rounded-3xl px-5 py-4 text-sm leading-6"
                          style={{
                            background: isUser
                              ? cyan
                              : 'rgba(255,255,255,.055)',
                            color: isUser
                              ? '#050707'
                              : 'rgba(255,255,255,.84)',
                          }}
                        >
                          {message.content}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-sm text-white/45">
                  {t.noConversationMessages}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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