export function Availability() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
          Restaurant settings
        </p>

        <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
          Availability
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
          Manage your weekly opening schedule and special closures for holidays,
          private events, or unexpected shutdowns.
        </p>
    </div>

    <div className="rounded-3xl border border-white/10 bg-white/[.02] p-6">
      <p className="text-xs uppercase tracking-[.22em] text-white/35">
        Weekly schedule
      </p>

      <h2 className="mt-2 font-display text-3xl font-light">
        Regular opening hours
      </h2>

      <p className="mt-3 text-sm text-white/45">
        This section will allow the restaurant to update opening days and
        opening hours after onboarding.
      </p>
    </div>

    <div className="rounded-3xl border border-white/10 bg-white/[.02] p-6">
      <p className="text-xs uppercase tracking-[.22em] text-white/35">
        Special closures
      </p>

      <h2 className="mt-2 font-display text-3xl font-light">
        Holidays and exceptions
      </h2>

      <p className="mt-3 text-sm text-white/45">
        Add holidays, private events, or unexpected closures so the AI
        concierge never confirms reservations when the restaurant is closed.
      </p>

      <button className="mt-6 rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:border-white/25">
        Add special closure
      </button>
    </div>
  </div>
 );
}

