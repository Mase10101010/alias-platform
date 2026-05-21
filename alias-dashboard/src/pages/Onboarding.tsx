import { useMemo, useState } from 'react';


import { cyan } from '@/lib/data';
import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';
import { createRestaurant } from '@/lib/api';
import { motion } from 'framer-motion';

const steps = ['Business', 'Service', 'Concierge', 'Launch'];

type FormState = {
  name: string;
  business_type: string;
  email: string;
  phone: string;
  opening_hour: string;
  closing_hour: string;
  number_of_tables: string;
  two_seat_tables: string;
  four_seat_tables: string;
  six_seat_tables: string;
  eight_seat_tables: string;
  concierge_tone: string;
  opening_days: string[];

  table_count_input: string;
  seats_per_table_input: string;

  table_setup: {
    count: number;
    seats: number;
  }[];

  weekly_schedule: {
    day: string;
    is_open: boolean;
    opening_hour: string;
    closing_hour: string;
  }[];
};

const initialForm: FormState = {
  name: '',
  business_type: 'restaurant',
  email: '',
  phone: '',
  opening_hour: '11',
  closing_hour: '22',
  opening_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  number_of_tables: '0',
  two_seat_tables: '0',
  four_seat_tables: '0',
  six_seat_tables: '0',
  eight_seat_tables: '0',
  concierge_tone: 'Elegant',
  


  table_count_input: '',
  seats_per_table_input: '',

  table_setup: [],

  weekly_schedule: [
    {day: 'Mon', is_open: true, opening_hour: '11', closing_hour: '22'},
    {day: 'Tue', is_open: true, opening_hour: '11', closing_hour: '22'},
    {day: 'Wed', is_open: true, opening_hour: '11', closing_hour: '22'},
    {day: 'Thu', is_open: true, opening_hour: '11', closing_hour: '22'},
    {day: 'Fri', is_open: true, opening_hour: '11', closing_hour: '22'},
    {day: 'Sat', is_open: true, opening_hour: '11', closing_hour: '22'},
    {day: 'Sun', is_open: false, opening_hour: '11', closing_hour: '22'},
  ],
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRestaurantId, setCreatedRestaurantId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const language = detectDefaultLanguage();
  const t = translations[language];

  const totalTables = useMemo(() => {
  return form.table_setup.reduce(
    (total, table) => total + table.count,
    0,
  );
}, [form.table_setup]);

  const estimatedSeats = useMemo(() => {
  return form.table_setup.reduce(
    (total, table) => total + table.count * table.seats,
    0,
  );
}, [form.table_setup]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      return next;
    });
  }

function addTableSetup() {
  const count = toNumber(form.table_count_input);
  const seats = toNumber(form.seats_per_table_input);

  if (count <= 0 || seats <= 0) {
    setError('Please enter both the number of tables and seats per table.');
    return;
  }

  setError(null);

  setForm((current) => ({
    ...current,
    table_setup: [
      ...current.table_setup,
      {
        count,
        seats,
      },
    ],
    table_count_input: '',
    seats_per_table_input: '',
    number_of_tables: String(
      current.table_setup.reduce((total, table) => total + table.count, 0) +
        count,
    ),
  }));
}

function removeTableSetup(index: number) {
  setForm((current) => ({
    ...current,
    table_setup: current.table_setup.filter((_, itemIndex) => itemIndex !== index),
  }));
}

function toggleOpeningDay(day: string) {
  setForm((current) => {
    const exists = current.opening_days.includes(day);

    return {
      ...current,
      opening_days: exists
        ? current.opening_days.filter((d) => d !== day)
        : [...current.opening_days, day],
    };
  });
}

