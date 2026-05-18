import { 
  CalendarDays, 
  ChartNoAxesCombined, 
  Home, 
  Rocket,
  Settings, 
  Sparkles, 
  Users } from 'lucide-react';
import { AliasMark } from './Brand';
import { cyan } from '@/lib/data';

const items = [
  { id: 'home', label: 'Overview', icon: Home },
  { id: 'concierge', label: 'Concierge AI', icon: Sparkles },
  { id: 'onboarding', label: 'Onboarding', icon: Rocket },
  { id: 'reservations', label: 'Reservations', icon: CalendarDays },
  { id: 'availability', label: 'Availability', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { id: 'settings', label: 'Settings', icon: Settings },
  
];

export function Sidebar({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/[.06] bg-black/30 px-5 py-6 lg:block">
      <AliasMark />
      <div className="mt-10 space-y-2">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition" style={{ background: active === id ? 'rgba(127,227,230,.10)' : 'transparent', color: active === id ? cyan : 'rgba(255,255,255,.62)' }}>
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>
      <div className="glass mt-10 rounded-2xl p-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-white/55"><Users size={15} /> La Maison</div>
        <p className="font-display text-xl font-light text-white">Trial day 3</p>
        <p className="mt-2 text-sm leading-relaxed text-white/45">Your AI concierge is live and handling guest requests.</p>
      </div>
    </aside>
  );
}
