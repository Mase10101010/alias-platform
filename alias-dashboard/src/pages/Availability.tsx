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

const initialSchedule = [
  { day: 'Monday', isOpen: true, openingHour: '11', closingHour: '22' },
  { day: 'Tuesday', isOpen: true, openingHour: '11', closingHour: '22' },
  { day: 'Wednesday', isOpen: true, openingHour: '11', closingHour: '22' },
  { day: 'Thursday', isOpen: true, openingHour: '11', closingHour: '22' },
  { day: 'Friday', isOpen: true, openingHour: '11', closingHour: '22' },
  { day: 'Saturday', isOpen: true, openingHour: '11', closingHour: '22' },
  { day: 'Sunday', isOpen: false, openingHour: '11', closingHour: '22' },
];

type SpecialClosure = {
  id: number;
  date: string;
  reason: string;
};

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

        if(restaurant.weekly_schedule?.length) {
          setSchedule(
            restaurant.weekly_schedule.map((item) => ({
              day: item.day,
              isOpen: item.isOpen ?? item.is_open ?? true,
              openingHour: item.openingHour ?? item.opening_hour ?? '11',
              closingHour: item.closingHour ?? item.closing_hour ?? '22',
            })),
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

  function updateDay(
    day: string,
    field: 'isOpen' | 'openingHour' | 'closingHour',
    value: boolean | string,
  ) {
    setMessage(null);

    setSchedule((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              [field]: value,
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

  try {
    setMessage(null);

    await updateRestaurant(restaurantId, {
      weekly_schedule: schedule.map((item) => ({
        day: item.day,
        is_open: item.isOpen,
        opening_hour: item.openingHour,
        closing_hour: item.closingHour,
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
              className="grid gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 md:grid-cols-[160px_1fr_1fr_120px] md:items-center"
            >
              <div>
                <p className="font-medium text-white">
                  {dayLabels[item.day]}
                </p>

                <p className="mt-1 text-xs uppercase tracking-[.18em] text-white/35">
                  {item.isOpen ? t.open : t.closed}
                </p>
              </div>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[.18em] text-white/35">
                  {t.opening}
                </span>

                <input
                  disabled={!item.isOpen}
                  value={item.openingHour}
                  onChange={(event) =>
                    updateDay(item.day, 'openingHour', event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25 disabled:opacity-35"
                  placeholder="11"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[.18em] text-white/35">
                  {t.closing}
                </span>

                <input
                  disabled={!item.isOpen}
                  value={item.closingHour}
                  onChange={(event) =>
                    updateDay(item.day, 'closingHour', event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25 disabled:opacity-35"
                  placeholder="22"
                />
              </label>

              <button
                onClick={() => updateDay(item.day, 'isOpen', !item.isOpen)}
                className="rounded-full border px-4 py-3 text-sm transition"
                style={{
                  borderColor: item.isOpen ? cyan : 'rgba(255,255,255,.1)',
                  color: item.isOpen ? cyan : 'rgba(255,255,255,.55)',
                  background: item.isOpen ? `${cyan}12` : 'rgba(255,255,255,.03)',
                }}
              >
                {item.isOpen ? t.open : t.closed}
              </button>
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