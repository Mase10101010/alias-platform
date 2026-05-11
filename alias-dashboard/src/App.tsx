import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { AliasMark } from '@/components/Brand';
import { Auth } from '@/pages/Auth';
import { Overview } from '@/pages/Overview';
import { Onboarding } from '@/pages/Onboarding';
import { Reservations } from '@/pages/Reservations';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';

function Page({ active }: { active: string }) {
  if (active === 'onboarding') return <Onboarding />;
  if (active === 'reservations') return <Reservations />;
  if (active === 'analytics') return <Analytics />;
  if (active === 'settings') return <Settings />;
  return <Overview />;
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [active, setActive] = useState('home');
  if (!authed) return <Auth onEnter={() => setAuthed(true)} />;
  return (
    <div className="grain min-h-screen bg-ink text-white">
      <div className="fixed inset-0 -z-10 opacity-[.06]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(circle at 55% 20%, black, transparent 70%)' }} />
      <div className="fixed left-1/2 top-0 -z-10 h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-cyanAlias/10 blur-3xl" />
      <div className="flex">
        <Sidebar active={active} setActive={setActive} />
        <main className="min-h-screen flex-1 px-5 py-5 md:px-8 lg:px-10">
          <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/[.06] bg-white/[.025] px-4 py-3 lg:hidden">
            <AliasMark />
            <Menu className="text-white/60" />
          </header>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .45 }} className="mx-auto max-w-7xl py-6">
              <Page active={active} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
