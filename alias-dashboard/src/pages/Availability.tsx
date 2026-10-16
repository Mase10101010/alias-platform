import { useEffect, useState } from 'react';

import { cyan } from '@/lib/data';
import{
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';
import { 
  getRestaurants, 
  updateRestaurant,
type TableSetup, 
} from '@/lib/api';

import { TablesManager } from '@/components/TablesManager';

type OpeningSession = {
  start: string;
  end: string;
  last_booking?: string;
};

type ScheduleDay = {
  day: string;
  isOpen: boolean;
  sessions: OpeningSession[];
};

const initialSchedule: ScheduleDay[] = [
  { day: 'Mon', isOpen: true, sessions: [{ start: '11:00', end: '22:00' }] },
  { day: 'Tue', isOpen: true, sessions: [{ start: '11:00', end: '22:00' }] },
  { day: 'Wed', isOpen: true, sessions: [{ start: '11:00', end: '22:00' }] },
  { day: 'Thu', isOpen: true, sessions: [{ start: '11:00', end: '22:00' }] },
  { day: 'Fri', isOpen: true, sessions: [{ start: '11:00', end: '22:00' }] },
  { day: 'Sat', isOpen: true, sessions: [{ start: '11:00', end: '22:00' }] },
  { day: 'Sun', isOpen: false, sessions: [] },
];

type SpecialClosure = {
  id: number;
  date: string;
  reason: string;
};


function validateSchedule(schedule: ScheduleDay[]): string | null {
  const timeToMinutes = (value: string): number | null => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
      return null;
    }

    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const dayOffsets = new Map([
    ['Mon', 0],
    ['Tue', 1440],
    ['Wed', 2880],
    ['Thu', 4320],
    ['Fri', 5760],
    ['Sat', 7200],
    ['Sun', 8640],
  ]);

  const intervals: { start: number; end: number; day: string }[] = [];

  for (const day of schedule) {
    if (!day.isOpen) continue;

    if (day.sessions.length === 0) {
      return `${day.day}: add at least one opening session or close the day.`;
    }

    for (const session of day.sessions) {
      const start = timeToMinutes(session.start);
      const endValue = timeToMinutes(session.end);

      if (start === null || endValue === null) {
        return `${day.day}: enter valid opening and closing times.`;
      }

      const end = endValue <= start ? endValue + 1440 : endValue;

      if (end - start >= 1440) {
        return `${day.day}: a session must be shorter than 24 hours.`;
      }

      if (session.last_booking?.trim()) {
        const lastBooking = timeToMinutes(session.last_booking);

        if (lastBooking === null) {
          return `${day.day}: enter a valid last-booking time.`;
        }

        const adjustedLastBooking =
          lastBooking < start ? lastBooking + 1440 : lastBooking;

        if (
          adjustedLastBooking < start ||
          adjustedLastBooking >= end
        ) {
          return `${day.day}: last booking must be inside its session.`;
        }
      }

      const offset = dayOffsets.get(day.day);

      if (offset === undefined) {
        return `Invalid weekday: ${day.day}.`;
      }

      intervals.push({
        start: offset + start,
        end: offset + end,
        day: day.day,
      });
    }
  }

  const sorted = [...intervals].sort((a, b) => a.start - b.start);

  for (let index = 1; index < sorted.length; index++) {
    if (sorted[index].start < sorted[index - 1].end) {
      return `${sorted[index].day}: opening sessions overlap.`;
    }
  }

  if (sorted.length > 1) {
    const firstStartNextWeek = sorted[0].start + 10080;
    const lastEnd = sorted[sorted.length - 1].end;

    if (firstStartNextWeek < lastEnd) {
      return 'Opening sessions overlap across the weekly boundary.';
    }
  }

  return null;
}

