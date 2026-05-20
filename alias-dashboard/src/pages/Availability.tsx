import { useEffect, useState } from 'react';

import { cyan } from '@/lib/data';
import { getRestaurants, updateRestaurant } from '@/lib/api';

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
  
  const [closureDate, setClosureDate] = useState('');
  const [closureReason, setClosureReason] = useState('');

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoading(true);

        const restaurants = await getRestaurants();
        const restaurant = restaurants[0];

        if (!restaurant) {
          setMessage('No restaurant found. ');
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
      } catch (err) {
        setMessage(
          err instanceof Error
            ? err.message
            : 'Unable to load availability. ',
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
    setMessage('No restaurant selected.');
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
    });

    setMessage('Availability saved successfully.');
  } catch (err) {
    setMessage(
      err instanceof Error
        ? err.message
        : 'Unable to save availability.',
    );
  }
}

  function addClosure() {
  if (!closureDate.trim()) {
    setMessage('Please select a closure date.');
    return;
  }

  setClosures((current) => [
    ...current,
    {
      id: Date.now(),
      date: closureDate,
      reason: closureReason || 'Closed',
    },
  ]);

  setClosureDate('');
  setClosureReason('');
  setMessage('Special closure added.');
}

function removeClosure(id: number) {
  setClosures((current) =>
    current.filter((closure) => closure.id !== id),
  );

  setMessage('Special closure removed.');
}

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
          Restaurant settings
        </p>

        <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
          Availability
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
          Manage your weekly opening schedule and special closures for holidays,
          private events, or unexpected shutdowns.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[.02] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.22em] text-white/35">
              Weekly schedule
            </p>

            <h2 className="mt-2 font-display text-3xl font-light">
              Regular opening hours
            </h2>

            <p className="mt-3 text-sm text-white/45">
              Set the default opening days and hours used by the AI concierge.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            Save changes
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {schedule.map((item) => (
            <div
              key={item.day}
              className="grid gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 md:grid-cols-[160px_1fr_1fr_120px] md:items-center"
            >
              <div>
                <p className="font-medium text-white">{item.day}</p>

                <p className="mt-1 text-xs uppercase tracking-[.18em] text-white/35">
                  {item.isOpen ? 'Open' : 'Closed'}
                </p>
              </div>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[.18em] text-white/35">
                  Opening
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
                  Closing
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
                {item.isOpen ? 'Open' : 'Closed'}
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

      <div className="rounded-3xl border border-white/10 bg-white/[.02] p-6">
        <p className="text-xs uppercase tracking-[.22em] text-white/35">
          Special closures
        </p>

        <h2 className="mt-2 font-display text-3xl font-light">
          Holidays and exceptions
        </h2>

        <p className="mt-3 text-sm text-white/45">
          Add holidays, private events, or unexpected closures so the AI
          concierge never confirms reservations when the restaurant is closed.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="date"
            value={closureDate}
            onChange={(event) => setClosureDate(event.target.value)}
            className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
          />

          <input
            placeholder="Reason (e.g. Christmas Day)"
            value={closureReason}
            onChange={(event) => setClosureReason(event.target.value)}
            className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
          />

          <button
            onClick={addClosure}
            className="rounded-xl px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            Add closure
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {closures.length === 0 ? (
            <p className="text-sm text-white/35">
              No special closures added yet.
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
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
}