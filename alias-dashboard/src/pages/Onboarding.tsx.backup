import {
  useEffect,
  useMemo,
  useState,
} from 'react';


import { cyan } from '@/lib/data';
import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';
import {
  createRestaurant,
  getRestaurants,
} from '@/lib/api';
import { Tables } from '@/pages/Tables';
import { motion } from 'framer-motion';


const steps = ['Business', 'Service', 'Concierge', 'Floor plan'];

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

  table_number_input: string;
  seats_input: string;

  tables: {
    table_number: string;
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
  


  table_number_input: '',
  seats_input: '2',

  tables: [],

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

export function Onboarding({
  onComplete,
  existingRestaurant = false,
}: {
  onComplete?: () => void;
  existingRestaurant?: boolean;
}) {
  const [step, setStep] = useState(
    existingRestaurant ? 3 : 0,
  );
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRestaurantId, setCreatedRestaurantId] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (!existingRestaurant) {
      return;
    }

    let cancelled = false;

    async function loadExistingRestaurant() {
      try {
        const restaurants = await getRestaurants();
        const restaurant = restaurants[0];

        if (!cancelled) {
          setCreatedRestaurantId(
            restaurant?.id ?? null,
          );
        }
      } catch (error) {
        console.error(
          'Unable to load existing restaurant',
          error,
        );

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : 'Unable to load restaurant workspace.',
          );
        }
      }
    }

    void loadExistingRestaurant();

    return () => {
      cancelled = true;
    };
  }, [existingRestaurant]);
  const [error, setError] = useState<string | null>(null);
  const language = detectDefaultLanguage();
  const t = translations[language];

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      return next;
    });
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

    if (step < 2) {
      setStep((current) => Math.min(2, current + 1));
      return;
    }

    if (step === 3 || isSubmitting) {
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
        preferred_language: language,
        timezone: 'Australia/Perth',
        opening_hour: Number(form.opening_hour),
        closing_hour: Number(form.closing_hour),
        number_of_tables: 0,
        table_setup: [],
        weekly_schedule: form.weekly_schedule,
        special_closures: [],
        concierge_tone: form.concierge_tone,
      });

      setCreatedRestaurantId(restaurant.id);
      setStep(3);
    } catch (err) {
      console.error(
        'Unable to create restaurant workspace',
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create restaurant workspace.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={step === 3 ? 'mx-auto max-w-7xl' : 'mx-auto max-w-4xl'}>
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
        <>
          {step === 0 && (
            <BusinessStep
              form={form}
              updateField={updateField}
              title={t.businessStepTitle}
              description={t.businessStepDescription}
              labels={{
                restaurantName: t.restaurantName,
                businessType: t.businessType,
                contactEmail: t.contactEmail,
                phoneNumberLabel: t.phoneNumberLabel,
              }}
            />
          )}

          {step === 1 && (
            <ServiceStep
              form={form}
              updateWeeklySchedule={updateWeeklySchedule}
              labels={{
                serviceStepTitle: t.serviceStepTitle,
                serviceStepDescription: t.serviceStepDescription,
                availabilityTitle: t.availabilityTitle,
                openingDays: t.openingDays,
                openingDaysDescription: t.openingDaysDescription,
                open: t.open,
                closed: t.closed,
                monday: t.monday,
                tuesday: t.tuesday,
                wednesday: t.wednesday,
                thursday: t.thursday,
                friday: t.friday,
                saturday: t.saturday,
                sunday: t.sunday,
              }}
            />
          )}

          {step === 2 && (
            <TonePicker
              form={form}
              updateField={updateField}
              labels={{
                tonePickerTitle: t.tonePickerTitle,
                tonePickerDescription: t.tonePickerDescription,
                toneCardDescription: t.toneCardDescription,
                toneLuxury: t.toneLuxury,
                toneElegant: t.toneElegant,
                toneCasual: t.toneCasual,
                toneModern: t.toneModern,
                toneLuxuryDescription: t.toneLuxuryDescription,
                toneElegantDescription: t.toneElegantDescription,
                toneCasualDescription: t.toneCasualDescription,
                toneModernDescription: t.toneModernDescription,
              }}
            />
          )}

          {step === 3 && createdRestaurantId && (
            <Tables
              onboardingMode
              onOnboardingComplete={onComplete}
            />
          )}

          {step === 3 &&
            existingRestaurant &&
            !createdRestaurantId &&
            !error && (
              <div className="py-16 text-center text-sm text-white/40">
                Loading restaurant workspace...
              </div>
            )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {step < 3 && (
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => {
                  setError(null);
                  setStep(Math.max(0, step - 1));
                }}
                disabled={isSubmitting || step === 0}
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
                  : step === 2
                    ? 'Configure floor plan'
                    : t.continue}
              </button>
            </div>
          )}
        </>
      </motion.div>
    </div>
  );
}