export function Availability() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [message, setMessage] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [closures, setClosures] = useState<SpecialClosure[]>([]);
  const [tableSetup, setTableSetup] = useState<TableSetup[]>([]);
    const [tableCountInput, setTableCountInput] = useState('');
    const [tableSeatsInput, setTableSeatsInput] = useState('');
  const language = detectDefaultLanguage();
  const t = translations[language];
  
  const [closureDate, setClosureDate] = useState('');
  const [closureReason, setClosureReason] = useState('');

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoading(true);

        const restaurants = await getRestaurants();
        const restaurant = restaurants[0];

        if (!restaurant) {
          setMessage(t.noRestaurantFound);;
          return;
        }

        setRestaurantId(restaurant.id);

        if (restaurant.weekly_schedule?.length) {
          const dayNames: Record<string, string> = {
            Monday: 'Mon',
            Tuesday: 'Tue',
            Wednesday: 'Wed',
            Thursday: 'Thu',
            Friday: 'Fri',
            Saturday: 'Sat',
            Sunday: 'Sun',
          };

          const savedDays = new Map(
            restaurant.weekly_schedule.map((item) => [
              dayNames[item.day] ?? item.day,
              item,
            ]),
          );

          setSchedule(
            initialSchedule.map((defaultDay) => {
              const saved = savedDays.get(defaultDay.day);

              if (!saved) {
                return defaultDay;
              }

              const sessions =
                saved.sessions?.map((session) => ({
                  start: session.start,
                  end: session.end,
                  last_booking: session.last_booking ?? '',
                })) ??
                (saved.opening_hour != null && saved.closing_hour != null
                  ? [
                      {
                        start: `${String(saved.opening_hour).padStart(2, '0')}:00`,
                        end: `${String(saved.closing_hour).padStart(2, '0')}:00`,
                      },
                    ]
                  : []);

              return {
                day: defaultDay.day,
                isOpen: saved.is_open ?? saved.isOpen ?? true,
                sessions,
              };
            }),
          );
        }

        if (restaurant.special_closures?.length) {
          setClosures(
            restaurant.special_closures.map((closure) => ({
              id: Number(closure.id ?? Date.now()),
              date: closure.date,
              reason: closure.reason,
            })),
          );
        }

        if (restaurant.table_setup?.length) {
          setTableSetup(restaurant.table_setup);
        }
      } catch (err) {
        setMessage(
          err instanceof Error
            ? err.message
            : t.availabilityLoadError,
        );
      } finally {
        setLoading(false);
      }
    }

    loadAvailability();
  }, []);

  function updateDay(day: string, isOpen: boolean) {
    setMessage(null);

    setSchedule((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              isOpen,
              sessions:
                isOpen && item.sessions.length === 0
                  ? [{ start: '11:00', end: '22:00' }]
                  : item.sessions,
            }
          : item,
      ),
    );
  }


  function addSession(day: string) {
    setMessage(null);
    setSchedule((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              sessions: [
                ...item.sessions,
                { start: '11:00', end: '15:00', last_booking: '' },
              ],
            }
          : item,
      ),
    );
  }

  function removeSession(day: string, index: number) {
    setMessage(null);
    setSchedule((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              sessions: item.sessions.filter(
                (_, sessionIndex) => sessionIndex !== index,
              ),
            }
          : item,
      ),
    );
  }

  function updateSession(
    day: string,
    index: number,
    field: keyof OpeningSession,
    value: string,
  ) {
    setMessage(null);
    setSchedule((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              sessions: item.sessions.map((session, sessionIndex) =>
                sessionIndex === index
                  ? { ...session, [field]: value }
                  : session,
              ),
            }
          : item,
      ),
    );
  }

  async function handleSave() {
  if (!restaurantId) {
    setMessage(t.noRestaurantSelected);
    return;
  }

  const validationError = validateSchedule(schedule);

  if (validationError) {
    setMessage(validationError);
    return;
  }

  try {
    setMessage(null);

    await updateRestaurant(restaurantId, {
      weekly_schedule: schedule.map((item) => ({
        day: item.day,
        is_open: item.isOpen,
        sessions: item.isOpen
          ? item.sessions.map((session) => ({
              start: session.start,
              end: session.end,
              ...(session.last_booking?.trim()
                ? { last_booking: session.last_booking }
                : {}),
            }))
          : [],
      })),
      special_closures: closures,
      table_setup: tableSetup,
      number_of_tables: tableSetup.reduce(
        (total, table) => total + table.count,
        0,
      ),
    });

    setMessage(t.availabilitySaved);
  } catch (err) {
    setMessage(
      err instanceof Error
        ? err.message
        : t.availabilitySaveError,
    );
  }
}

  function addClosure() {
  if (!closureDate.trim()) {
    setMessage(t.closureDateRequired);
    return;
  }

  setClosures((current) => [
    ...current,
    {
      id: Date.now(),
      date: closureDate,
      reason: closureReason || t.closed,
    },
  ]);

  setClosureDate('');
  setClosureReason('');
  setMessage(t.specialClosureAdded);
}

function removeClosure(id: number) {
  setClosures((current) =>
    current.filter((closure) => closure.id !== id),
  );

  setMessage(t.specialClosureRemoved);
}

function addTableSetup() {
  const count = Number(tableCountInput);
  const seats = Number(tableSeatsInput);

  if (!count || !seats) {
    setMessage('Please enter valid table values.');
    return;
  }

  setTableSetup((current) => [
    ...current,
    {
      count,
      seats,
    },
  ]);

  setTableCountInput('');
  setTableSeatsInput('');
  setMessage('Table configuration added.');
}