function updateWeeklySchedule(
  day: string,
  field: 'is_open' | 'opening_hour' | 'closing_hour',
  value: boolean | string,
) {
  setForm((current) => ({
    ...current,
    weekly_schedule: current.weekly_schedule.map((item) =>
      item.day === day
        ? {
            ...item,
            [field]: value,
          }
        : item,
    ),
  }));
}

  function validateCurrentStep() {
    if (step === 0) {
      if (!form.name.trim()) {
        return 'Please enter your restaurant name.';
      }

      if (!form.business_type.trim()) {
        return 'Please enter your business type.';
      }

      if (!form.email.trim()) {
        return 'Please enter your contact email.';
      }

      if (!form.phone.trim()) {
        return 'Please enter your phone number.';
      }
    }

    if (step === 1) {
      const openingHour = Number(form.opening_hour);
      const closingHour = Number(form.closing_hour);

      if (
        !Number.isFinite(openingHour) ||
        !Number.isFinite(closingHour) ||
        openingHour < 0 ||
        openingHour > 23 ||
        closingHour < 1 ||
        closingHour > 24 ||
        openingHour >= closingHour
      ) {
        return 'Please enter valid opening and closing hours.';
      }

      if (totalTables <= 0) {
        return 'Please enter at least one table.';
      }
    }

    return null;
  }

  async function handleContinue() {
    setError(null);

    const validationError = validateCurrentStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (step < 3) {
      setStep((current) => Math.min(3, current + 1));
      return;
    }

    setIsSubmitting(true);

    try {
      const restaurant = await createRestaurant({
        name: form.name.trim(),
        slug: makeSlug(form.name),
        business_type: form.business_type || 'restaurant',
        phone: form.phone || undefined,
        email: form.email || undefined,
        timezone: 'Australia/Perth',
        opening_hour: Number(form.opening_hour),
        closing_hour: Number(form.closing_hour),
        number_of_tables: totalTables,
        table_setup: form.table_setup,
        weekly_schedule: form.weekly_schedule,
        special_closures: [],
        concierge_tone: form.concierge_tone,
      });

      setCreatedRestaurantId(restaurant.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to launch concierge.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p
        className="text-[11px] uppercase tracking-[0.28em]"
        style={{ color: cyan }}
      >
        {t.onboardingTitle}
      </p>

      <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
        {t.onboardingHeading}
      </h1>

      <div className="mt-10 flex gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div
              className="h-1 rounded-full"
              style={{
                background: i <= step ? cyan : 'rgba(255,255,255,.1)',
              }}
            />
            <p className="mt-3 text-xs text-white/45">{s}</p>
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass mt-10 rounded-3xl p-8"
      >
        {createdRestaurantId ? (
          <Success restaurantId={createdRestaurantId} restaurantName={form.name} />
        ) : (
          <>
            {step === 0 && <BusinessStep form={form} updateField={updateField} />}
            {step === 1 && (
              <ServiceStep
                form={form}
                updateField={updateField}
                totalTables={totalTables}
                estimatedSeats={estimatedSeats}
                addTableSetup={addTableSetup}
                removeTableSetup={removeTableSetup}
                toggleOpeningDay={toggleOpeningDay}
                updateWeeklySchedule={updateWeeklySchedule}
              />
            )}
            {step === 2 && <TonePicker form={form} updateField={updateField} />}
            {step === 3 && (
              <Launch
                form={form}
                totalTables={totalTables}
                estimatedSeats={estimatedSeats}
              />
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => {
                  setError(null);
                  setStep(Math.max(0, step - 1));
                }}
                disabled={isSubmitting}
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/60 disabled:opacity-40"
              >
                {t.back}
              </button>

              <button
                onClick={handleContinue}
                disabled={isSubmitting}
                className="rounded-full px-5 py-3 text-sm text-black disabled:opacity-60"
                style={{ background: cyan }}
              >
                {isSubmitting
                  ? t.launching
                  : step === 3
                    ? t.launchConcierge
                    : t.continue}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function BusinessStep({
  form,
  updateField,
}: {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
}) {
  return (
    <>
      <h2 className="font-display text-3xl font-light">
        Tell us about the establishment
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
        These details help Alias configure your workspace and personalize the
        AI concierge experience for your guests.
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Restaurant name"
          value={form.name}
          onChange={(value) => updateField('name', value)}
        />

        <Input
          placeholder="Business type"
          value={form.business_type}
          onChange={(value) => updateField('business_type', value)}
        />

        <Input
          placeholder="Contact email"
          value={form.email}
          onChange={(value) => updateField('email', value)}
        />

        <Input
          placeholder="Phone number"
          value={form.phone}
          onChange={(value) => updateField('phone', value)}
        />
      </div>
    </>
  );
}

function ServiceStep({
  form,
  updateField,
  totalTables,
  estimatedSeats,
  addTableSetup,
  removeTableSetup,
  toggleOpeningDay,
  updateWeeklySchedule,
}: {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
  totalTables: number;
  estimatedSeats: number;
  toggleOpeningDay: (day: string) => void;

  updateWeeklySchedule: (
    day: string,
    field: 'is_open' | 'opening_hour' | 'closing_hour',
    value: boolean | string,
  ) => void;

  addTableSetup: () => void;

  removeTableSetup: (index: number) => void;

}) {
  return (
    <>
      <h2 className="font-display text-3xl font-light">
        Restaurant capacity setup
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
        Configure the seating structure of your restaurant so the AI concierge
        can better manage reservations and availability.
      </p>

      <div className="mt-7 rounded-3xl border border-white/10 bg-white/[.02] p-5">
        <p className="text-xs uppercase tracking-[.22em] text-white/35">
          Opening hours
        </p>

        <h3 className="mt-2 font-display text-2xl font-light">
          Restaurant schedule
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-xs uppercase tracking-[.18em] text-white/40">
              Opening time
            </span>

            <Input
              placeholder="Opening hour (e.g. 11)"
              value={form.opening_hour}
              onChange={(value) => updateField('opening_hour', value)}
              />
            </label>

            <label className="space-y-2">
              <span className="block text-xs uppercase tracking-[.18em] text-white/40">
                Closing time
              </span>

              <Input
                placeholder="Closing hour (e.g. 22)"
                value={form.closing_hour}
                onChange={(value) => updateField('closing_hour', value)}
              />
            </label>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[.02] p-5">
        <p className="text-xs uppercase tracking-[.22em] text-white/35">
          Availability
        </p>

        <h3 className="mt-2 font-display text-2xl font-light">
          Opening days
        </h3>

        <p className="mt-2 text-sm text-white/45">
          Select the days when the restaurant is open.
        </p>

        <div className="mt-5 space-y-3">
          {form.weekly_schedule.map((schedule) => (
            <div
              key={schedule.day}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateWeeklySchedule(
                      schedule.day,
                      'is_open',
                      !schedule.is_open,
                    )
                  }
                  className="rounded-full border px-4 py-2 text-sm transition"
                  style={{
                    borderColor: schedule.is_open
                      ? cyan
                      : 'rgba(255,255,255,.1)',

                    background: schedule.is_open
                      ? `${cyan}15`
                      : 'rgba(255,255,255,.03)',

                    color: schedule.is_open
                      ? cyan
                      : 'rgba(255,255,255,.7)',
                  }}
                >
                  {schedule.day}
                </button>

                <span className="text-sm text-white/45">
                  {schedule.is_open ? 'Open' : 'Closed'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 md:w-[320px]">
                <Input
                  placeholder="Open"
                  value={schedule.opening_hour}
                  onChange={(value) =>
                    updateWeeklySchedule(
                      schedule.day,
                      'opening_hour',
                      value,
                    )
                  }
                />

                <Input
                  placeholder="Close"
                  value={schedule.closing_hour}
                  onChange={(value) =>
                    updateWeeklySchedule(
                      schedule.day,
                      'closing_hour',
                      value,
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[.02] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.22em] text-white/35">
              Seating configuration
            </p>

            <h3 className="mt-2 font-display text-2xl font-light">
              Table distribution
            </h3>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[.22em] text-white/35">
              Total tables
            </p>

            <p className="mt-2 font-display text-4xl font-light text-white">
              {totalTables}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <Input
              placeholder="Number of tables"
              value={form.table_count_input}
              onChange={(value) => updateField('table_count_input', value)}
            />

            <Input
              placeholder="Seats per table"
              value={form.seats_per_table_input}
              onChange={(value) => updateField('seats_per_table_input', value)}
            />

            <button
              onClick={addTableSetup}
              className="rounded-xl px-5 py-3 text-sm font-medium text-black"
              style={{ background: cyan }}
            >
              Add
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {form.table_setup.length === 0 ? (
              <p className="text-sm text-white/35">
                No table configurations added yet.
              </p>
            ) : (
              form.table_setup.map((table, index) => (
                <div
                  key={`${table.count}-${table.seats}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.03] px-4 py-4"
                >
                  <div>
                    <p className="font-medium text-white">
                      {table.count} tables · {table.seats} seats each
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      Total seats: {table.count * table.seats}
                    </p>
                  </div>

                  <button
                    onClick={() => removeTableSetup(index)}
                    className="text-sm text-red-300 transition hover:text-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </>
  );
}

function TonePicker({
  form,
  updateField,
}: {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
}) {
  const tones = ['Luxury', 'Elegant', 'Casual', 'Modern'];

  return (
    <>
      <h2 className="font-display text-3xl font-light">
        Choose a concierge tone
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
        Select how the AI concierge should communicate with your guests.
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-4">
        {tones.map((tone) => {
          const active = form.concierge_tone === tone;

          return (
            <button
              key={tone}
              onClick={() => updateField('concierge_tone', tone)}
              className="rounded-2xl border bg-white/[.025] p-5 text-left transition hover:border-white/20"
              style={{
                borderColor: active ? cyan : 'rgba(255,255,255,.1)',
                boxShadow: active ? `0 0 32px ${cyan}18` : undefined,
              }}
            >
              <p className="font-display text-2xl">{tone}</p>

              <p className="mt-3 text-sm text-white/45">
                Premium communication profile for guest interactions.
              </p>
            </button>
          );
        })}
      </div>
    </>
  );
}

function Launch({
  form,
  totalTables,
  estimatedSeats,
}: {
  form: FormState;
  totalTables: number;
  estimatedSeats: number;
}) {
  return (
    <div className="text-center">
      <div
        className="cyan-glow mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: `${cyan}18`, color: cyan }}
      >
        A
      </div>

      <h2 className="font-display text-4xl font-light">
        Your workspace is ready.
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-white/50">
        Alias will configure the concierge workspace for{' '}
        {form.name || 'your restaurant'}.
      </p>

      <div className="mx-auto mt-8 grid max-w-2xl gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
          <p className="text-xs uppercase tracking-[.22em] text-white/35">
            Total tables
          </p>

          <p className="mt-3 font-display text-4xl font-light">
            {totalTables}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
          <p className="text-xs uppercase tracking-[.22em] text-white/35">
            Estimated seats
          </p>

          <p className="mt-3 font-display text-4xl font-light">
            {estimatedSeats}
          </p>
        </div>
      </div>
    </div>
  );
}

function Success({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string;
  restaurantName: string;
}) {
  return (
    <div className="text-center">
      <div
        className="cyan-glow mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: `${cyan}18`, color: cyan }}
      >
        ✓
      </div>

      <h2 className="font-display text-4xl font-light">
        {restaurantName} is live on Alias.
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-white/50">
        The restaurant workspace has been created successfully and the trial is
        now active.
      </p>

      <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 text-left text-xs text-white/50">
        Restaurant ID:
        <span className="ml-2 font-mono text-white/80">
          {restaurantId}
        </span>
      </div>
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}