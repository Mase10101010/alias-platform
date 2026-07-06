import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Globe2,
  LayoutDashboard,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Table2,
  Zap,
} from 'lucide-react';

import { AliasMark } from '@/components/Brand';
import { cyan } from '@/lib/data';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

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
  {
    title: 'Create your account',
    text: 'Sign up with your email and create your restaurant workspace.',
  },
  {
    title: 'Start your free trial',
    text: 'Activate your 7-day trial and explore the complete platform.',
  },
  {
    title: 'Configure your restaurant',
    text: 'Set opening hours, tables, capacity and preferences.',
  },
  {
    title: 'Launch your AI concierge',
    text: 'Your AI assistant goes live and starts helping your guests.',
  },
];

const benefits = [
  'AI-powered reservation assistant',
  'Real-time availability management',
  'Public booking page',
  'QR code access for guests',
  'Reservation dashboard',
  'Multilingual support',
  'Direct email support',
  'Continuous improvements',
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

      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 40, 0],
          opacity: [0.16, 0.28, 0.16],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="fixed left-1/2 top-0 -z-10 h-[620px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `${cyan}22` }}
      />

      <motion.div
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 60, -30, 0],
          opacity: [0.06, 0.16, 0.06],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="fixed right-[-240px] top-[420px] -z-10 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: `${cyan}20` }}
      />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <AliasMark />

        <div className="flex items-center gap-3">
          <button
            onClick={goToAuth}
            className="hidden rounded-full border border-white/10 px-5 py-2 text-sm text-white/60 transition hover:border-white/20 hover:text-white sm:block"
          >
            Login
          </button>

          <motion.button
            onClick={goToAuth}
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full px-5 py-2 text-sm font-medium text-black shadow-[0_0_35px_rgba(92,242,255,0.18)] transition hover:shadow-[0_0_55px_rgba(92,242,255,0.34)]"
            style={{ background: cyan }}
          >
            Start Free Trial
          </motion.button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[82vh] max-w-7xl items-center gap-14 px-6 py-14 lg:grid-cols-[1fr_540px]">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs uppercase tracking-[.34em] text-white/35"
          >
            AI Reservations for Modern Restaurants
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="mt-8 max-w-4xl font-display text-5xl font-light leading-[1.02] tracking-[-.055em] text-white md:text-7xl"
          >
            Never miss a reservation again
            <span style={{ color: cyan }}>.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-white/55"
          >
            Alias helps restaurants automate bookings, manage availability,
            and provide guests with a modern AI-powered reservation experience.
            All from a single workspace.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <motion.button
              onClick={goToAuth}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-medium text-black shadow-[0_0_35px_rgba(92,242,255,0.18)] transition hover:shadow-[0_0_60px_rgba(92,242,255,0.38)]"
              style={{ background: cyan }}
            >
              Start Your 7-Day Free Trial
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </motion.button>

            <a
              href="mailto:hello@aliasconcierge.com"
              className="flex items-center justify-center rounded-full border border-white/10 px-7 py-4 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Contact Us
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap gap-5 text-sm text-white/40"
          >
            <span>No setup fees</span>
            <span>•</span>
            <span>7-day free trial</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
          transition={{
            opacity: { duration: 0.8, delay: 0.15 },
            scale: { duration: 0.8, delay: 0.15 },
            y: {
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          className="glass relative rounded-[2rem] p-5 shadow-[0_0_80px_rgba(92,242,255,0.08)]"
        >
          <div
            className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl"
            style={{ background: `${cyan}28` }}
          />

          <div className="rounded-[1.5rem] border border-white/10 bg-[#050707]/85 p-5">
            <div className="mb-8 flex items-center justify-between">
              <AliasMark />
              <motion.span
                animate={{ opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="rounded-full px-3 py-1 text-xs font-medium text-black"
                style={{ background: cyan }}
              >
                Live AI
              </motion.span>
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
              ].map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.12 }}
                  className="rounded-2xl border border-white/8 bg-white/[.035] p-4"
                >
                  <p className="text-[10px] uppercase tracking-[.22em] text-white/35">
                    {label}
                  </p>
                  <p className="mt-3 font-display text-3xl text-white">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[.025] p-4">
              <p className="text-sm text-white/70">Recent activity</p>

              <div className="mt-4 space-y-3 text-sm text-white/45">
                {[
                  ['New reservation', 'Table 4 · 08:30 PM'],
                  ['Reservation confirmed', 'Table 2 · 07:30 PM'],
                  ['Guest request captured', 'AI Concierge'],
                ].map(([left, right], index) => (
                  <motion.div
                    key={left}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.9 + index * 0.25,
                      duration: 0.5,
                    }}
                    className="flex justify-between"
                  >
                    <span>{left}</span>
                    <span>{right}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[.025] p-4">
              <div className="flex items-start gap-3">
                <div
                  className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ background: `${cyan}18`, color: cyan }}
                >
                  <Sparkles size={17} />
                </div>

                <div>
                  <p className="text-sm text-white/75">
                    Your AI concierge is live
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/38">
                    Guests can book, ask questions, and make requests 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[.34em] text-white/35">
            What Alias does
          </p>

          <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
            Your digital front desk, working for you.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="glass group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_0_45px_rgba(92,242,255,0.08)]"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 transition group-hover:scale-110"
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
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
          >
            <p className="text-xs uppercase tracking-[.34em] text-white/35">
              Getting started
            </p>

            <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
              Launch your AI concierge in minutes.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-4"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="glass flex items-center gap-5 rounded-3xl p-5 transition hover:-translate-y-1 hover:border-white/15"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-medium text-black"
                  style={{ background: cyan }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div>
                  <p className="text-lg text-white/80">{step.title}</p>
                  <p className="mt-1 text-sm text-white/40">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>  
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75 }}
          className="glass overflow-hidden rounded-[2rem] p-8 md:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[.34em] text-white/35">
                AI Concierge
              </p>

              <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
                Real conversations. Real reservations.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
                Alias handles reservations, checks availability, answers guest
                questions and collects booking details — while your team stays
                in control from the dashboard.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Save time', 'Automate repetitive requests'],
                  ['Increase bookings', 'Capture demand 24/7'],
                  ['Happy guests', 'Faster responses'],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/8 bg-white/[.025] p-4"
                  >
                    <p className="text-sm text-white/75">{title}</p>
                    <p className="mt-2 text-sm text-white/38">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="rounded-3xl border border-white/10 bg-[#050707]/80 p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[.24em] text-white/35">
                  Live conversation
                </p>
                <span className="flex items-center gap-2 text-xs text-white/45">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: cyan }}
                  />
                  Live
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="max-w-[85%] rounded-2xl bg-white/[.06] p-4 text-white/65">
                  Hello! I’m your AI concierge. How can I assist you today?
                </div>

                <div
                  className="ml-auto max-w-[85%] rounded-2xl p-4 text-black"
                  style={{ background: cyan }}
                >
                  I need a table for 4 people this Friday around 7:30pm
                </div>

                <div className="max-w-[90%] rounded-2xl bg-white/[.06] p-4 text-white/65">
                  Great news! I found availability for Friday at 7:30pm for 4
                  guests. Would you like me to confirm this table?
                </div>

                <div
                  className="ml-auto max-w-[85%] rounded-2xl p-4 text-black"
                  style={{ background: cyan }}
                >
                  Perfect, please book it!
                </div>

                <div className="max-w-[90%] rounded-2xl bg-white/[.06] p-4 text-white/65">
                  Done! Your table is booked. See you on Friday.
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="glass rounded-[2rem] p-8 md:p-10"
          >
            <p className="text-xs uppercase tracking-[.34em] text-white/35">
              Everything you need
            </p>

            <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-5xl">
              All in one place.
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-black"
                    style={{ background: cyan }}
                  >
                    <Check size={14} />
                  </div>
                  <span className="text-white/55">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="glass rounded-[2rem] p-8 md:p-10"
          >
            <p className="text-xs uppercase tracking-[.34em] text-white/35">
              Pricing
            </p>

            <div className="mt-6 flex items-center gap-3 text-white/60">
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

            <motion.button
              onClick={goToAuth}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 w-full rounded-full px-5 py-3 text-sm font-medium text-black shadow-[0_0_35px_rgba(92,242,255,0.18)] transition hover:shadow-[0_0_55px_rgba(92,242,255,0.34)]"
              style={{ background: cyan }}
            >
              Start Your Free Trial
            </motion.button>

            <p className="mt-4 text-center text-xs text-white/35">
              No setup fees. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75 }}
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Zap className="mx-auto" size={36} style={{ color: cyan }} />
          </motion.div>

          <h2 className="mt-6 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
            Transform the way your restaurant manages reservations.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            Give your guests a better booking experience while your team stays
            in control.
          </p>

          <motion.button
            onClick={goToAuth}
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 rounded-full px-8 py-4 text-sm font-medium text-black shadow-[0_0_35px_rgba(92,242,255,0.18)] transition hover:shadow-[0_0_60px_rgba(92,242,255,0.38)]"
            style={{ background: cyan }}
          >
            Start Your Free Trial
          </motion.button>
        </motion.div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
        <span>Alias Concierge</span>
        <span>AI Reservations for Modern Restaurants</span>

        <a
          href="mailto:hello@aliasconcierge.com"
          className="flex items-center gap-2 hover:text-white"
        >
          <Mail size={15} />
          hello@aliasconcierge.com
        </a>
      </footer>
    </main>
  );
}      