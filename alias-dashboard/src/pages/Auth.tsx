import { motion } from 'framer-motion';
import { AliasMark } from '@/components/Brand';
import { cyan } from '@/lib/data';

export function Auth({ onEnter }: { onEnter: () => void }) {
  return (
    <main className="grain relative min-h-screen overflow-hidden bg-ink">
      <div className="absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(circle at 50% 25%, black, transparent 70%)' }} />
      <div className="absolute left-1/2 top-24 h-[520px] w-[720px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: `${cyan}18` }} />
      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_440px] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
            <AliasMark />
            <h1 className="mt-14 font-display text-5xl font-light leading-[1.02] tracking-[-.04em] text-white md:text-7xl">AI operations for places where service matters<span style={{ color: cyan }}>.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/55">Create your restaurant workspace, configure your AI concierge, and begin the 14-day trial in minutes.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .15 }} className="glass rounded-3xl p-7">
            <p className="text-[11px] uppercase tracking-[0.26em] text-white/40">Private beta</p>
            <h2 className="mt-3 font-display text-3xl font-light text-white">Create your Alias account</h2>
            <div className="mt-8 space-y-4">
              <input className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25" placeholder="Work email" />
              <input className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25" placeholder="Password" type="password" />
              <button onClick={onEnter} className="w-full rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90" style={{ background: cyan }}>Start 14-day trial</button>
            </div>
            <p className="mt-5 text-center text-sm text-white/38">No installation required. Cancel anytime.</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
