import { 
  CalendarDays, 
  ChartNoAxesCombined, 
  Clock3,
  Home, 
  Rocket,
  Settings, 
  Sparkles, 
  Users } from 'lucide-react';
import { AliasMark } from './Brand';
import { cyan } from '@/lib/data';
import { translations, type LanguageCode } from '@/lib/i18n';

const items = [
  { id: 'home', labelKey: 'overview', icon: Home },
  { id: 'concierge', labelKey: 'concierge', icon: Sparkles },
  { id: 'onboarding', labelKey: 'onboarding', icon: Rocket },
  { id: 'reservations', labelKey: 'reservations', icon: CalendarDays },
  { id: 'availability', labelKey: 'availability', icon: Clock3 },
  { id: 'analytics', labelKey: 'analytics', icon: ChartNoAxesCombined },
  { id: 'settings', labelKey: 'settings', icon: Settings },
  
] as const;

export function Sidebar({ 
  active, 
  setActive,
  language, 
}: { 
  active: string; 
  setActive: (id: string) => void;
  language: LanguageCode;
}) {
  const t = translations[language];
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/[.06] bg-black/30 px-5 py-6 lg:block">
      <AliasMark />
      <div className="mt-10 space-y-2">
        {items.map(({ id, labelKey, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition" style={{ background: active === id ? 'rgba(127,227,230,.10)' : 'transparent', color: active === id ? cyan : 'rgba(255,255,255,.62)' }}>
            <Icon size={17} />
            {t[labelKey]}
          </button>
        ))}
      </div>
      <div className="glass mt-10 rounded-2xl p-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-white/55"><Users size={15} /> La Maison</div>
        <p className="font-display text-xl font-light text-white">{t.trialDay}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/45">{t.liveConcierge}</p>
      </div>
    </aside>
  );
}
