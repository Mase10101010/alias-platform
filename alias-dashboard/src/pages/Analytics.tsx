import { cyan } from '@/lib/data';
import { MetricCard } from '@/components/MetricCard';
import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';

const bars = [
  18, 12, 8, 10, 15, 22, 28, 35, 31, 26, 29, 38,
  46, 42, 36, 51, 62, 70, 58, 44, 32, 25, 19, 14,
];

export function Analytics() {
  const language = detectDefaultLanguage();
  const t = translations[language];

  const max = Math.max(...bars);

  return (
    <div>
      <p
        className="text-[11px] uppercase tracking-[0.28em]"
        style={{ color: cyan }}
      >
        {t.analytics}
      </p>

      <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
        {t.analyticsHeading}
      </h1>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <MetricCard
          label={t.monthlyBookings}
          value="486"
          detail="+22%"
          accent
        />

        <MetricCard
          label={t.noShowReduction}
          value="38%"
          detail={t.estimated}
        />

        <MetricCard
          label={t.automationRate}
          value="94%"
          detail={t.resolved}
        />
      </div>

      <div className="glass mt-6 rounded-3xl p-6">
        <p className="mb-6 text-[10px] uppercase tracking-[.24em] text-white/35">
          {t.requestsByHour}
        </p>

        <div className="flex h-72 items-end gap-2">
          {bars.map((bar, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-md"
              style={{
                height: `${(bar / max) * 100}%`,
                background:
                  index > 16 && index < 21
                    ? `linear-gradient(to top, ${cyan}, ${cyan}55)`
                    : 'rgba(255,255,255,.12)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}