function removeTableSetup(index: number) {
  setTableSetup((current) =>
    current.filter((_, currentIndex) => currentIndex !== index),
  );

  setMessage('Table configuration removed.');
}

const dayLabels: Record<string, string> = {
  Monday: t.monday,
  Tuesday: t.tuesday,
  Wednesday: t.wednesday,
  Thursday: t.thursday,
  Friday: t.friday,
  Saturday: t.saturday,
  Sunday: t.sunday,
  Mon: t.monday,
  Tue: t.tuesday,
  Wed: t.wednesday,
  Thu: t.thursday,
  Fri: t.friday,
  Sat: t.saturday,
  Sun: t.sunday,
};

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
          {t.settings}
        </p>

        <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
          {t.availabilityTitle}
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
          {t.availabilityDescription}
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[.02] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.22em] text-white/35">
              {t.weeklySchedule}
            </p>

            <h2 className="mt-2 font-display text-3xl font-light">
              {t.regularOpeningHours}
            </h2>

            <p className="mt-3 text-sm text-white/45">
              {t.weeklyScheduleDescription}
            </p>
          </div>

          <button
            onClick={handleSave}
            className="rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            {t.saveChanges}
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {schedule.map((item) => (
            <div
              key={item.day}
              className="rounded-2xl border border-white/10 bg-white/[.03] p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">
                    {dayLabels[item.day] || item.day}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[.18em] text-white/35">
                    {item.isOpen ? t.open : t.closed}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => updateDay(item.day, !item.isOpen)}
                  className="rounded-full border px-4 py-3 text-sm transition"
                  style={{
                    borderColor: item.isOpen ? cyan : 'rgba(255,255,255,.1)',
                    color: item.isOpen ? cyan : 'rgba(255,255,255,.55)',
                    background: item.isOpen
                      ? `${cyan}12`
                      : 'rgba(255,255,255,.03)',
                  }}
                >
                  {item.isOpen ? t.open : t.closed}
                </button>
              </div>

              {item.isOpen && (
                <div className="mt-5 space-y-4">
                  {item.sessions.map((session, index) => (
                    <div
                      key={`${item.day}-${index}`}
                      className="rounded-xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[.18em] text-white/45">
                          Session {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeSession(item.day, index)}
                          className="text-xs text-red-300 transition hover:text-red-200"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        {(
                          [
                            ['start', 'Opening'],
                            ['end', 'Closing'],
                            ['last_booking', 'Last booking'],
                          ] as const
                        ).map(([field, label]) => (
                          <label key={field} className="space-y-2">
                            <span className="text-xs uppercase tracking-[.12em] text-white/35">
                              {label}
                            </span>

                            <input
                              type="time"
                              value={session[field] ?? ''}
                              onChange={(event) =>
                                updateSession(
                                  item.day,
                                  index,
                                  field,
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/[.03] px-3 py-3 text-white outline-none transition focus:border-white/25"
                            />
                          </label>
                        ))}
                      </div>

                      <p className="mt-3 text-xs text-white/35">
                        Leave last booking empty to use the default cutoff.
                      </p>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addSession(item.day)}
                    className="rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
                  >
                    + Add session
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        )}
      </div>
      
      

      {restaurantId && (
        <TablesManager restaurantId={restaurantId} />
      )}

      <div className="rounded-3xl border border-white/10 bg-white/[.02] p-6">
        <p className="text-xs uppercase tracking-[.22em] text-white/35">
          {t.specialClosures}
        </p>

        <h2 className="mt-2 font-display text-3xl font-light">
          {t.holidaysExceptions}
        </h2>

        <p className="mt-3 text-sm text-white/45">
          {t.specialClosuresDescription}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="date"
            value={closureDate}
            onChange={(event) => setClosureDate(event.target.value)}
            className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
          />

          <input
            placeholder={t.closureReasonPlaceholder}
            value={closureReason}
            onChange={(event) => setClosureReason(event.target.value)}
            className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
          />

          <button
            onClick={addClosure}
            className="rounded-xl px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            {t.addClosure}
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {closures.length === 0 ? (
            <p className="text-sm text-white/35">
              {t.noSpecialClosures}
            </p>
          ) : (
            closures.map((closure) => (
              <div
                key={closure.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-white">
                    {closure.date}
                  </p>

                  <p className="mt-1 text-sm text-white/40">
                    {closure.reason}
                  </p>
               </div>

              <button
                onClick={() => removeClosure(closure.id)}
                className="rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/15"
              >
                {t.remove}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
}