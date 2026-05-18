import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { cyan } from '@/lib/data';
import { createRestaurant } from '@/lib/api';

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
};

const initialForm: FormState = {
  name: '',
  business_type: 'restaurant',
  email: '',
  phone: '',
  opening_hour: '11',
  closing_hour: '22',
  number_of_tables: '0',
  two_seat_tables: '0',
  four_seat_tables: '0',
  six_seat_tables: '0',
  eight_seat_tables: '0',
  concierge_tone: 'Elegant',
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

  const totalTables = useMemo(() => {
    return (
      toNumber(form.two_seat_tables) +
      toNumber(form.four_seat_tables) +
      toNumber(form.six_seat_tables) +
      toNumber(form.eight_seat_tables)
    );
  }, [
    form.two_seat_tables,
    form.four_seat_tables,
    form.six_seat_tables,
    form.eight_seat_tables,
  ]);

  const estimatedSeats = useMemo(() => {
    return (
      toNumber(form.two_seat_tables) * 2 +
      toNumber(form.four_seat_tables) * 4 +
      toNumber(form.six_seat_tables) * 6 +
      toNumber(form.eight_seat_tables) * 8
    );
  }, [
    form.two_seat_tables,
    form.four_seat_tables,
    form.six_seat_tables,
    form.eight_seat_tables,
  ]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (
        field === 'two_seat_tables' ||
        field === 'four_seat_tables' ||
        field === 'six_seat_tables' ||
        field === 'eight_seat_tables'
      ) {
        const total =
          toNumber(field === 'two_seat_tables' ? value : next.two_seat_tables) +
          toNumber(field === 'four_seat_tables' ? value : next.four_seat_tables) +
          toNumber(field === 'six_seat_tables' ? value : next.six_seat_tables) +
          toNumber(field === 'eight_seat_tables' ? value : next.eight_seat_tables);

        next.number_of_tables = String(total);
      }

      return next;
    });
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
        Onboarding
      </p>

      <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
        Configure your AI concierge.
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
                Back
              </button>

              <button
                onClick={handleContinue}
                disabled={isSubmitting}
                className="rounded-full px-5 py-3 text-sm text-black disabled:opacity-60"
                style={{ background: cyan }}
              >
                {isSubmitting
                  ? 'Launching…'
                  : step === 3
                    ? 'Launch concierge'
                    : 'Continue'}
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
}: {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
  totalTables: number;
  estimatedSeats: number;
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

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Opening hour (e.g. 11)"
          value={form.opening_hour}
          onChange={(value) => updateField('opening_hour', value)}
        />

        <Input
          placeholder="Closing hour (e.g. 22)"
          value={form.closing_hour}
          onChange={(value) => updateField('closing_hour', value)}
        />
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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="2-seat tables"
            value={form.two_seat_tables}
            onChange={(value) => updateField('two_seat_tables', value)}
          />

          <Input
            placeholder="4-seat tables"
            value={form.four_seat_tables}
            onChange={(value) => updateField('four_seat_tables', value)}
          />

          <Input
            placeholder="6-seat tables"
            value={form.six_seat_tables}
            onChange={(value) => updateField('six_seat_tables', value)}
          />

          <Input
            placeholder="8-seat tables"
            value={form.eight_seat_tables}
            onChange={(value) => updateField('eight_seat_tables', value)}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-cyanAlias/10 bg-cyanAlias/5 p-5">
          <p className="text-xs uppercase tracking-[.22em] text-cyanAlias">
            Estimated seating capacity
          </p>

          <p className="mt-3 font-display text-4xl font-light text-white">
            {estimatedSeats} seats
          </p>
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