function BusinessStep({
  form,
  updateField,
  title,
  description,
  labels,
}: {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
  title: string;
  description: string;
  labels: Record<string, string>;
}) {
  return (
    <>
      <h2 className="font-display text-3xl font-light">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
        {description}
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <Input
          placeholder={labels.restaurantName}
          value={form.name}
          onChange={(value) => updateField('name', value)}
        />

        <Input
          placeholder={labels.businessType}
          value={labels.businessType}
          onChange={() => {}} 
          disabled
        />

        <Input
          placeholder={labels.contactEmail}
          value={form.email}
          onChange={(value) => updateField('email', value)}
        />

        <Input
          placeholder={labels.phoneNumberLabel}
          value={form.phone}
          onChange={(value) => updateField('phone', value)}
        />
      </div>
    </>
  );
}

function ServiceStep({
  form,
  updateWeeklySchedule,
  labels,
}: {
  form: FormState;
  updateWeeklySchedule: (
    day: string,
    field: 'is_open' | 'opening_hour' | 'closing_hour',
    value: boolean | string,
  ) => void;
  labels: Record<string, string>;
}) {
  const dayLabels: Record<string, string> = {
    Mon: labels.monday,
    Tue: labels.tuesday,
    Wed: labels.wednesday,
    Thu: labels.thursday,
    Fri: labels.friday,
    Sat: labels.saturday,
    Sun: labels.sunday,
  };

  return (
    <>
      <h2 className="font-display text-3xl font-light">
        {labels.serviceStepTitle}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
        {labels.serviceStepDescription}
      </p>

      <div className="mt-7 rounded-3xl border border-white/10 bg-white/[.02] p-5">
        <p className="text-xs uppercase tracking-[.22em] text-white/35">
          {labels.availabilityTitle}
        </p>

        <h3 className="mt-2 font-display text-2xl font-light">
          {labels.openingDays}
        </h3>

        <p className="mt-2 text-sm text-white/45">
          {labels.openingDaysDescription}
        </p>

        <div className="mt-5 space-y-3">
          {form.weekly_schedule.map((schedule) => (
            <div
              key={schedule.day}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
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
                  {dayLabels[schedule.day]}
                </button>

                <span className="text-sm text-white/45">
                  {schedule.is_open ? labels.open : labels.closed}
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
                  disabled={!schedule.is_open}
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
                  disabled={!schedule.is_open}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TonePicker({
  form,
  updateField,
  labels,
}: {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
  labels: Record<string, string>;
}) {
  const tones = [
    {
      value: 'Luxury',
      label: labels.toneLuxury,
      description: labels.toneLuxuryDescription,
    },
    {
      value: 'Elegant',
      label: labels.toneElegant,
      description: labels.toneElegantDescription,
    },
    {
      value:  'Casual',
      label: labels.toneCasual,
      description: labels.toneCasualDescription,
    },
    {
      value: 'Modern',
      label: labels.toneModern,
      description: labels.toneModernDescription,
    },
  ];

  return (
    <>
      <h2 className="font-display text-3xl font-light">
        {labels.tonePickerTitle}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
        {labels.tonePickerDescription}
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-4">
        {tones.map((tone) => {
          const active = form.concierge_tone === tone.value;

          return (
            <button
              key={tone.value}
              onClick={() => updateField('concierge_tone', tone.value)}
              className="rounded-2xl border bg-white/[.025] p-5 text-left transition hover:border-white/20"
              style={{
                borderColor: active ? cyan : 'rgba(255,255,255,.1)',
                boxShadow: active ? `0 0 32px ${cyan}18` : undefined,
              }}
            >
              <p className="font-display text-2xl">
                {tone.label}
              </p>

              <p className="mt-3 text-sm text-white/45">
                {tone.description}
              </p>
            </button>
          );
        })}
      </div>
    </>
  );
}


function Input({
  placeholder,
  value,
  onChange,
  disabled = false,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <input
      disabled={disabled}
      className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}