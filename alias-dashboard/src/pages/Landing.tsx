import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  Globe2,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Table2,
} from 'lucide-react';

import { AliasMark } from '@/components/Brand';
import { cyan } from '@/lib/data';

const features = [
  {
    icon: Clock,
    title: '24/7 Reservations',
    text: 'Let guests book at any time, even outside opening hours.',
  },
  {
    icon: MessageSquare,
    title: 'AI Concierge',
    text: 'A conversational assistant that handles bookings, questions and special requests.',
  },
  {
    icon: Table2,
    title: 'Smart Table Management',
    text: 'Manage tables, capacity and availability from one clean workspace.',
  },
  {
    icon: LayoutDashboard,
    title: 'Restaurant Dashboard',
    text: 'Track reservations, guests and live activity in real time.',
  },
  {
    icon: Globe2,
    title: 'Multilingual Support',
    text: 'Communicate with guests in their preferred language.',
  },
  {
    icon: ShieldCheck,
    title: 'You Stay in Control',
    text: 'Alias respects your opening hours, availability and restaurant rules.',
  },
];

const steps = [
  'Create your account',
  'Start your 7-day free trial',
  'Configure your restaurant',
  'Launch your AI concierge',
];

export function Landing() {
  function goToAuth() {
    window.location.href = '/auth';
  }

  return (
    <main className="grain min-h-screen overflow-hidden bg-ink text-white">
      <div
        className="fixed inset-0 -z-10 opacity-[.06]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(circle at 50% 20%, black, transparent 72%)',
        }}
      />

      <div
        className="fixed left-1/2 top-0 -z-10 h-[620px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `${cyan}14` }}
      />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <AliasMark />

        <div className="flex items-center gap-3">
          <button
            onClick={goToAuth}
            className="hidden rounded-full border border-white/10 px-5 py-2 text-sm text-white/60 transition hover:border-white/20 hover:text-white sm:block"
          >
            Login
          </button>

          <button
            onClick={goToAuth}
            className="rounded-full px-5 py-2 text-sm font-medium text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            Start Free Trial
          </button>
        </div>
      </header>

      <section className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-14 px-6 py-14 lg:grid-cols-[1fr_520px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[.34em] text-white/35">
            AI Reservations for Modern Restaurants
          </p>

          <h1 className="mt-8 max-w-4xl font-display text-5xl font-light leading-[1.02] tracking-[-.05em] text-white md:text-7xl">
            Never miss a reservation again
            <span style={{ color: cyan }}>.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/55">
            Alias helps restaurants automate bookings, manage availability,
            and provide guests with a modern AI-powered reservation experience.
            All from a single workspace.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={goToAuth}
              className="group flex items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-medium text-black transition hover:opacity-90"
              style={{ background: cyan }}
            >
              Start Your 7-Day Free Trial
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </button>

            <a
              href="mailto:hello@aliasconcierge.com"
              className="flex items-center justify-center rounded-full border border-white/10 px-7 py-4 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Contact Us
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-5 text-sm text-white/40">
            <span>No setup fees</span>
            <span>•</span>
            <span>7-day free trial</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="glass relative rounded-[2rem] p-5"
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-[#050707]/80 p-5">
            <div className="mb-8 flex items-center justify-between">
              <AliasMark />
              <span
                className="rounded-full px-3 py-1 text-xs font-medium text-black"
                style={{ background: cyan }}
              >
                Live AI
              </span>
            </div>

            <p className="text-xs uppercase tracking-[.28em] text-white/35">
              Overview
            </p>

            <h2 className="mt-3 font-display text-4xl font-light text-white">
              Welcome, Restaurant.
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Live operational overview powered by Alias Concierge AI.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ['Reservations', '14'],
                ['Confirmed', '12'],
                ['Concierge', 'Live'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/8 bg-white/[.035] p-4"
                >
                  <p className="text-[10px] uppercase tracking-[.22em] text-white/35">
                    {label}
                  </p>
                  <p className="mt-3 font-display text-3xl text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[.025] p-4">
              <p className="text-sm text-white/70">Recent activity</p>

              <div className="mt-4 space-y-3 text-sm text-white/45">
                <div className="flex justify-between">
                  <span>New reservation</span>
                  <span>Table 4 · 08:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Reservation confirmed</span>
                  <span>Table 2 · 07:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Guest request captured</span>
                  <span>AI Concierge</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[.34em] text-white/35">
            What Alias does
          </p>

          <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
            Your digital front desk, working for you.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="glass rounded-3xl p-6 transition hover:border-white/15"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
                  style={{ color: cyan }}
                >
                  <Icon size={22} />
                </div>

                <h3 className="mt-6 text-lg font-medium text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-relaxed text-white/45">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[.34em] text-white/35">
              Getting started
            </p>

            <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
              Launch your AI concierge in minutes.
            </h2>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="glass flex items-center gap-5 rounded-3xl p-5"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-medium text-black"
                  style={{ background: cyan }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>

                <p className="text-lg text-white/75">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="glass rounded-[2rem] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[.34em] text-white/35">
                Pricing
              </p>

              <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
                Start free. Grow with Alias.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
                Experience the complete Alias platform before subscribing.
                Built for independent restaurants, fine dining venues, cafés,
                hotel restaurants and hospitality groups.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[.035] p-7">
              <div className="flex items-center gap-3 text-white/60">
                <CalendarCheck size={22} style={{ color: cyan }} />
                <span>7-day free trial</span>
              </div>

              <div className="mt-8">
                <span
                  className="font-display text-6xl font-light"
                  style={{ color: cyan }}
                >
                  €99
                </span>
                <span className="ml-2 text-white/40">/month</span>
              </div>

              <ul className="mt-7 space-y-3 text-sm text-white/55">
                <li>✓ Unlimited reservations</li>
                <li>✓ Unlimited guests</li>
                <li>✓ Unlimited AI conversations</li>
                <li>✓ Direct email support</li>
              </ul>

              <button
                onClick={goToAuth}
                className="mt-8 w-full rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
                style={{ background: cyan }}
              >
                Start Your Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <Sparkles className="mx-auto" size={34} style={{ color: cyan }} />

        <h2 className="mt-6 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
          Transform the way your restaurant manages reservations.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
          Give your guests a better booking experience while your team stays in
          control.
        </p>

        <button
          onClick={goToAuth}
          className="mt-10 rounded-full px-8 py-4 text-sm font-medium text-black transition hover:opacity-90"
          style={{ background: cyan }}
        >
          Start Your Free Trial
        </button>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
        <span>Alias Concierge</span>
        <span>AI Reservations for Modern Restaurants</span>
        <a href="mailto:hello@aliasconcierge.com" className="hover:text-white">
          hello@aliasconcierge.com
        </a>
      </footer>
    </main>
  );
}