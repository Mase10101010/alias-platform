import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu } from 'lucide-react';

import { Sidebar } from '@/components/Sidebar';
import { AliasMark } from '@/components/Brand';
import { Auth } from '@/pages/Auth';
import { Overview } from '@/pages/Overview';
import { Onboarding } from '@/pages/Onboarding';
import { Reservations } from '@/pages/Reservations';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { Concierge } from '@/pages/Concierge';
import { PublicConcierge } from '@/pages/PublicConcierge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function Page({ active }: { active: string }) {
  if (active === 'concierge') return <Concierge />;
  if (active === 'onboarding') return <Onboarding />;
  if (active === 'reservations') return <Reservations />;
  if (active === 'analytics') return <Analytics />;
  if (active === 'settings') return <Settings />;
  return <Overview />;
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [active, setActive] = useState('home');
  const isPublicConcierge = window.location.pathname === '/concierge';

  if (isPublicConcierge) {
    return <PublicConcierge />
  }

  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem('alias_access_token');

      if (!token) {
        setAuthed(false);
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Invalid session');
        }

        setAuthed(true);
      } catch {
        localStorage.removeItem('alias_access_token');
        localStorage.removeItem('alias_user');
        setAuthed(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    verifySession();
  }, []);

  function handleLogout() {
    localStorage.removeItem('alias_access_token');
    localStorage.removeItem('alias_user');
    setAuthed(false);
    setActive('home');
  }

  if (checkingAuth) {
    return (
      <main className="grain flex min-h-screen items-center justify-center bg-ink text-white">
        <div className="text-center">
          <AliasMark />
          <p className="mt-6 text-sm uppercase tracking-[.28em] text-white/35">
            Securing workspace
          </p>
        </div>
      </main>
    );
  }

  if (!authed) {
    return <Auth onEnter={() => setAuthed(true)} />;
  }

  return (
    <div className="grain min-h-screen bg-ink text-white">
      <div
        className="fixed inset-0 -z-10 opacity-[.06]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(circle at 55% 20%, black, transparent 70%)',
        }}
      />

      <div className="fixed left-1/2 top-0 -z-10 h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-cyanAlias/10 blur-3xl" />

      <div className="flex">
        <Sidebar active={active} setActive={setActive} />

        <main className="min-h-screen flex-1 px-5 py-5 md:px-8 lg:px-10">
          <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/[.06] bg-white/[.025] px-4 py-3">
            <div className="lg:hidden">
              <AliasMark />
            </div>

            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[.24em] text-white/30">
                Alias Dashboard
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-xs uppercase tracking-[.18em] text-white/50 transition hover:border-white/20 hover:text-white"
              >
                <LogOut size={14} />
                Logout
              </button>

              <Menu className="text-white/60 lg:hidden" />
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45 }}
              className="mx-auto max-w-7xl py-6"
            >
              <Page active={active} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}