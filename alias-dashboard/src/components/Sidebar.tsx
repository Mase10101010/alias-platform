import { 
  CalendarDays, 
  LifeBuoy,
  Clock3,
  Home, 
  Rocket,
  Settings,  
  Users,
} from 'lucide-react';

import { AliasMark } from './Brand';
import { cyan } from '@/lib/data';
import { translations, type LanguageCode } from '@/lib/i18n';

const items = [
  { id: 'home', labelKey: 'overview', icon: Home },
  { id: 'onboarding', labelKey: 'onboarding', icon: Rocket },
  { id: 'reservations', labelKey: 'reservations', icon: CalendarDays },
  { id: 'availability', labelKey: 'availability', icon: Clock3 },
  { id: 'settings', labelKey: 'settings', icon: Settings },
  { id: 'support', labelKey: 'support', icon: LifeBuoy},
] as const;

export function Sidebar({
  active,
  setActive,
  language,
  isOpen = false,
  onClose,
  restaurantName,
}: {
  active: string;
  setActive: (id: string) => void;
  language: LanguageCode;
  isOpen?: boolean;
  onClose?: () => void;
  restaurantName: string;
}) {
  const t = translations[language];

  return (
    <>
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-white/[.06] bg-black px-5 py-6 transition-transform duration-300 lg:static lg:min-h-screen lg:translate-x-0 lg:bg-black/30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AliasMark />

        <div className="mt-10 space-y-2">
          {items.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActive(id);
                onClose?.();
              }}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition"
              style={{
                background:
                  active === id
                    ? 'rgba(127,227,230,.10)'
                    : 'transparent',
                color:
                  active === id
                    ? cyan
                    : 'rgba(255,255,255,.62)',
              }}
            >
              <Icon size={17} />
              {t[labelKey]}
            </button>
          ))}
        </div>

        <div className="glass mt-10 rounded-2xl p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-white/55">
            <Users size={15} /> {restaurantName}
          </div>

          <p className="font-display text-xl font-light text-white">
            {t.trialDay}
          </p>

          <p className="mt-2 text-sm leading-relaxed text-white/45">
            {t.liveConcierge}
          </p>
        </div>
      </aside>
    </>
  );
}